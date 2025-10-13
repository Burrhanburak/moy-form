import { z } from 'zod'

export const formSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  logo: z.string().optional(),
  brandColors: z.string().optional(),
  contentInfo: z.string().optional(),

  companyName: z.string().min(2, "Şirket adı en az 2 karakter olmalıdır"),
  businessField: z.array(z.string()).min(1, "Lütfen en az bir iş alanı seçin"),

  hasDomain: z.enum(['yes', 'no'], {
    required_error: "Lütfen domain durumunuzu belirtin"
  }),
  domainName: z.string().optional(),

  // Pakete göre dinamik yanıtlar
  packageAnswers: z.record(z.union([z.string(), z.array(z.string())])).default({}),

  hasSocialMedia: z.enum(['yes', 'no'], {
    required_error: "Lütfen sosyal medya durumunuzu belirtin"
  }),
  socialMediaAccounts: z.array(z.string()).default([]),

  // New add-on system  
  selectedAddons: z.array(z.string()).default([]),
  maintenanceRequired: z.boolean().default(false),

  selectedPackage: z.enum(['Starter', 'Business', 'Ecommerce']),

  projectDescription: z.string().optional(),
  specialRequirements: z.string().optional(),
  
  // Örnek site ve notlar
  exampleSites: z.string().optional(),
  additionalNotes: z.string().optional(),
})

export type FormData = z.infer<typeof formSchema>

export const businessFieldOptions = [
  "Sağlık/Doktor/Diş Hekimi",
  "Hukuk/Avukat", 
  "E-ticaret",
  "Restoran/Yemek",
  "Emlak",
  "Eğitim/Kurs",
  "Kuaför/Güzellik",
  "Spor/Fitness",
  "Danışmanlık",
  "İnşaat/Mimarlık",
  "Teknoloji/Yazılım",
  "Muhasebe/Finans",
  "Turizm/Otel",
  "Diğer"
]

// Pakete göre spesifik sorular ve seçenekler
export const packageQuestions = {
  Starter: {
    questions: [
      {
        id: "pages",
        label: "Kaç sayfalık bir site istiyorsunuz?",
        type: "radio",
        options: ["1-2 sayfa (Ana sayfa + İletişim)", "3-4 sayfa (+ Hakkımızda, Hizmetler)", "5 sayfa (Tam paket)"]
      },
      {
        id: "features",
        label: "Hangi özellikler olsun?",
        type: "checkbox",
        options: ["İletişim formu", "Google Maps", "Sosyal medya linkler", "Galeri/Portfolio", "Blog"]
      },
      {
        id: "design",
        label: "Tasarım tercihiniz?",
        type: "radio", 
        options: ["Minimal ve sade", "Modern ve renkli", "Klasik ve kurumsal", "Sizin belirleyeceğiniz"]
      }
    ]
  },
  Business: {
    questions: [
      {
        id: "businessType",
        label: "İş alanınıza göre hangi özellikler gerekli?",
        type: "checkbox",
        options: ["Online randevu sistemi", "Hasta/Müşteri kayıt", "Ödeme alma", "Canlı destek chat", "Müşteri paneli"]
      },
      {
        id: "automation",
        label: "Hangi işlemleri otomatikleştirmek istiyorsunuz?",
        type: "checkbox",
        options: ["Randevu onayı (SMS/Email)", "Hatırlatma mesajları", "Fatura/Makbuz gönderimi", "Müşteri takibi"]
      },
      {
        id: "integrations",
        label: "Hangi sistemlerle entegrasyon istiyorsunuz?",
        type: "checkbox",
        options: ["WhatsApp Business", "Google Calendar", "Muhasebe programı", "CRM sistemi", "Hiçbiri"]
      }
    ]
  },
  Ecommerce: {
    questions: [
      {
        id: "productCount",
        label: "Kaç ürün satacaksınız?",
        type: "radio",
        options: ["1-50 ürün", "50-200 ürün", "200-1000 ürün", "1000+ ürün"]
      },
      {
        id: "paymentMethods",
        label: "Hangi ödeme yöntemlerini desteklemek istiyorsunuz?",
        type: "checkbox",
        options: ["Kredi kartı", "Havale/EFT", "Kapıda ödeme", "Taksit seçenekleri", "Kripto para"]
      },
      {
        id: "logistics",
        label: "Kargo ve lojistik ihtiyaçlarınız?",
        type: "checkbox",
        options: ["Kargo firması entegrasyonu", "Ücretsiz kargo hesaplama", "Kargo takip", "Hızlı teslimat seçenekleri"]
      },
      {
        id: "advanced",
        label: "Gelişmiş e-ticaret özellikleri?",
        type: "checkbox",
        options: ["Stok yönetimi", "Kupon sistemi", "Üye puanı", "B2B toptan satış", "Çoklu satıcı", "Mobil app"]
      }
    ]
  }
}

