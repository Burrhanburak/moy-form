import Airtable from 'airtable';

// Temporarily disable for testing - replace with actual keys
const airtableKey = process.env.AIRTABLE_API_KEY || 'dummy_airtable_key';
const airtableBaseId = process.env.AIRTABLE_BASE_ID || 'dummy_base_id';

if (!process.env.AIRTABLE_API_KEY) {
  console.warn('⚠️ AIRTABLE_API_KEY not found - using dummy key for testing');
}

if (!process.env.AIRTABLE_BASE_ID) {
  console.warn('⚠️ AIRTABLE_BASE_ID not found - using dummy base for testing');
}

const base = new Airtable({ apiKey: airtableKey }).base(airtableBaseId);

export interface CustomerRecord {
  name: string;
  email: string;
  phone: string;
  password: string;
  companyName: string;
  businessField: string;
  selectedPackage: string;
  packagePrice: number;
  hasDomain: string;
  domainName?: string;
  requiredFeatures: string[];
  hasSocialMedia: string;
  socialMediaAccounts?: string[];
  selectedAddons?: string[];
  maintenanceRequired?: boolean;
  projectDescription?: string;
  specialRequirements?: string;
  stripeSessionId?: string;
  paymentStatus?: string;
  createdAt: string;
}

export const createCustomerRecord = async (customerData: CustomerRecord): Promise<string> => {
  try {
    // Skip Airtable temporarily for testing
    console.log('📝 Skipping Airtable record creation (testing mode)');
    return 'dummy_record_id';

    const record = await base(process.env.AIRTABLE_TABLE_NAME || 'Customers').create({
      'Name': customerData.name,
      'Email': customerData.email,
      'Phone': customerData.phone,
      'Company Name': customerData.companyName,
      'Business Field': customerData.businessField,
      'Selected Package': customerData.selectedPackage,
      'Package Price': customerData.packagePrice,
      'Has Domain': customerData.hasDomain,
      'Domain Name': customerData.domainName || '',
      'Required Features': customerData.requiredFeatures.join(', '),
      'Has Social Media': customerData.hasSocialMedia,
      'Social Media Accounts': customerData.socialMediaAccounts?.join(', ') || '',
      'Selected Addons': customerData.selectedAddons?.join(', ') || '',
      'Maintenance Required': customerData.maintenanceRequired ? 'Yes' : 'No',
      'Project Description': customerData.projectDescription || '',
      'Special Requirements': customerData.specialRequirements || '',
      'Stripe Session ID': customerData.stripeSessionId || '',
      'Payment Status': customerData.paymentStatus || 'pending',
      'Created At': customerData.createdAt,
      'Status': 'New Lead'
    });
    
    return record.id;
  } catch (error) {
    console.error('Error creating Airtable record:', error);
    throw new Error('Failed to create customer record in Airtable');
  }
};

export const updateCustomerPaymentStatus = async (stripeSessionId: string, status: string): Promise<void> => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_NAME || 'Customers')
      .select({
        filterByFormula: `{Stripe Session ID} = '${stripeSessionId}'`
      })
      .firstPage();

    if (records.length > 0) {
      await base(process.env.AIRTABLE_TABLE_NAME || 'Customers').update(records[0].id, {
        'Payment Status': status,
        'Status': status === 'completed' ? 'Paid Customer' : 'Payment Failed'
      });
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Failed to update payment status in Airtable');
  }
};

export const getCustomerByEmail = async (email: string) => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_NAME || 'Customers')
      .select({
        filterByFormula: `{Email} = '${email}'`,
        maxRecords: 1
      })
      .firstPage();

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
};