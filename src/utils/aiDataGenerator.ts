/**
 * AI-Powered Medical Data Generator using Azure OpenAI
 * Generates realistic medical records using large language models
 */

import { generateDataWithAI, AzureOpenAIConfig } from './azureOpenAI';
import { 
  CMS1500Data, 
  InsurancePolicyData, 
  VisitReportData, 
  MedicalHistoryData,
  PatientData,
  ProviderData,
  InsuranceData,
  PatientDemographics,
  Provider,
  InsuranceInfo
} from './constants';
import { 
  ResponseFormats, 
  validateWithSchema, 
  formatZodErrors,
  CMS1500DataSchema,
  InsurancePolicyDataSchema,
  VisitReportDataSchema,
  PatientDataSchema,
  ProviderDataSchema,
  InsuranceDataSchema
} from './jsonSchemaGenerator';
import {
  CacheConfig,
  DEFAULT_CACHE_CONFIG,
  generateCacheKey,
  getFromCache,
  saveToCache,
} from './cache';



// ============================================================================
// Standalone Data Generation Functions
// ============================================================================

/**
 * Generate patient demographics data independently using Azure OpenAI
 */
export async function generatePatientDataWithAI(
  config: AzureOpenAIConfig,
  options: {
    ageRange?: { min: number; max: number };
    gender?: string;
    includeSecondaryInsurance?: boolean;
  } = {},
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<PatientDemographics> {
  const { ageRange = { min: 18, max: 85 }, gender, includeSecondaryInsurance = false } = options;
  
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generatePatientDataWithAI', ageRange, gender, includeSecondaryInsurance);
  
  // Try to get from cache first
  const cached = getFromCache<PatientData>(cacheConfig, cacheKey);
  if (cached) {
    return cached.patient;
  }

  const prompt = `Generate complete patient demographics for a synthetic medical record.

**Requirements:**
- Complete demographics with realistic US address, contact info
- Medical Record Number (MRN), Social Security Number (SSN format: XXX-XX-XXXX)
- Account number
- Age between ${ageRange.min}-${ageRange.max} years
${gender ? `- Gender: ${gender}` : '- Gender: randomly selected'}
- All dates in MM/DD/YYYY format
- Pharmacy information with name, address, and phone
- All data must be completely synthetic and HIPAA-compliant

Generate realistic, clinically coherent data following US healthcare standards.`;

  const systemPrompt = 'You are an expert medical data generator creating synthetic, realistic patient demographics for educational purposes. Generate completely fictional yet realistic data.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.PatientData
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(PatientDataSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid patient data: ${errors.join(', ')}`);
    }

    console.log('✅ Patient data validated successfully');
    const validatedData = validation.data as PatientData;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData.patient;
  } catch (error) {
    console.error('Failed to generate patient data with AI:', error);
    throw new Error(
      `Patient data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate provider information independently using Azure OpenAI
 */
export async function generateProviderDataWithAI(
  config: AzureOpenAIConfig,
  options: {
    specialty?: string;
    facilityType?: string;
  } = {},
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<Provider> {
  const { specialty, facilityType = 'Medical Center' } = options;
  
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generateProviderDataWithAI', specialty, facilityType);
  
  // Try to get from cache first
  const cached = getFromCache<ProviderData>(cacheConfig, cacheKey);
  if (cached) {
    return cached.provider;
  }

  const prompt = `Generate complete provider and facility information for a medical practice.

**Requirements:**
- Provider: Full name with credentials (Dr. First Last, MD)
- National Provider Identifier (NPI): 10 digits
- Medical specialty${specialty ? `: ${specialty}` : ' (choose appropriate specialty)'}
- Provider phone, address (US format)
- Tax ID (EIN or SSN format) with type
- Provider signature (provider's name)
- Facility information:
  - Facility name (${facilityType})
  - Facility address (US format)
  - Facility phone and fax numbers
  - Facility NPI (10 digits)
- Billing provider information
- All data must be completely synthetic

Generate realistic, professional provider and facility data.`;

  const systemPrompt = 'You are an expert medical data generator creating synthetic provider and facility information for educational purposes. Generate completely fictional yet realistic data.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.ProviderData
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(ProviderDataSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid provider data: ${errors.join(', ')}`);
    }

    console.log('✅ Provider data validated successfully');
    const validatedData = validation.data as ProviderData;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData.provider;
  } catch (error) {
    console.error('Failed to generate provider data with AI:', error);
    throw new Error(
      `Provider data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate insurance information independently using Azure OpenAI
 */
export async function generateInsuranceDataWithAI(
  config: AzureOpenAIConfig,
  options: {
    includeSecondary?: boolean;
    subscriberSameAsPatient?: boolean;
  } = {},
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<InsuranceInfo> {
  const { includeSecondary = false, subscriberSameAsPatient = true } = options;
  
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generateInsuranceDataWithAI', includeSecondary, subscriberSameAsPatient);
  
  // Try to get from cache first
  const cached = getFromCache<InsuranceData>(cacheConfig, cacheKey);
  if (cached) {
    return cached.insurance;
  }

  const prompt = `Generate complete insurance information for a medical record.

**Requirements:**
- Primary insurance (required):
  - Provider name (major US insurer)
  - Policy number
  - Group number
  - Member ID
  - Effective date (current year)
  - Copay and deductible amounts
${includeSecondary ? '- Secondary insurance with similar details' : '- No secondary insurance (set to null)'}
- Subscriber information:
  - Name${subscriberSameAsPatient ? ' (same as patient)' : ''}
  - Date of birth
  - Gender
  - Phone number
  - Address (US format)
- Insurance type (e.g., HMO, PPO, Medicare)
- All data must be completely synthetic

Generate realistic insurance information following US healthcare standards.`;

  const systemPrompt = 'You are an expert medical data generator creating synthetic insurance information for educational purposes. Generate completely fictional yet realistic data.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.InsuranceData
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(InsuranceDataSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid insurance data: ${errors.join(', ')}`);
    }

    console.log('✅ Insurance data validated successfully');
    const validatedData = validation.data as InsuranceData;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData.insurance;
  } catch (error) {
    console.error('Failed to generate insurance data with AI:', error);
    throw new Error(
      `Insurance data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// ============================================================================
// Legacy Combined Generation Function
// ============================================================================

/**
 * Generate a complete medical record using Azure OpenAI
 * The structure is enforced by the Zod schema via structured outputs
 * 
 * @deprecated Use generatePatientDataWithAI(), generateProviderDataWithAI(), 
 * and generateInsuranceDataWithAI() separately instead. This provides more flexibility 
 * and allows you to mix and match patient, provider, and insurance data independently.
 * 
 * This function is kept for backward compatibility only and will be removed in a future version.
 * 
 * Note: numberOfVisits and numberOfLabTests are not part of BasicData schema.
 * They are used by the calling code to generate additional reports.
 */
export async function generateBasicDataWithAI(
  config: AzureOpenAIConfig,
  complexity: 'low' | 'medium' | 'high' = 'medium',
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<BasicData> {
  // Generate cache key based on function name and parameters
  const cacheKey = generateCacheKey('generateBasicDataWithAI', complexity);
  
  // Try to get from cache first
  const cached = getFromCache<BasicData>(cacheConfig, cacheKey);
  if (cached) {
    return cached;
  }

  const complexityDetails = {
    low: '1-2 chronic conditions, 2-3 current medications, 1 allergy, minimal history',
    medium: '2-4 chronic conditions, 4-6 current medications, 2-3 allergies, moderate history',
    high: '4+ chronic conditions, 7+ current medications, 3+ allergies, extensive history'
  };

  const prompt = `Generate a complete, realistic synthetic medical record for educational purposes.

**Complexity Level: ${complexity}** (${complexityDetails[complexity]})

**Requirements:**
- Patient: Complete demographics with realistic US address, contact info, MRN, SSN
- Insurance: Primary insurance (required), secondary insurance (20% chance if medium/high complexity)
- Provider: Include complete facility information with NPI numbers
- Current timestamp for generatedAt field
- Age should be between 18-85 years
- All dates in MM/DD/YYYY format (except generatedAt which is ISO8601)
- All data must be completely synthetic and HIPAA-compliant

The JSON structure is enforced by the schema - just generate realistic, clinically coherent data.`;

  const systemPrompt = `You are an expert medical data generator creating synthetic, realistic medical records for educational purposes.

Generate completely fictional yet realistic data following US healthcare standards. Ensure internal consistency in all relationships and dates. Use proper medical terminology and conventions.`;

  try {
    // Generate data with Zod-derived JSON Schema for guaranteed structure
    const data = await generateDataWithAI(
      config, 
      prompt, 
      systemPrompt,
      3,
      BasicDataResponseFormat
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(BasicDataSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid data: ${errors.join(', ')}`);
    }

    console.log('✅ Basic data validated successfully with Zod');
    const validatedData = validation.data as BasicData;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate basic data with AI:', error);
    throw new Error(
      `AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
      'Please check your Azure OpenAI configuration or try again.'
    );
  }
}

/**
 * Generate CMS-1500 form data using Azure OpenAI
 */
export async function generateCMS1500DataWithAI(
  config: AzureOpenAIConfig,
  basicData: BasicData,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<CMS1500Data> {
  // Generate cache key based on function name and patient ID
  const cacheKey = generateCacheKey('generateCMS1500DataWithAI', basicData.patient.id);
  
  // Try to get from cache first
  const cached = getFromCache<CMS1500Data>(cacheConfig, cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `Based on this patient data, generate realistic CMS-1500 insurance claim form data:

Patient: ${basicData.patient.firstName} ${basicData.patient.lastName}
DOB: ${basicData.patient.dateOfBirth}
Insurance: ${basicData.insurance.primaryInsurance.provider}

Generate comprehensive service lines (2-5 services) with:
- Date of service (within last 90 days)
- Place of service code (appropriate for service type)
- Procedure codes (CPT codes like 99213, 99214, 85025, etc.)
- Diagnosis pointers (linking to conditions)
- Charges (realistic amounts)
- Units and modifiers

Respond with valid JSON matching CMS1500Data interface.`;

  const systemPrompt = 'You are a medical billing expert specializing in CMS-1500 forms. Generate realistic, compliant claims data. Always respond with ONLY valid JSON.';

  try {
    const data = await generateDataWithAI(
      config, 
      prompt, 
      systemPrompt,
      3,
      ResponseFormats.CMS1500Data
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(CMS1500DataSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      console.error('CMS-1500 validation errors:', errors);
      throw new Error(`AI generated invalid CMS-1500 data: ${errors.join(', ')}`);
    }

    console.log('✅ CMS-1500 data validated successfully');
    const validatedData = validation.data as CMS1500Data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    throw new Error(`Failed to generate CMS-1500 data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate Insurance Policy data using Azure OpenAI
 */
export async function generateInsurancePolicyDataWithAI(
  config: AzureOpenAIConfig,
  basicData: BasicData,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<InsurancePolicyData> {
  // Generate cache key based on function name and patient ID
  const cacheKey = generateCacheKey('generateInsurancePolicyDataWithAI', basicData.patient.id);
  
  // Try to get from cache first
  const cached = getFromCache<InsurancePolicyData>(cacheConfig, cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `Generate a detailed insurance policy document for this patient:

Patient: ${basicData.patient.firstName} ${basicData.patient.lastName}
Insurance: ${basicData.insurance.primaryInsurance.provider}
Policy Number: ${basicData.insurance.primaryInsurance.policyNumber}

Include:
- Policy effective dates (current year)
- Detailed coverage information (deductible, copay, coinsurance, out-of-pocket max)
- Covered services (preventive care, emergency services, hospital stays, prescription drugs, etc.)
- Exclusions and limitations
- Prior authorization requirements
- Network information

Respond with valid JSON matching InsurancePolicyData interface.`;

  const systemPrompt = 'You are an insurance policy specialist. Generate comprehensive, realistic health insurance policy documents. Always respond with ONLY valid JSON.';

  try {
    const data = await generateDataWithAI(
      config, 
      prompt, 
      systemPrompt,
      3,
      ResponseFormats.InsurancePolicyData
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(InsurancePolicyDataSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      console.error('Insurance Policy validation errors:', errors);
      throw new Error(`AI generated invalid Insurance Policy data: ${errors.join(', ')}`);
    }

    console.log('✅ Insurance Policy data validated successfully');
    const validatedData = validation.data as InsurancePolicyData;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    throw new Error(`Failed to generate Insurance Policy data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate Visit Report data using Azure OpenAI
 */
export async function generateVisitReportDataWithAI(
  config: AzureOpenAIConfig,
  basicData: BasicData,
  numberOfVisits: number = 1,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<VisitReportData[]> {
  // Generate cache key based on function name, patient ID, and number of visits
  const cacheKey = generateCacheKey('generateVisitReportDataWithAI', basicData.patient.id, numberOfVisits);
  
  // Try to get from cache first
  const cached = getFromCache<VisitReportData[]>(cacheConfig, cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `Generate ${numberOfVisits} realistic medical visit report(s) for this patient:

Patient: ${basicData.patient.firstName} ${basicData.patient.lastName}
Age: ${new Date().getFullYear() - new Date(basicData.patient.dateOfBirth).getFullYear()} years
Provider: ${basicData.provider.name}

For each visit, include:
- Date of service (within last 6 months, chronological order)
- Chief complaint (reason for visit)
- History of present illness
- Vital signs (temperature, blood pressure, heart rate, respiratory rate, weight, height, BMI, oxygen saturation)
- Physical examination findings
- Assessment (diagnoses with ICD-10 codes)
- Plan (treatment recommendations, medications prescribed, follow-up instructions)
- Provider signature and credentials

IMPORTANT: In the provider object, set referringProvider to null (most visits don't have a referring provider).

IMPORTANT: In visit.vitals object (inside visit note), use NUMBER types for heartRate, temperature, weight, and oxygenSaturation (not strings).

Make visits clinically coherent (follow-up visits should reference previous visits).

Respond with valid JSON array matching VisitReportData[] interface.`;

  const systemPrompt = 'You are a physician specializing in clinical documentation. Generate realistic, SOAP-format visit notes. Always respond with ONLY valid JSON.';

  try {
    const data = await generateDataWithAI(
      config, 
      prompt, 
      systemPrompt,
      3,
      ResponseFormats.VisitReportData
    );
    
    // Handle single visit or array of visits
    const visits = Array.isArray(data) ? data : [data];
    
    // Validate each visit with Zod schema
    const validatedVisits: VisitReportData[] = [];
    for (const visit of visits) {
      const validation = validateWithSchema(VisitReportDataSchema, visit);
      
      if (!validation.success) {
        const errors = formatZodErrors(validation.errors);
        console.error('Visit Report validation errors:', errors);
        throw new Error(`AI generated invalid Visit Report data: ${errors.join(', ')}`);
      }
      
      validatedVisits.push(validation.data as VisitReportData);
    }

    console.log(`✅ ${validatedVisits.length} Visit Report(s) validated successfully`);
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedVisits);
    
    return validatedVisits;
  } catch (error) {
    throw new Error(`Failed to generate Visit Report data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate Medical History data using Azure OpenAI
 */
export async function generateMedicalHistoryDataWithAI(
  config: AzureOpenAIConfig,
  basicData: BasicData,
  complexity: 'low' | 'medium' | 'high' = 'medium',
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<MedicalHistoryData> {
  // Generate cache key based on function name, patient ID, and complexity
  const cacheKey = generateCacheKey('generateMedicalHistoryDataWithAI', basicData.patient.id, complexity);
  
  // Try to get from cache first
  const cached = getFromCache<MedicalHistoryData>(cacheConfig, cacheKey);
  if (cached) {
    return cached;
  }

  let REQUIREMENT;
  switch (complexity) {
    case 'low':
      REQUIREMENT = '1-2 conditions, 2-3 medications, minimal history';
      break;
    case 'medium':
      REQUIREMENT = '2-4 conditions, 4-6 medications, moderate history';
      break;
    case 'high':
      REQUIREMENT = '4+ conditions, 7+ medications, extensive history';
      break;
    default:
      REQUIREMENT = 'medium';
  }

  const prompt = `Generate a comprehensive medical history for this patient:

Patient: ${basicData.patient.firstName} ${basicData.patient.lastName}
Age: ${new Date().getFullYear() - new Date(basicData.patient.dateOfBirth).getFullYear()} years

REQUIREMENT: ${REQUIREMENT}

`;

  const systemPrompt = 'You are a medical historian specializing in comprehensive patient histories. Generate realistic, clinically coherent medical histories. Always respond with ONLY valid JSON.';

  try {
    const data = await generateDataWithAI(config, prompt, systemPrompt, 3, ResponseFormats.MedicalHistoryData);
    const historyData = data as MedicalHistoryData;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, historyData);
    
    return historyData;
  } catch (error) {
    throw new Error(`Failed to generate Medical History data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate Laboratory Report data using Azure OpenAI
 * Generates each laboratory report one by one for better progress tracking
 */
export async function generateLaboratoryReportDataWithAI(
  config: AzureOpenAIConfig,
  basicData: BasicData,
  testTypes: string[],
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG,
  progressCallback?: (testType: string, report: any, current: number, total: number) => void
): Promise<Map<string, any>> {
  const labReportsMap = new Map<string, any>();
  const totalTests = testTypes.length;

  // Test type details for prompts
  const testTypeDetails: Record<string, string> = {
    'CBC': 'Complete Blood Count (WBC, RBC, Hemoglobin, Hematocrit, Platelets, etc.)',
    'BMP': 'Basic Metabolic Panel (Glucose, Calcium, Sodium, Potassium, CO2, Chloride, BUN, Creatinine)',
    'CMP': 'Comprehensive Metabolic Panel (includes BMP + liver enzymes)',
    'Urinalysis': 'Color, Clarity, pH, Specific Gravity, Protein, Glucose, Ketones, Blood, etc.',
    'Lipid': 'Total Cholesterol, HDL, LDL, Triglycerides',
    'LFT': 'Liver Function Tests (ALT, AST, ALP, Bilirubin, Albumin, Total Protein)',
    'Thyroid': 'TSH, T3, T4',
    'HbA1c': 'Hemoglobin A1c percentage',
    'Coagulation': 'PT, PTT, INR',
    'Microbiology': 'Culture results, organism identification, sensitivities',
    'Pathology': 'Tissue examination, diagnosis',
    'Hormone': 'Various hormone levels',
    'Infectious': 'Disease markers, antibody tests'
  };

  console.log(`\n🧪 Generating ${totalTests} laboratory reports one by one...`);

  // Generate each laboratory report individually
  for (let i = 0; i < testTypes.length; i++) {
    const testType = testTypes[i];
    const currentStep = i + 1;

    // Check cache for individual test type
    const cacheKey = generateCacheKey('generateLaboratoryReport', basicData.patient.id, testType);
    const cached = getFromCache<any>(cacheConfig, cacheKey);
    
    if (cached) {
      console.log(`  ✨ [${currentStep}/${totalTests}] ${testType}: Retrieved from cache`);
      labReportsMap.set(testType, cached);
      progressCallback?.(testType, cached, currentStep, totalTests);
      continue;
    }

    // Generate prompt for this specific test type
    const testDetail = testTypeDetails[testType] || testType;
    const prompt = `Generate a realistic laboratory test result for this patient:

Patient: ${basicData.patient.firstName} ${basicData.patient.lastName}
Age: ${new Date().getFullYear() - new Date(basicData.patient.dateOfBirth).getFullYear()} years
Provider: ${basicData.provider.name}

Generate a ${testType} laboratory report: ${testDetail}

Include:
- Test name and type
- Date of collection and reporting (within last 30 days)
- Specimen type and collection method
- Individual test results with values, units, and reference ranges
- Flags for abnormal values (High/Low)
- Performing laboratory information
- Ordering provider

Make results clinically coherent with patient age and realistic for the test type.
Return a single laboratory report object.`;

    const systemPrompt = 'You are a clinical laboratory specialist. Generate realistic, clinically accurate laboratory test results. Always respond with ONLY valid JSON.';

    try {
      console.log(`  🔬 [${currentStep}/${totalTests}] Generating ${testType}...`);
      const data = await generateDataWithAI(config, prompt, systemPrompt, 3, ResponseFormats.LaboratoryReportsData);
      
      // Extract the report (might be wrapped in a reports array)
      let report = data;
      if ((data as any).reports && Array.isArray((data as any).reports)) {
        report = (data as any).reports[0] || data;
      }

      // Ensure testType is set
      if (!report.testType && !report.testName) {
        report.testType = testType;
      }

      // Save individual report to cache
      saveToCache(cacheConfig, cacheKey, report);
      
      labReportsMap.set(testType, report);
      console.log(`  ✅ [${currentStep}/${totalTests}] ${testType} generated successfully`);
      
      // Call progress callback
      progressCallback?.(testType, report, currentStep, totalTests);
      
    } catch (error) {
      console.error(`  ❌ [${currentStep}/${totalTests}] Failed to generate ${testType}:`, error);
      // Continue with other tests even if one fails
      progressCallback?.(testType, null, currentStep, totalTests);
    }
  }

  console.log(`✅ Generated ${labReportsMap.size}/${totalTests} laboratory reports\n`);
  
  // Save the complete collection to cache as well
  const completeCacheKey = generateCacheKey('generateLaboratoryReportDataWithAI', basicData.patient.id, testTypes.sort().join(','));
  const cacheData = Object.fromEntries(labReportsMap.entries());
  saveToCache(cacheConfig, completeCacheKey, cacheData);

  return labReportsMap;
}