export const socialMediaOptions = [
  "Instagram",
  "Facebook", 
  "Twitter/X",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "WhatsApp Business"
]

// Additional services removed - now using add-on system from package selection

// Add-on options mapped to Stripe product IDs
export const addonOptions = [
  {
    id: "BUSINESS_EMAIL",
    name: "Business Email",
    description: "Professional business email hosting",
    price: "$30/month",
    type: "recurring" as const
  },
  {
    id: "AI_CHATBOT_SUPPORT",
    name: "AI Chatbot / 7/24 Support",
    description: "24/7 AI-powered chatbot support",
    price: "$70/month",
    type: "recurring" as const
  },
  {
    id: "BULK_WHATSAPP",
    name: "Bulk WhatsApp Messaging",
    description: "Bulk WhatsApp messaging service",
    price: "$300/month",
    type: "recurring" as const
  },
  {
    id: "WHATSAPP_BOT_UPGRADE",
    name: "AI-Powered WhatsApp Bot Upgrade",
    description: "AI-powered WhatsApp bot setup and integration",
    price: "$200 one-time",
    type: "one_time" as const
  },
  {
    id: "WHATSAPP_BOT_RENEWAL",
    name: "WhatsApp Bot Monthly Renewal",
    description: "Monthly renewal for AI-powered WhatsApp bot",
    price: "$20/month",
    type: "recurring" as const
  },
  {
    id: "MANAGED_HOSTING",
    name: "Managed Hosting",
    description: "Managed hosting service with support",
    price: "$150/month",
    type: "recurring" as const
  },
  {
    id: "DOMAIN_SETUP",
    name: "Domain Setup",
    description: "Professional domain setup and configuration",
    price: "$80 one-time",
    type: "one_time" as const
  },
  {
    id: "DOMAIN_RENEWAL",
    name: "Domain Renewal",
    description: "Annual domain renewal service",
    price: "$100/year",
    type: "recurring" as const
  },
  {
    id: "BLOG_INTEGRATION",
    name: "Blog Integration",
    description: "Blog integration and setup",
    price: "$100 one-time",
    type: "one_time" as const
  },
  {
    id: "MULTILINGUAL_SUPPORT",
    name: "Multi-language Support",
    description: "Multi-language website support",
    price: "$200 one-time",
    type: "one_time" as const
  },
  {
    id: "CONTACT_LEAD_MANAGEMENT",
    name: "Contact / Lead management - Bulk email sending",
    description: "Contact and lead management system with bulk email sending capabilities",
    price: "$300/month",
    type: "recurring" as const
  },
  {
    id: "CRM_CMS_INTEGRATION",
    name: "CRM & CMS integration (HubSpot, Zoho)",
    description: "Professional CRM and CMS integration with HubSpot, Zoho and other platforms",
    price: "$300/month",
    type: "recurring" as const
  }
]

// Pakete göre özel sorular
export const packageSpecificQuestions = {
  Starter: [
    "Kaç sayfa istiyorsunuz? (1-5 arası)",
    "Hangi renk teması tercih edersiniz?",
    "Referans siteleriniz var mı?"
  ],
  Business: [
    "CRM sistemi kullanıyor musunuz?",
    "Online randevu sistemi istiyor musunuz?",
    "Müşteri paneli gerekli mi?",
    "Ödeme alma sistemi istiyorsunuz?"
  ],
  Ecommerce: [
    "Kaç ürün satacaksınız?",
    "Hangi ödeme yöntemlerini desteklemek istiyorsunuz?",
    "Kargo firmaları ile entegrasyon gerekli mi?",
    "B2B (toptan) satış yapacak mısınız?"
  ]
}