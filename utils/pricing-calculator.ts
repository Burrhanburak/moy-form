/**
 * Otomatik Fiyat Hesaplama Sistemi
 * Custom package ve tools için dinamik fiyatlandırma
 */

interface PackagePricingInput {
  numberOfPages?: number;
  deliveryTimeInDays?: number;
  features: string[];
  optionalAddons: string[];
  maintenanceRequired: boolean;
  isCustomRequest: boolean;
  revisionCount?: number;
  // Referans complexity indicators
  referenceUrls?: string[];
  referenceImages?: string[];
}

interface ToolsPricingInput {
  complexity?: "simple" | "medium" | "complex" | "enterprise" | "";
  automationType?: string;
  triggerType?: string;
  executionFrequency?: string;
  dataVolume?: "low" | "medium" | "high" | "enterprise" | "";
  integrations: string[];
  features: string[];
  optionalAddons: string[];
  apiConnections?: number;
  webhookEndpoints?: number;
  dataTransformations?: number;
  errorHandling: boolean;
  monitoring: boolean;
  trainingIncluded: boolean;
  testingIncluded: boolean;
  maintenanceRequired: boolean;
  supportLevel?: "basic" | "standard" | "premium" | "enterprise" | "";
  deploymentType?: string;
}

/**
 * Package (Website) için otomatik fiyat hesaplama
 * Base: $1000 (başlangıç fiyatı)
 */
export function calculatePackagePrice(input: PackagePricingInput): {
  basePrice: number;
  breakdown: Record<string, number>;
  totalPrice: number;
  maintenancePrice: number;
} {
  let basePrice = 150000; // $1500.00 USD base (150000 cents)
  const breakdown: Record<string, number> = {};

  // 1. Sayfa sayısı bazlı fiyat
  if (input.numberOfPages) {
    const pagePrice = input.numberOfPages * 10000; // Her sayfa $100.00
    breakdown["pages"] = pagePrice;
    basePrice += pagePrice;
  }

  // 2. Feature bazlı fiyat
  if (input.features.length > 0) {
    const featurePrice = input.features.length * 5000; // Her feature $50.00
    breakdown["features"] = featurePrice;
    basePrice += featurePrice;
  }

  // 3. Optional addons
  if (input.optionalAddons.length > 0) {
    const addonPrice = input.optionalAddons.length * 7500; // Her addon $75.00
    breakdown["addons"] = addonPrice;
    basePrice += addonPrice;
  }

  // 4. Revizyon hakkı
  if (input.revisionCount && input.revisionCount > 3) {
    const revisionPrice = (input.revisionCount - 3) * 50; // 3'ten fazlası için $0.50
    breakdown["revisions"] = revisionPrice;
    basePrice += revisionPrice;
  }

  // 5. Referans complexity (daha fazla referans = daha kompleks)
  const totalReferences =
    (input.referenceUrls?.length || 0) + (input.referenceImages?.length || 0);
  if (totalReferences > 5) {
    const referencePrice = 200; // Çok referans = özel tasarım = +$2.00
    breakdown["complexity"] = referencePrice;
    basePrice += referencePrice;
  }

  // 6. Delivery time multiplier
  if (input.deliveryTimeInDays) {
    if (input.deliveryTimeInDays < 15) {
      // Acil iş = +30%
      const urgentFee = Math.round(basePrice * 0.3);
      breakdown["urgent_delivery"] = urgentFee;
      basePrice += urgentFee;
    } else if (input.deliveryTimeInDays > 60) {
      // Uzun vadeli = -20% discount
      const discount = Math.round(basePrice * 0.2);
      breakdown["long_term_discount"] = -discount;
      basePrice -= discount;
    }
  }

  // 7. Custom request premium
  if (input.isCustomRequest) {
    const customPremium = Math.round(basePrice * 0.2); // +20%
    breakdown["custom_request_premium"] = customPremium;
    basePrice += customPremium;
  }

  // 8. Maintenance pricing (recurring) - FIXED $200.00/month
  let maintenancePrice = 0;
  if (input.maintenanceRequired) {
    maintenancePrice = 20000; // Fixed $200.00/month (20000 cents)
    breakdown["monthly_maintenance"] = maintenancePrice;
  }

  return {
    basePrice: Math.max(basePrice, 150000), // Minimum $1500.00
    breakdown,
    totalPrice: Math.max(basePrice, 150000),
    maintenancePrice,
  };
}

