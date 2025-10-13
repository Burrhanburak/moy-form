# 🔄 Moydus Sales Funnel - Complete Implementation

A comprehensive sales funnel system for moydus.com that handles package selection, strategic brief form, payment processing, and automated customer onboarding.

## 📋 Features

### 🎯 Core Funnel Flow
1. **Package Selection** - Users arrive via URL params from Framer site
2. **Strategic Brief Form** - 4-step wizard collecting business requirements
3. **Stripe Checkout** - One-time payments + optional subscriptions
4. **Success Page** - Upsells for CRM and social media services
5. **Automated Onboarding** - Email sequences and CRM integration

### 🔧 Technical Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS, React Hook Form + Zod
- **Payments**: Stripe Checkout with webhooks
- **CRM**: Airtable integration for customer records
- **Email**: Resend for transactional emails
- **Notifications**: Slack integration for new customer alerts

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd moy-form
bun install  # or npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Customers

# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Slack/Notification (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
```

### 3. Service Configuration

#### Stripe Setup
1. Create Stripe account and get API keys
2. Configure webhook endpoint: `/api/webhook`
3. Enable events: `checkout.session.completed`, `checkout.session.expired`, `invoice.payment_succeeded`, `invoice.payment_failed`

#### Airtable Setup
1. Create base with "Customers" table
2. Required fields:
   - Name (Single line text)
   - Email (Email)
   - Phone (Phone number)
   - Company Name (Single line text)
   - Business Field (Single select)
   - Selected Package (Single select)
   - Package Price (Number)
   - Payment Status (Single select)
   - Created At (Date)

#### Resend Setup
1. Get API key from Resend dashboard
2. Verify domain for email sending

### 4. Run Development
```bash
bun dev  # or npm run dev
```

Visit `http://localhost:3000` to see the form.

## 📊 Sales Funnel URLs

The form accepts package selection via URL parameters:
- `http://localhost:3000?package=Starter`
- `http://localhost:3000?package=Business` 
- `http://localhost:3000?package=Ecommerce`

Link these from your Framer site's "Buy" buttons.

## 🎯 Package Configuration

Current packages (in `utils/packages.ts`):
- **Starter**: ₺1,000 - Basic website (1-5 pages)
- **Business**: ₺1,500 - Custom UI/UX with CMS
- **E-commerce**: ₺2,500 - Full e-commerce with mandatory ₺500/month maintenance

## 📝 Form Flow

### Step 1: Personal Information
- Name, email, phone, company name

### Step 2: Business Details  
- Industry selection
- Domain status
- Required features (package-specific)

### Step 3: Social & Services
- Social media accounts
- Additional services (logo, SEO, etc.)

### Step 4: Final Details
- Project description
- Special requirements
- Order summary

## 🔄 Automation Flow

1. **Form Submission** → Creates Airtable record + Stripe session
2. **Payment Success** → Updates Airtable + Sends welcome email + Slack notification
3. **Success Page** → Shows upsells for CRM and social media services

## 🔗 Integration Points

### Framer Links
```html
https://form.moydus.com?package=Starter
https://form.moydus.com?package=Business
https://form.moydus.com?package=Ecommerce
```

### Upsell Links
- **CRM System**: panelmanage.com
- **Social Media**: agency.moydus.com

## 📧 Email Automation

Welcome email includes:
- Order confirmation
- Next steps checklist  
- Required materials request
- Contact information

Future: Integrate with Mailchimp for onboarding sequences.

## 📊 Monitoring

- Stripe Dashboard: Payment tracking
- Airtable: Customer database
- Slack: Real-time notifications
- Webhook logs: Payment processing status

## 🛠️ Development

### Key Files
- `components/Form/Form.tsx` - Main form component
- `lib/stripe.ts` - Payment processing
- `lib/airtable.ts` - CRM integration  
- `lib/email.ts` - Email automation
- `app/api/checkout/route.ts` - Payment API
- `app/api/webhook/route.ts` - Stripe webhooks
- `utils/formSchema.ts` - Form validation

### Adding New Packages
1. Update `utils/packages.ts`
2. Add features to `utils/formSchema.ts`
3. Update Stripe pricing logic

### Customizing Form
- Modify `utils/formSchema.ts` for validation
- Update `components/Form/Form.tsx` for UI
- Add fields to Airtable integration

## 🚀 Deployment

1. **Environment**: Configure all environment variables
2. **Database**: Set up Airtable base structure  
3. **Webhooks**: Configure Stripe webhook endpoint
4. **Domain**: Update email template with actual domain
5. **Testing**: Test full flow with Stripe test mode

## 📞 Support

For issues or questions:
- Email: info@moydus.com
- Check webhook logs for payment issues
- Verify Airtable permissions
- Test email delivery in development

---

Built with ❤️ for Moydus Web Solutions
