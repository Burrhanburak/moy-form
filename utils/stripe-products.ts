// Stripe Product Definitions based on your product catalog
export interface StripeProduct {
  id: string;
  name: string;
  price: number; // in USD cents
  currency: 'usd';
  type: 'one_time' | 'recurring';
  interval?: 'month' | 'year';
  description: string;
  category: 'website' | 'maintenance' | 'addon' | 'hosting' | 'domain';
}

export const STRIPE_PRODUCTS: Record<string, StripeProduct> = {
  // Main Website Packages
  STARTER_WEBSITE: {
    id: 'starter_website',
    name: 'Starter Website',
    price: 150000, // $1,500.00 USD
    currency: 'usd',
    type: 'one_time',
    description: 'Corporate showcase website - Professional look and basic functionality',
    category: 'website'
  },
  
  BUSINESS_WEBSITE: {
    id: 'business_website',
    name: 'Business Website',
    price: 250000, // $2,500.00 USD
    currency: 'usd',
    type: 'one_time',
    description: 'Advanced features and customized design for your business website',
    category: 'website'
  },
  
  ECOMMERCE_WEBSITE: {
    id: 'ecommerce_website',
    name: 'E-commerce Website',
    price: 350000, // $3,500.00 USD
    currency: 'usd',
    type: 'one_time',
    description: 'Fully-featured e-commerce site - Sales and customer management',
    category: 'website'
  },

  // Maintenance Packages
  STARTER_MAINTENANCE: {
    id: 'starter_maintenance',
    name: 'Starter website Maintenance',
    price: 10000, // $100.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: 'Monthly maintenance for starter websites',
    category: 'maintenance'
  },

  BUSINESS_MAINTENANCE: {
    id: 'business_maintenance',
    name: 'Business Maintenance',
    price: 20000, // $200.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: 'Monthly maintenance for business websites',
    category: 'maintenance'
  },

  ECOMMERCE_MAINTENANCE: {
    id: 'ecommerce_maintenance',
    name: 'E-commerce Website Maintenance',
    price: 30000, // $300.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: 'Monthly maintenance for e-commerce websites',
    category: 'maintenance'
  },

  // Add-on Services
  BUSINESS_EMAIL: {
    id: 'business_email',
    name: 'Business Email',
    price: 3000, // $30.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: 'Professional business email hosting',
    category: 'addon'
  },

  AI_CHATBOT_SUPPORT: {
    id: 'ai_chatbot_support',
    name: 'AI Chatbot / 7/24 Support',
    price: 7000, // $70.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: '24/7 AI-powered chatbot support',
    category: 'addon'
  },

  BULK_WHATSAPP: {
    id: 'bulk_whatsapp',
    name: 'Bulk WhatsApp Messaging',
    price: 30000, // $300.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: 'Bulk WhatsApp messaging service',
    category: 'addon'
  },

  WHATSAPP_BOT_UPGRADE: {
    id: 'whatsapp_bot_upgrade',
    name: 'AI-Powered WhatsApp Bot Upgrade',
    price: 20000, // $200.00 USD one-time
    currency: 'usd',
    type: 'one_time',
    description: 'AI-powered WhatsApp bot setup and integration',
    category: 'addon'
  },

  WHATSAPP_BOT_RENEWAL: {
    id: 'whatsapp_bot_renewal',
    name: 'AI-Powered WhatsApp Bot Upgrade reneval',
    price: 2000, // $20.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: 'Monthly renewal for AI-powered WhatsApp bot',
    category: 'addon'
  },

  MANAGED_HOSTING: {
    id: 'managed_hosting',
    name: 'Managed Hosting',
    price: 15000, // $150.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: 'Managed hosting service with support',
    category: 'hosting'
  },

  DOMAIN_SETUP: {
    id: 'domain_setup',
    name: 'Domain Setup',
    price: 8000, // $80.00 USD one-time
    currency: 'usd',
    type: 'one_time',
    description: 'Professional domain setup and configuration',
    category: 'domain'
  },

  DOMAIN_RENEWAL: {
    id: 'domain_renewal',
    name: 'Domain Renewal',
    price: 10000, // $100.00 USD per year
    currency: 'usd',
    type: 'recurring',
    interval: 'year',
    description: 'Annual domain renewal service',
    category: 'domain'
  },

  BLOG_INTEGRATION: {
    id: 'blog_integration',
    name: 'Blog Integration',
    price: 10000, // $100.00 USD one-time
    currency: 'usd',
    type: 'one_time',
    description: 'Blog integration and setup',
    category: 'addon'
  },

  MULTILINGUAL_SUPPORT: {
    id: 'multilingual_support',
    name: 'Multi-language Support',
    price: 20000, // $200.00 USD one-time
    currency: 'usd',
    type: 'one_time',
    description: 'Multi-language website support',
    category: 'addon'
  },

  CONTACT_LEAD_MANAGEMENT: {
    id: 'contact_lead_management',
    name: 'Contact / Lead management - Bulk email sending',
    price: 30000, // $300.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: 'Contact and lead management system with bulk email sending capabilities',
    category: 'addon'
  },

  CRM_CMS_INTEGRATION: {
    id: 'crm_cms_integration',
    name: 'CRM & CMS integration (HubSpot, Zoho)',
    price: 30000, // $300.00 USD per month
    currency: 'usd',
    type: 'recurring',
    interval: 'month',
    description: 'Professional CRM and CMS integration with HubSpot, Zoho and other platforms',
    category: 'addon'
  }
};

// Helper functions for working with products
export const getProductsByCategory = (category: StripeProduct['category']) => {
  return Object.values(STRIPE_PRODUCTS).filter(product => product.category === category);
};

export const getMaintenanceForPackage = (packageType: 'Starter' | 'Business' | 'Ecommerce') => {
  const maintenanceMap = {
    'Starter': STRIPE_PRODUCTS.STARTER_MAINTENANCE,
    'Business': STRIPE_PRODUCTS.BUSINESS_MAINTENANCE,
    'Ecommerce': STRIPE_PRODUCTS.ECOMMERCE_MAINTENANCE
  };
  return maintenanceMap[packageType];
};

export const getWebsitePackage = (packageType: 'Starter' | 'Business' | 'Ecommerce') => {
  const packageMap = {
    'Starter': STRIPE_PRODUCTS.STARTER_WEBSITE,
    'Business': STRIPE_PRODUCTS.BUSINESS_WEBSITE,
    'Ecommerce': STRIPE_PRODUCTS.ECOMMERCE_WEBSITE
  };
  return packageMap[packageType];
};

export const formatPrice = (priceInCents: number) => {
  return `$${(priceInCents / 100).toFixed(2)} USD`;
};