/**
 * Tools (n8n Automation) için otomatik fiyat hesaplama
 * Base: $500 (başlangıç fiyatı)
 */
export function calculateToolsPrice(input: ToolsPricingInput): {
  basePrice: number;
  breakdown: Record<string, number>;
  totalPrice: number;
  maintenancePrice: number;
} {
  let basePrice = 500; // $5.00 USD base (500 cents)
  const breakdown: Record<string, number> = {};

  // 1. Complexity bazlı fiyat
  const complexityPrices = {
    simple: 0,
    medium: 500, // +$5.00
    complex: 1500, // +$15.00
    enterprise: 3000, // +$30.00
  };
  if (input.complexity && input.complexity !== "") {
    const complexityPrice = complexityPrices[input.complexity] || 0;
    breakdown["complexity"] = complexityPrice;
    basePrice += complexityPrice;
  }

  // 2. Data volume bazlı fiyat
  const volumePrices = {
    low: 0,
    medium: 300, // +$3.00
    high: 800, // +$8.00
    enterprise: 2000, // +$20.00
  };
  if (input.dataVolume && input.dataVolume !== "") {
    const volumePrice = volumePrices[input.dataVolume] || 0;
    breakdown["data_volume"] = volumePrice;
    basePrice += volumePrice;
  }

  // 3. Integrations
  if (input.integrations.length > 0) {
    const integrationPrice = input.integrations.length * 100; // Her integration $1.00
    breakdown["integrations"] = integrationPrice;
    basePrice += integrationPrice;
  }

  // 4. Features
  if (input.features.length > 0) {
    const featurePrice = input.features.length * 80; // Her feature $0.80
    breakdown["features"] = featurePrice;
    basePrice += featurePrice;
  }

  // 5. Optional addons
  if (input.optionalAddons.length > 0) {
    const addonPrice = input.optionalAddons.length * 120; // Her addon $1.20
    breakdown["addons"] = addonPrice;
    basePrice += addonPrice;
  }

  // 6. Technical complexity (API + Webhook + Transformations)
  const apiPrice = (input.apiConnections || 0) * 50; // Her API connection $0.50
  const webhookPrice = (input.webhookEndpoints || 0) * 40; // Her webhook $0.40
  const transformPrice = (input.dataTransformations || 0) * 20; // Her transformation $0.20
  const technicalTotal = apiPrice + webhookPrice + transformPrice;
  if (technicalTotal > 0) {
    breakdown["technical_complexity"] = technicalTotal;
    basePrice += technicalTotal;
  }

  // 7. Premium services
  if (input.errorHandling) {
    breakdown["error_handling"] = 200; // +$2.00
    basePrice += 200;
  }
  if (input.monitoring) {
    breakdown["monitoring"] = 200; // +$2.00
    basePrice += 200;
  }
  if (input.trainingIncluded) {
    breakdown["training"] = 300; // +$3.00
    basePrice += 300;
  }
  if (input.testingIncluded) {
    breakdown["testing"] = 250; // +$2.50
    basePrice += 250;
  }

  // 8. Support level
  const supportPrices = {
    basic: 0,
    standard: 200, // +$2.00
    premium: 500, // +$5.00
    enterprise: 1000, // +$10.00
  };
  if (input.supportLevel && input.supportLevel !== "") {
    const supportPrice = supportPrices[input.supportLevel] || 0;
    breakdown["support_level"] = supportPrice;
    basePrice += supportPrice;
  }

  // 9. Maintenance pricing (recurring) - FIXED $200.00/month
  let maintenancePrice = 0;
  if (input.maintenanceRequired) {
    maintenancePrice = 20000; // Fixed $200.00/month (20000 cents)
    breakdown["monthly_maintenance"] = maintenancePrice;
  }

  return {
    basePrice: Math.max(basePrice, 500), // Minimum $5.00
    breakdown,
    totalPrice: Math.max(basePrice, 500),
    maintenancePrice,
  };
}

/**
 * Format price for display (cents to dollars)
 */
export function formatPrice(cents: number, currency: string = "USD"): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(dollars);
}

/**
 * Calculate total with maintenance
 */
export function calculateTotalWithMaintenance(
  oneTimePrice: number,
  maintenancePrice: number,
  months: number = 12
): {
  oneTime: number;
  monthlyRecurring: number;
  yearlyTotal: number;
} {
  return {
    oneTime: oneTimePrice,
    monthlyRecurring: maintenancePrice,
    yearlyTotal: oneTimePrice + maintenancePrice * months,
  };
}
