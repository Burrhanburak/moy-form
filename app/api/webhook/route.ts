import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sendSlackNotification, sendWelcomeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { markOrderAsPaid } from "@/lib/order-utils";

// Helper function to update order with Stripe session info
async function updateOrderWithStripeSession(
  orderId: string,
  stripeData: {
    stripeSessionId: string;
    stripePaymentIntentId: string | null;
    stripeSubscriptionId: string | null;
    companyEmail: string;
  }
) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      stripeSessionId: stripeData.stripeSessionId,
      stripePaymentIntentId: stripeData.stripePaymentIntentId,
      stripeSubscriptionId: stripeData.stripeSubscriptionId,
      companyEmail: stripeData.companyEmail,
    },
  });
}

export async function POST(req: Request) {
  console.log("🚨 ============================================");
  console.log("🚨 WEBHOOK ENDPOINT HIT!");
  console.log("🚨 ============================================");

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  console.log("📋 Headers:", {
    signature: sig ? "EXISTS" : "MISSING",
    contentType: req.headers.get("content-type"),
  });

  try {
    let event;

    // Test mode - bypass signature verification
    if (sig === "test") {
      console.log("🧪 Test mode - bypassing signature verification");
      event = JSON.parse(body);
    } else {
      if (!sig) {
        console.log("❌ No signature found!");
        return new NextResponse("No signature", { status: 400 });
      }

      console.log("🔐 Verifying webhook signature...");
      console.log(
        "🔑 Using secret:",
        process.env.STRIPE_WEBHOOK_SECRET ? "SET" : "MISSING"
      );

      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      console.log("✅ Signature verified!");
    }

    console.log(`📨 Received webhook: ${event.type}`);
    console.log("🔍 Full event data:", JSON.stringify(event, null, 2));

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("🎯 Processing checkout.session.completed webhook");
        const session = event.data.object;

        console.log("🔍 Session metadata:", session.metadata);

        // Get order info from metadata
        const orderId = session.metadata?.orderId;
        const packageId = session.metadata?.packageId;
        const formEmail = session.metadata?.formEmail || session.customer_email;

        // Handle CUSTOM PACKAGE (no orderId, only packageId)
        if (!orderId && packageId) {
          console.log("📦 Processing custom package payment:", packageId);

          try {
            // Get package details
            const pkg = await prisma.packages.findUnique({
              where: { id: packageId },
              include: { user: true },
            });

            if (!pkg) {
              console.error(`❌ Package not found: ${packageId}`);
              break;
            }

            console.log(`✅ Found package: ${pkg.name}`);

            // Activate package
            await prisma.packages.update({
              where: { id: packageId },
              data: { status: "ACTIVE" },
            });
            console.log(`✅ Package activated: ${packageId}`);

            // Update user's stripeCustomerId (always update to latest)
            if (session.customer) {
              await prisma.user.update({
                where: { id: pkg.userId },
                data: { stripeCustomerId: session.customer as string },
              });
              console.log(
                `✅ Updated user stripeCustomerId: ${session.customer}`
              );
            }

            // Get customer name from Stripe session or user
            const customerName =
              session.customer_details?.name ||
              pkg.user.name ||
              "Unknown Customer";

            // Update user name if not set
            if (!pkg.user.name && session.customer_details?.name) {
              await prisma.user.update({
                where: { id: pkg.userId },
                data: { name: session.customer_details.name },
              });
              console.log(
                `✅ Updated user name: ${session.customer_details.name}`
              );
            }

            // Create Order for custom package
            const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
            const order = await prisma.order.create({
              data: {
                orderNumber,
                formEmail: pkg.user.email,
                userId: pkg.userId,
                packageId: packageId,
                packageName: pkg.name,
                selectedAddons: pkg.optionalAddons,
                businessField: [],
                packagePrice: pkg.price / 100, // Convert cents to dollars
                addOnsPrice: 0,
                totalPrice: pkg.price / 100,
                status: "PAID",
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent as string,
                stripeSubscriptionId: session.subscription as string,
                customerName: customerName,
                companyEmail: pkg.user.email,
              },
            });
            console.log(
              `✅ Order created for custom package: ${order.orderNumber}`
            );

            // If subscription exists, create Subscription record
            if (session.subscription && pkg.maintenanceRequired) {
              console.log(`📅 Creating subscription for package: ${pkg.name}`);
              console.log(`📅 Stripe subscription ID: ${session.subscription}`);

              // Fetch full subscription details from Stripe to get accurate dates
              const stripeSubscription: any =
                await stripe.subscriptions.retrieve(
                  session.subscription as string,
                  {
                    expand: ["items.data.price", "latest_invoice"],
                  }
                );

              // Get period dates from latest invoice
              let periodStart: number | undefined;
              let periodEnd: number | undefined;

              // Try to get from latest invoice
              if (
                stripeSubscription.latest_invoice &&
                typeof stripeSubscription.latest_invoice === "object"
              ) {
                const invoice = stripeSubscription.latest_invoice;
                periodStart = invoice.period_start;
                periodEnd = invoice.period_end;
              }

              // Fallback to billing_cycle_anchor
              if (!periodStart) {
                periodStart =
                  stripeSubscription.billing_cycle_anchor ||
                  stripeSubscription.start_date;
                if (periodStart) {
                  const startDate = new Date(periodStart * 1000);
                  startDate.setMonth(startDate.getMonth() + 1);
                  periodEnd = Math.floor(startDate.getTime() / 1000);
                }
              }

              console.log(
                `📅 Subscription periods - start: ${periodStart}, end: ${periodEnd}`
              );

              // Validate dates
              if (!periodStart || !periodEnd) {
                console.error(
                  "❌ Invalid subscription period dates from Stripe",
                  { periodStart, periodEnd, subscription: stripeSubscription }
                );
                throw new Error("Invalid subscription dates");
              }

              const subscription = await prisma.subscription.create({
                data: {
                  userId: pkg.userId,
                  packageId: packageId,
                  stripeSubscriptionId: session.subscription as string,
                  stripeCustomerId: session.customer as string,
                  stripePriceId:
                    session.metadata?.stripePriceId ||
                    stripeSubscription.items.data[0]?.price.id ||
                    "",
                  stripeProductId:
                    session.metadata?.stripeProductId ||
                    (typeof stripeSubscription.items.data[0]?.price.product ===
                    "string"
                      ? stripeSubscription.items.data[0]?.price.product
                      : "") ||
                    "",
                  status: "ACTIVE",
                  currentPeriodStart: new Date(periodStart * 1000),
                  currentPeriodEnd: new Date(periodEnd * 1000),
                  cancelAtPeriodEnd:
                    stripeSubscription.cancel_at_period_end || false,
                  packageName: pkg.name,
                },
              });
              console.log(`✅ Subscription created: ${subscription.id}`);
            } else {
              console.log(
                `⚠️ Subscription NOT created - session.subscription: ${session.subscription}, maintenanceRequired: ${pkg.maintenanceRequired}`
              );
            }

            // Charge setup fee if needed
            const setupFee = session.metadata?.setupFee;
            const chargeSetupFee = session.metadata?.chargeSetupFee === "true";

            if (chargeSetupFee && setupFee && session.customer) {
              console.log(
                `💰 Charging setup fee: $${parseInt(setupFee) / 100}`
              );

              try {
                const invoiceItem = await stripe.invoiceItems.create({
                  customer: session.customer as string,
                  amount: parseInt(setupFee),
                  currency: session.currency || "usd",
                  description: `Setup Fee - ${pkg.name}`,
                  metadata: {
                    packageId: packageId,
                    orderId: order.id,
                    type: "setup_fee",
                  },
                });

                console.log(`✅ Created invoice item: ${invoiceItem.id}`);

                const invoice = await stripe.invoices.create({
                  customer: session.customer as string,
                  auto_advance: true,
                  description: `Setup Fee - ${pkg.name}`,
                  metadata: {
                    packageId: packageId,
                    orderId: order.id,
                    type: "setup_fee_invoice",
                  },
                });

                console.log(`✅ Created invoice: ${invoice.id}`);

                if (invoice.id) {
                  const finalizedInvoice =
                    await stripe.invoices.finalizeInvoice(invoice.id);
                  if (finalizedInvoice.id) {
                    const paidInvoice: any = await stripe.invoices.pay(
                      finalizedInvoice.id
                    );
                    console.log(
                      `✅ Paid setup fee: ${paidInvoice.id}, status: ${paidInvoice.status}`
                    );
                  }
                }
              } catch (setupFeeError) {
                console.error("❌ Error charging setup fee:", setupFeeError);
              }
            }

            // Send notifications
            try {
              await sendSlackNotification({
                packageName: pkg.name,
                customerEmail: pkg.user.email,
                customerName: pkg.user.name,
                amount: pkg.price / 100,
                orderNumber: order.orderNumber,
              });
              console.log("✅ Slack notification sent");
            } catch (slackError) {
              console.error("⚠️ Slack notification failed:", slackError);
            }

            try {
              await sendWelcomeEmail(pkg.user.email, pkg.user.name, pkg.name);
              console.log("✅ Welcome email sent");
            } catch (emailError) {
              console.error("⚠️ Welcome email failed:", emailError);
            }
          } catch (error) {
            console.error("❌ Error processing custom package:", error);
          }

          break; // Exit after handling custom package
        }

        // Handle REGULAR ORDER (existing flow)
        if (!orderId) {
          console.error("❌ No orderId in session metadata");
          break;
        }

        console.log("🔍 Looking for order:", orderId);

        try {
          // Find the existing order
          let order = await prisma.order.findUnique({
            where: { id: orderId },
          });

          if (!order) {
            console.error(`❌ Order not found: ${orderId}`);
            break;
          }

          console.log("✅ Found order:", order.orderNumber);

          // Find user by email and update stripeCustomerId
          let linkedUserId: string | null = order.userId;

          if (session.customer && formEmail) {
            console.log(`🔍 Looking for user with email: ${formEmail}`);
            const user = await prisma.user.findUnique({
              where: { email: formEmail },
              select: { id: true, stripeCustomerId: true },
            });

            if (user) {
              console.log(`✅ Found user: ${user.id}`);

              // Update user's stripeCustomerId if not set
              if (!user.stripeCustomerId) {
                await prisma.user.update({
                  where: { id: user.id },
                  data: { stripeCustomerId: session.customer as string },
                });
                console.log(
                  `✅ Updated user stripeCustomerId: ${session.customer}`
                );
              }

              // Link order to user if not already linked
              if (!order.userId) {
                await prisma.order.update({
                  where: { id: orderId },
                  data: { userId: user.id },
                });
                console.log(`✅ Linked order to user: ${user.id}`);
                linkedUserId = user.id; // Update our local variable
              }
            } else {
              console.log(`⚠️ User not found for email: ${formEmail}`);
            }
          }

          // Check if order already has Stripe session info
          if (!order.stripeSessionId) {
            // Update order with Stripe session info
            await updateOrderWithStripeSession(orderId, {
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string,
              stripeSubscriptionId: session.subscription as string,
              companyEmail: formEmail,
            });
          } else {
            console.log(
              "ℹ️ Order already has Stripe session info, skipping update"
            );
          }

          // Activate package if this is a custom package payment
          const packageId = session.metadata?.packageId;
          if (packageId) {
            console.log(`📦 Activating package: ${packageId}`);
            try {
              await prisma.packages.update({
                where: { id: packageId },
                data: { status: "ACTIVE" },
              });
              console.log(`✅ Package activated: ${packageId}`);
            } catch (pkgError) {
              console.error("❌ Error activating package:", pkgError);
            }
          }

          // Check if this is a subscription with setup fee
          const setupFee = session.metadata?.setupFee;
          const chargeSetupFee = session.metadata?.chargeSetupFee === "true";

          if (chargeSetupFee && setupFee && session.customer) {
            console.log(`💰 Charging setup fee: $${parseInt(setupFee) / 100}`);

            try {
              // Create an invoice item for the setup fee
              const invoiceItem = await stripe.invoiceItems.create({
                customer: session.customer as string,
                amount: parseInt(setupFee),
                currency: session.currency || "usd",
                description: `Setup Fee - ${session.metadata?.packageName || "Custom Package"}`,
                metadata: {
                  packageId: session.metadata?.packageId,
                  orderId: orderId,
                  type: "setup_fee",
                },
              });

              console.log(
                `✅ Created invoice item for setup fee: ${invoiceItem.id}`
              );

              // Create and finalize the invoice
              const invoice = await stripe.invoices.create({
                customer: session.customer as string,
                auto_advance: true, // Automatically finalize and attempt payment
                description: `Setup Fee - ${session.metadata?.packageName || "Custom Package"}`,
                metadata: {
                  packageId: session.metadata?.packageId,
                  orderId: orderId,
                  type: "setup_fee_invoice",
                },
              });

              console.log(`✅ Created invoice for setup fee: ${invoice.id}`);

              // Finalize and pay the invoice
              if (invoice.id) {
                const finalizedInvoice = await stripe.invoices.finalizeInvoice(
                  invoice.id
                );
                console.log(`✅ Finalized invoice: ${finalizedInvoice.id}`);

                // Try to pay immediately
                if (finalizedInvoice.id) {
                  const paidInvoice: any = await stripe.invoices.pay(
                    finalizedInvoice.id
                  );
                  console.log(
                    `✅ Paid setup fee invoice: ${paidInvoice.id}, status: ${paidInvoice.status}`
                  );
                }
              }
            } catch (setupFeeError) {
              console.error("❌ Error charging setup fee:", setupFeeError);
              // Don't break the webhook - subscription is still active
            }
          }

          // Create subscription if maintenance is required
          if (
            session.subscription &&
            session.metadata?.maintenance_required === "true" &&
            linkedUserId
          ) {
            console.log(
              `📅 Creating subscription for order: ${order.orderNumber}`
            );
            console.log(`📅 Stripe subscription ID: ${session.subscription}`);
            console.log(`📅 User ID: ${linkedUserId}`);

            try {
              // Fetch subscription from Stripe with expanded data including latest invoice
              const stripeSubResponse = await stripe.subscriptions.retrieve(
                session.subscription as string,
                {
                  expand: ["items.data.price", "latest_invoice"],
                }
              );

              // Extract subscription data from Stripe response
              const sub = stripeSubResponse as any;

              console.log("🔍 Stripe subscription keys:", Object.keys(sub));

              // Get period dates from latest invoice
              let periodStart: number | undefined;
              let periodEnd: number | undefined;

              // Try to get from latest invoice
              if (
                sub.latest_invoice &&
                typeof sub.latest_invoice === "object"
              ) {
                const invoice = sub.latest_invoice;
                periodStart = invoice.period_start;
                periodEnd = invoice.period_end;
                console.log("🔍 Got period from latest_invoice:", {
                  periodStart,
                  periodEnd,
                });
              }

              // Fallback to subscription items
              if (!periodStart && sub.items?.data?.[0]) {
                // Calculate from billing_cycle_anchor
                periodStart = sub.billing_cycle_anchor || sub.start_date;
                // For monthly subscriptions, add 1 month
                if (periodStart) {
                  const startDate = new Date(periodStart * 1000);
                  startDate.setMonth(startDate.getMonth() + 1);
                  periodEnd = Math.floor(startDate.getTime() / 1000);
                }
                console.log("🔍 Calculated period from billing_cycle_anchor:", {
                  periodStart,
                  periodEnd,
                });
              }

              console.log("🔍 Final period values:", {
                periodStart,
                periodEnd,
                type: typeof periodStart,
              });

              // Validate dates first
              if (!periodStart || !periodEnd) {
                console.error(
                  "❌ Invalid subscription period dates from Stripe:",
                  { periodStart, periodEnd, subscription: sub }
                );
                throw new Error("Invalid subscription dates");
              }

              console.log(
                `📅 Subscription period: ${new Date(periodStart * 1000).toISOString()} - ${new Date(periodEnd * 1000).toISOString()}`
              );

              // Check if subscription already exists
              const existingSubscription = await prisma.subscription.findUnique(
                {
                  where: {
                    stripeSubscriptionId: session.subscription as string,
                  },
                }
              );

              if (!existingSubscription) {
                const subscription = await prisma.subscription.create({
                  data: {
                    userId: linkedUserId,
                    stripeSubscriptionId: session.subscription as string,
                    stripeCustomerId: session.customer as string,
                    stripePriceId:
                      session.metadata?.subscriptionPriceId || "maintenance",
                    stripeProductId:
                      session.metadata?.subscriptionProductId ||
                      "maintenance-service",
                    status: "ACTIVE",
                    currentPeriodStart: new Date(periodStart * 1000),
                    currentPeriodEnd: new Date(periodEnd * 1000),
                    cancelAtPeriodEnd: sub.cancel_at_period_end || false,
                    packageName: order.packageName,
                    businessField: order.businessField,
                    socialMediaAccounts: order.socialMediaAccounts,
                    packageAnswers: order.packageAnswers as any,
                  },
                });

                // Link subscription to order
                await prisma.order.update({
                  where: { id: orderId },
                  data: { subscriptionId: subscription.id },
                });

                console.log(`✅ Subscription created: ${subscription.id}`);
              } else {
                console.log(
                  `ℹ️ Subscription already exists: ${existingSubscription.id}`
                );

                // Link subscription to order if not linked
                if (!order.subscriptionId) {
                  await prisma.order.update({
                    where: { id: orderId },
                    data: { subscriptionId: existingSubscription.id },
                  });
                  console.log(`✅ Linked existing subscription to order`);
                }
              }
            } catch (subscriptionError) {
              console.error(
                "❌ Error creating subscription:",
                subscriptionError
              );
              // Don't break - order is still valid
            }
          } else {
            console.log(
              `⚠️ Subscription NOT created - session.subscription: ${session.subscription}, maintenance_required: ${session.metadata?.maintenance_required}, userId: ${linkedUserId}`
            );
          }

          // Mark order as paid (with subscription amount + setup fee if applicable)
          const totalAmount =
            chargeSetupFee && setupFee
              ? (session.amount_total + parseInt(setupFee)) / 100
              : session.amount_total / 100;

          await markOrderAsPaid(
            orderId,
            session.payment_intent as string,
            totalAmount, // Convert from cents to dollars
            session.currency
          );

          console.log("✅ Order marked as paid:", orderId);

          // Send Slack notification
          try {
            await sendSlackNotification({
              customerName: order.customerName,
              customerEmail: formEmail || order.formEmail,
              customerPhone: order.customerPhone,
              companyName: order.companyName,
              businessField: order.businessField,
              packageName: order.packageName,
              selectedAddons: order.selectedAddons,
              packagePrice: order.packagePrice,
              addOnsPrice: order.addOnsPrice,
              totalPrice: order.totalPrice,
              orderNumber: order.orderNumber,
              projectDescription: order.projectDescription,
              specialRequirements: order.specialRequirements,
              exampleSites: order.exampleSites,
              additionalNotes: order.additionalNotes,
            });
            console.log("✅ Slack notification sent");
          } catch (slackError) {
            console.error("❌ Slack notification failed:", slackError);
          }

          // Send welcome email
          try {
            await sendWelcomeEmail(formEmail || order.formEmail, {
              name: order.customerName,
              companyName: order.companyName,
              selectedPackage: order.packageName,
              businessField: order.businessField || [],
              selectedAddons: order.selectedAddons || [],
              hasDomain: order.hasDomain,
              domainName: order.domainName,
              hasSocialMedia: order.hasSocialMedia,
              socialMediaAccounts: order.socialMediaAccounts || [],
              packageAnswers: order.packageAnswers || {},
              additionalNotes: order.additionalNotes,
              projectRequirements: order.projectRequirements,
              totalPrice: order.totalPrice,
              orderNumber: order.orderNumber,
            });
            console.log("✅ Welcome email sent");
          } catch (emailError) {
            console.error("❌ Welcome email failed:", emailError);
          }
        } catch (orderError) {
          console.error("❌ Error processing order:", orderError);
        }

        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log("💳 Invoice payment succeeded:", invoice.id);

        // Handle subscription renewal
        if (invoice.subscription) {
          console.log(
            "🔄 Processing subscription renewal:",
            invoice.subscription
          );
          // Add any renewal logic here
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        console.log("🔄 Subscription updated:", subscription.id);

        try {
          // Find subscription in database
          const dbSubscription = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (dbSubscription) {
            // Map Stripe status to our enum
            const status = mapStripeStatus(subscription.status);

            // Update subscription in database
            await prisma.subscription.update({
              where: { stripeSubscriptionId: subscription.id },
              data: {
                status,
                currentPeriodStart: new Date(
                  subscription.current_period_start * 1000
                ),
                currentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
                canceledAt: subscription.canceled_at
                  ? new Date(subscription.canceled_at * 1000)
                  : null,
              },
            });
            console.log(`✅ Subscription updated in DB: ${subscription.id}`);
          } else {
            console.log(`⚠️ Subscription not found in DB: ${subscription.id}`);
          }
        } catch (error) {
          console.error("❌ Error updating subscription:", error);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log("🗑️ Subscription cancelled:", subscription.id);

        try {
          // Update subscription status to CANCELED
          const dbSubscription = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (dbSubscription) {
            await prisma.subscription.update({
              where: { stripeSubscriptionId: subscription.id },
              data: {
                status: "CANCELED",
                canceledAt: new Date(),
              },
            });
            console.log(
              `✅ Subscription marked as canceled in DB: ${subscription.id}`
            );
          } else {
            console.log(`⚠️ Subscription not found in DB: ${subscription.id}`);
          }
        } catch (error) {
          console.error("❌ Error canceling subscription:", error);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }
}
