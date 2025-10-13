import { Resend } from "resend";

// Temporarily disable for testing - replace with actual key
const resendKey = process.env.RESEND_API_KEY || "dummy_resend_key";

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY not found - using dummy key for testing");
}

const resend = new Resend(resendKey);

interface CustomerData {
  name: string;
  email: string;
  companyName: string;
  selectedPackage: string;
  businessField: string[];
  packageAnswers: Record<string, string | string[]>;
  selectedAddons: string[];
  maintenanceRequired: boolean;
  logo?: string;
  brandColors?: string;
  contentInfo?: string;
  hasDomain: string;
  domainName?: string;
  hasSocialMedia: string;
  socialMediaAccounts: string[];
  projectDescription?: string;
  specialRequirements?: string;
  exampleSites?: string;
  additionalNotes?: string;
}

export const sendWelcomeEmail = async (
  customerData: CustomerData
): Promise<void> => {
  try {
    // Skip email if using dummy key
    if (resendKey === "dummy_resend_key") {
      console.log("📧 Skipping email sending (dummy key)");
      return;
    }

    await resend.emails.send({
      from: "noreply@toptanmarketiz.com",
      to: customerData.email,
      subject: "🎉 Siparişiniz alındı - Web sitenizi başlatıyoruz!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #171719; margin-bottom: 20px;">Merhaba ${customerData.name}! 👋</h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            <strong>${customerData.selectedPackage}</strong> paketiniz için siparişiniz başarıyla alındı! 
            Ekibimiz ${customerData.companyName} için harika bir web sitesi hazırlıyor.
          </p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #1f2937;">📋 Sipariş Detaylarınız:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>Paket:</strong> ${customerData.selectedPackage}</li>
              <li><strong>İş Alanı:</strong> ${Array.isArray(customerData.businessField) ? customerData.businessField.join(", ") : customerData.businessField || "Belirtilmemiş"}</li>
              ${customerData.selectedAddons && customerData.selectedAddons.length > 0 ? `<li><strong>Ek Hizmetler:</strong> ${customerData.selectedAddons.join(", ")}</li>` : ""}
              ${customerData.hasDomain === "yes" && customerData.domainName ? `<li><strong>Domain:</strong> ${customerData.domainName}</li>` : ""}
              ${customerData.hasSocialMedia === "yes" && customerData.socialMediaAccounts && customerData.socialMediaAccounts.length > 0 ? `<li><strong>Sosyal Medya:</strong> ${customerData.socialMediaAccounts.join(", ")}</li>` : ""}
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color:rgb(72, 70, 69);">🚀 Sırada Ne Var?</h3>
            <p style="margin-bottom: 10px; color: #92400e;">Formunuzdan aldığımız bilgilere göre:</p>
            <ul style="margin: 0; padding-left: 20px; color:rgb(73, 73, 73);">
              ${customerData.logo ? "<li>✅ Logo bilgisi alındı</li>" : "<li>📝 Logo bilgisi eksik - ekleyebilirsiniz</li>"}
              ${customerData.brandColors ? "<li>✅ Marka renkleri alındı</li>" : "<li>📝 Marka renkleri eksik - ekleyebilirsiniz</li>"}
              ${customerData.contentInfo ? "<li>✅ İçerik bilgileri alındı</li>" : "<li>📝 İçerik bilgileri eksik - ekleyebilirsiniz</li>"}
              ${customerData.exampleSites ? "<li>✅ Örnek siteler alındı</li>" : "<li>📝 Örnek siteler eksik - ekleyebilirsiniz</li>"}
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Formunuzdan aldığımız bilgilerle çalışmaya başlıyoruz. 
            Eksik bilgiler varsa bu e-postaya yanıt vererek ekleyebilirsiniz.
            <strong>2-3 iş günü içinde</strong> size tasarım önerilerini sunacağız!
          </p>

          ${
            customerData.logo ||
            customerData.brandColors ||
            customerData.contentInfo ||
            customerData.projectDescription ||
            customerData.specialRequirements ||
            customerData.exampleSites ||
            customerData.additionalNotes
              ? `
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; color: #1e293b;">📝 Formunuzdan Alınan Detaylı Bilgiler:</h3>
            ${customerData.logo ? `<p style="margin: 5px 0; color: #475569;"><strong>Logo:</strong> ${customerData.logo}</p>` : ""}
            ${customerData.brandColors ? `<p style="margin: 5px 0; color: #475569;"><strong>Marka Renkleri:</strong> ${customerData.brandColors}</p>` : ""}
            ${customerData.contentInfo ? `<p style="margin: 5px 0; color: #475569;"><strong>İçerik Bilgileri:</strong> ${customerData.contentInfo}</p>` : ""}
            ${customerData.projectDescription ? `<p style="margin: 5px 0; color: #475569;"><strong>Proje Açıklaması:</strong> ${customerData.projectDescription}</p>` : ""}
            ${customerData.specialRequirements ? `<p style="margin: 5px 0; color: #475569;"><strong>Özel Gereksinimler:</strong> ${customerData.specialRequirements}</p>` : ""}
            ${customerData.exampleSites ? `<p style="margin: 5px 0; color: #475569;"><strong>Örnek Siteler:</strong> ${customerData.exampleSites}</p>` : ""}
            ${customerData.additionalNotes ? `<p style="margin: 5px 0; color: #475569;"><strong>Ek Notlar:</strong> ${customerData.additionalNotes}</p>` : ""}
          </div>
          `
              : ""
          }

          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:info@moydus.com" style="background-color: #1c1c1c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Bize Ulaşın
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Sorularınız için: <a href="mailto:info@moydus.com" style="color: #1c1c1c;">info@moydus.com</a><br>
            Moydus Web Solutions
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailParams): Promise<void> => {
  try {
    // Skip email if using dummy key
    if (resendKey === "dummy_resend_key") {
      console.log("📧 Skipping email sending (dummy key)");
      console.log("📧 Would send email to:", to, "Subject:", subject);
      return;
    }

    await resend.emails.send({
      from: "noreply@toptanmarketiz.com",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  url: string
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #171719; margin-bottom: 20px;">🔐 Password Reset Request</h1>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        We received a request to reset your password. Click the button below to create a new password:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #171719; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
        If you didn't request this, you can safely ignore this email.
        This link will expire in 1 hour.
      </p>

      <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
        Or copy and paste this URL into your browser:<br>
        <a href="${url}" style="color: #171719; word-break: break-all;">${url}</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html,
  });
};

export const sendVerificationEmail = async (
  email: string,
  url: string
): Promise<void> => {
  // Log the URL for debugging
  console.log("🔗 Verification email URL:", url);

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #171719; font-size: 28px; font-weight: 600; margin: 0;">Welcome to Moydus</h1>
        <p style="color: #6b7280; font-size: 16px; margin: 8px 0 0 0;">Verify your email address</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 12px; padding: 32px; margin-bottom: 32px;">
        <p style="font-size: 18px; line-height: 1.6; margin: 0 0 24px 0; color: #374151;">
          Thanks for signing up! Click the button below to verify your email address and complete your registration.
        </p>

        <div style="text-align: center;">
          <a href="${url}" style="background-color: #171719; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; transition: all 0.2s;">
            Verify Email
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        <p style="font-size: 14px; color: #171719; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 0;">
          ${url}
        </p>
      </div>

      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    html,
  });
};

export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: string
): Promise<void> => {
  let subject = "Your Verification Code";
  let title = "🔐 Verification Code";
  let description = "Use this code to verify your email address:";

  if (type === "sign-in") {
    title = "🔐 Sign In Code";
    subject = "Your Sign In Code";
    description = "Use this code to sign in to your account:";
  } else if (type === "email-verification") {
    title = "✉️ Email Verification Code";
    subject = "Verify Your Email Address";
    description = "Use this code to verify your email address:";
  } else if (type === "forget-password") {
    title = "🔒 Password Reset Code";
    subject = "Reset Your Password";
    description = "Use this code to reset your password:";
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #171719; margin-bottom: 20px;">${title}</h1>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        ${description}
      </p>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2563eb; font-family: monospace;">
          ${otp}
        </div>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
        This code will expire in 10 minutes.
      </p>

      <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
        If you didn't request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
};

export const sendSlackNotification = async (
  customerData: CustomerData
): Promise<void> => {
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.log("SLACK_WEBHOOK_URL not configured, skipping notification");
    return;
  }

  try {
    const message = {
      text: `🚀 Yeni müşteri: ${customerData.name}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `🚀 Yeni Müşteri: ${customerData.name}`,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Şirket:* ${customerData.companyName}`,
            },
            {
              type: "mrkdwn",
              text: `*E-posta:* ${customerData.email}`,
            },
            {
              type: "mrkdwn",
              text: `*Paket:* ${customerData.selectedPackage}`,
            },
            {
              type: "mrkdwn",
              text: `*İş Alanı:* ${customerData.businessField}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*İstenen Özellikler:* ${customerData.requiredFeatures.join(", ")}`,
          },
        },
        ...(customerData.selectedAddons.length > 0
          ? [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*Ek Hizmetler:* ${customerData.selectedAddons.join(", ")}`,
                },
              },
            ]
          : []),
        {
          type: "divider",
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Zaman: ${new Date().toLocaleString("tr-TR")}`,
            },
          ],
        },
      ],
    };

    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error sending Slack notification:", error);
  }
};

