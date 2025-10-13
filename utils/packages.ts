// Paket bilgileri (Starter, Business, E-commerce)

export interface Package {
  name: string;
  price: number;
  priceRange?: string;
  description: string;
  features: string[];
  optionalAddons?: string[];
  maintenanceRequired?: boolean;
  maintenancePrice?: string;
}

export const PACKAGES: Record<"Starter" | "Business" | "Ecommerce", Package> = {
  Starter: {
    name: "Starter Website",
    price: 1500,
    description: "Corporate showcase website - Professional look and basic functionality",
    features: [
      "✔️ 1–5 pages (corporate showcase website)",
      "✔️ Contact form + mail sender",
      "✔️ 7/24 support",
      "✔️ UI/UX design",
      "✔️ Responsive design (mobile compatible)",
      "✔️ Basic SEO setup (Google Console, sitemap, meta)",
      "✔️ Performance optimization (speed / security)",
      "✔️ Default language: English",
      "✔️ Premium SSL / trust ",
      "✔️ Dynamic title & content (city/state schema)",
      "✔️ Google Analytics / Search Console integration",
      "✔️ Basic WhatsApp Button (manual redirection)"
    ],
    optionalAddons: [
      "DOMAIN_SETUP|Domain Setup (+$80 one-time)",
      "MANAGED_HOSTING|Managed Hosting (+$150/month)", 
      "BUSINESS_EMAIL|Business Email (+$30/month)",
      "BLOG_INTEGRATION|Blog Integration (+$100 one-time)"
    ],
    maintenanceRequired: true,
    maintenancePrice: "$100/mo (Required)"
  },
  Business: {
    name: "Business Website",
    price: 2500,
    priceRange: "$2,500",
    description: "Advanced features and customized design for your business website",
    features: [
      "✔️ Custom UI/UX design",
      "✔️ Appointment system",
      "✔️ Responsive design (mobile compatible)",
      "✔️ Multi-form step-one // mail sender",
      "✔️ Zapier / Make — or custom form google table",
      "✔️ CMS integration (WordPress, Strapi, Sanity Headless CMS Custom CMS)",
      "✔️ SEO optimization (meta, schema, dynamic content)",
      "✔️ Content analysis + visual/icon support",
      "✔️ Responsive + Performance focused",
      "✔️ Multilingual support (i18n, dynamic translations max-3)",
      "✔️ Google Analytics, Console, sitemap, structured data advanced (dynamic on page)",
      "✔️ Local SEO + GEO advanced (schema.org, Google Business Profile setup)",
      "✔️ Subdomain integration (e.g: blog.company.com)",
      "✔️ Premium SSL / trust ",
      "✔️ Business → Smart WhatsApp Button + All in One + mail + CRM integration",
      "✔️ Smart WhatsApp Button (form data to WhatsApp)"
    ],
    optionalAddons: [
      "DOMAIN_SETUP|Domain Setup (+$80 one-time)",
      "MANAGED_HOSTING|Managed Hosting (+$150/month)",
      "BUSINESS_EMAIL|Business Email (+$30/month)",
      "CRM_CMS_INTEGRATION|CRM & CMS Integration (+$300/month)",
      "CONTACT_LEAD_MANAGEMENT|Contact / Lead Management (+$300/month)",
      "WHATSAPP_BOT_UPGRADE|AI-Powered WhatsApp Bot (+$200 one-time)",
      "AI_CHATBOT_SUPPORT|AI Chatbot / 7/24 Support (+$70/month)",
      "MULTILINGUAL_SUPPORT|Multi-language Support (+$200 one-time)"
    ],
    maintenanceRequired: true,
    maintenancePrice: "$200/mo (Required)"
  },
  Ecommerce: {
    name: "E-commerce Website",
    price: 3500,
    priceRange: "$3,500+",
    description: "Fully-featured e-commerce site - Sales and customer management",
    features: [
      "✔️ Shopify / WordPress / Custom e-commerce Design with admin dashboard",
      "✔️ Payment gateway integration (PayPal-Stripe or custom)",
      "✔️ Stock / shipping / customer management panels",
      "✔️ Responsive design (mobile compatible)",
      "✔️ SEO + GEO & Conversion optimization",
      "✔️ Custom UI/UX design",
      "✔️ Dynamic content + multilingual support",
      "✔️ Competitor analysis and keyword strategies",
      "✔️ B2B, B2C vendor",
      "✔️ Mail provider",
      "✔️ Premium SSL / trust ",
      "✔️ Advanced schema (product, review, local business, FAQ)",
      "✔️ Analytics + A/B testing + Conversion funnels"
    ],
    optionalAddons: [
      "DOMAIN_SETUP|Domain Setup (+$80 one-time)",
      "MANAGED_HOSTING|Managed Hosting (+$150/month)",
      "BUSINESS_EMAIL|Business Email (+$30/month)",
      "BULK_WHATSAPP|Bulk WhatsApp Messaging (+$300/month)",
      "CONTACT_LEAD_MANAGEMENT|Contact / Lead Management (+$300/month)",
      "CRM_CMS_INTEGRATION|CRM & CMS Integration (+$300/month)",
      "AI_CHATBOT_SUPPORT|AI Chatbot / 7/24 Support (+$70/month)",
      "WHATSAPP_BOT_UPGRADE|AI-Powered WhatsApp Bot (+$200 one-time)",
      "MULTILINGUAL_SUPPORT|Multi-language Support (+$200 one-time)"
    ],
    maintenanceRequired: true,
    maintenancePrice: "$300/mo (Required)"
  }
} as const;
  