// Signup için email doğrulama template'i
export const sendMagicLinkEmail = async (
  email: string,
  token: string,
  url: string
): Promise<void> => {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #171719; font-size: 28px; font-weight: 600; margin: 0;">Welcome to Moydus</h1>
        <p style="color: #6b7280; font-size: 16px; margin: 8px 0 0 0;">Verify your email address</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 12px; padding: 32px; margin-bottom: 32px;">
        <p style="font-size: 18px; line-height: 1.6; margin: 0 0 24px 0; color: #374151;">
          Thanks for signing up! Click the button below to verify your email address and complete your registration.
        </p>

        <div style="text-align: center;">
          <a href="${url}" style="background-color: #171719; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; transition: all 0.2s;">
            Verify Email
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        <p style="font-size: 14px; color: #171719; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 0;">
          ${url}
        </p>
      </div>

      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Verify your email address - Moydus",
    html,
  });
};

// Login için magic link template'i
export const sendLoginMagicLinkEmail = async (
  email: string,
  token: string,
  url: string
): Promise<void> => {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #171719; font-size: 28px; font-weight: 600; margin: 0;">Welcome back to Moydus</h1>
        <p style="color: #6b7280; font-size: 16px; margin: 8px 0 0 0;">Your secure login link</p>
      </div>

      <div style="background-color: #f9fafb; border-radius: 12px; padding: 32px; margin-bottom: 32px;">
        <p style="font-size: 18px; line-height: 1.6; margin: 0 0 24px 0; color: #374151;">
          Click the button below to log into Moydus. Your link expires in 1 hour.
        </p>

        <div style="text-align: center;">
          <a href="${url}" style="background-color: #171719; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; transition: all 0.2s;">
            Log into Moydus
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        <p style="font-size: 14px; color: #171719; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 0;">
          ${url}
        </p>
      </div>

      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          This link expires in 1 hour. If you didn't request this login link, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Your Moydus login link",
    html,
  });
};
