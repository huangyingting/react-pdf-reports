/**
 * AI-Powered Medical Data Generator using Azure OpenAI
 * Generates realistic medical records using large language models
 * 
 * This module provides AI-powered alternatives to the faker-based generators
 * in dataGenerator.ts. All functions use Azure OpenAI to generate realistic,
 * clinically coherent medical data.
 */

import { AzureOpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { 
  Patient,
  Provider,
  InsuranceInfo,
  CMS1500,
  LabReport,
  VisitReport,
  MedicalHistory,
  Complexity,
  PatientSchema,
  ProviderSchema,
  InsuranceInfoSchema,
  CMS1500Schema,
  LabReportSchema,
  VisitReportSchema,
  MedicalHistorySchema
} from './zodSchemas';
import { 
  ResponseFormats, 
  validateWithSchema, 
  formatZodErrors
} from './jsonSchemaGenerator';
import {
  CacheConfig,
  DEFAULT_CACHE_CONFIG,
  generateCacheKey,
  getFromCache,
  saveToCache,
} from './cache';

// ============================================================================
// Azure OpenAI Configuration and Helper Functions
// ============================================================================

export interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  deploymentName: string;
  apiVersion?: string;
}

/**
 * Create Azure OpenAI client
 */
function createAzureOpenAIClient(config: AzureOpenAIConfig): AzureOpenAI {
  const apiVersion = config.apiVersion || '2024-02-15-preview';
  
  return new AzureOpenAI({
    endpoint: config.endpoint,
    apiKey: config.apiKey,
    apiVersion: apiVersion,
    deployment: config.deploymentName,
  });
}

/**
 * Call Azure OpenAI to generate data with retry logic
 */
async function generateDataWithAI(
  config: AzureOpenAIConfig,
  prompt: string,
  systemPrompt: string,
  retries: number = 3,
  responseFormat?: any
): Promise<any> {
  console.log('[generateDataWithAI] Starting generation with', retries, 'max retries');
  console.log('[generateDataWithAI] Prompt length:', prompt.length, 'characters');

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    console.log(`[generateDataWithAI] Attempt ${attempt + 1}/${retries}`);
    try {
      const client = createAzureOpenAIClient(config);
      
      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ];

      console.log('[Azure OpenAI] Sending request...');
      const requestStartTime = Date.now();

      const completion = await client.chat.completions.create({
        model: config.deploymentName,
        messages: messages,
        max_completion_tokens: 32 * 1024,
        temperature: 1.0,
        response_format: responseFormat || { type: 'json_object' }
      });

      const requestDuration = Date.now() - requestStartTime;
      console.log('[Azure OpenAI] Response received in', requestDuration, 'ms');

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('No response from Azure OpenAI');
      }

      const content = completion.choices[0].message.content;
      if (!content || content.trim() === '') {
        throw new Error('Empty response from Azure OpenAI');
      }

      console.log('[generateDataWithAI] Parsing JSON response...');
      const parsedData = JSON.parse(content);

      if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error('Invalid JSON structure: expected object, got ' + typeof parsedData);
      }

      console.log('[generateDataWithAI] ✅ Generation successful!');
      return parsedData;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      console.error(`[generateDataWithAI] ❌ Attempt ${attempt + 1}/${retries} failed:`, error);
      
      // Retry logic
      if (attempt < retries - 1) {
        const waitTime = 1000 * (attempt + 1);
        console.warn(`[generateDataWithAI] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      console.error('[generateDataWithAI] All retry attempts exhausted');
      break;
    }
  }

  throw lastError || new Error('Failed to generate medical data after all retries');
}

// ============================================================================
// AI-Powered Generator Functions (Compatible with dataGenerator.ts interface)
// ============================================================================

/**
 * Generate a patient using AI
 * Creates realistic patient demographics using Azure OpenAI
 * 
 * @param config Azure OpenAI configuration
 * @param options Optional generation parameters
 * @param cacheConfig Cache configuration
 * @returns Patient object
 */
export async function generatePatientWithAI(
  config: AzureOpenAIConfig,
  options?: {
    ageRange?: { min: number; max: number };
    gender?: string;
  },
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<Patient> {
  const { ageRange = { min: 18, max: 85 }, gender } = options || {};
  
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generatePatient', ageRange, gender);
  
  // Try to get from cache first
  const cached = getFromCache<Patient>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Patient data retrieved from cache');
    return cached;
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
      ResponseFormats.Patient
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(PatientSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid patient data: ${errors.join(', ')}`);
    }

    console.log('✅ Patient data validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate patient data with AI:', error);
    throw new Error(
      `Patient data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate a provider using AI
 * Creates realistic provider and facility information using Azure OpenAI
 * 
 * @param config Azure OpenAI configuration
 * @param options Optional generation parameters
 * @param cacheConfig Cache configuration
 * @returns Provider object
 */
export async function generateProviderWithAI(
  config: AzureOpenAIConfig,
  options?: {
    specialty?: string;
    facilityType?: string;
  },
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<Provider> {
  const { specialty, facilityType = 'Medical Center' } = options || {};
  
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generateProvider', specialty, facilityType);
  
  // Try to get from cache first
  const cached = getFromCache<Provider>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Provider data retrieved from cache');
    return cached;
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
      ResponseFormats.Provider
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(ProviderSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid provider data: ${errors.join(', ')}`);
    }

    console.log('✅ Provider data validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate provider data with AI:', error);
    throw new Error(
      `Provider data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate insurance information using AI
 * Creates realistic insurance data using Azure OpenAI
 * 
 * @param config Azure OpenAI configuration
 * @param patient Patient object (70% chance patient will be the subscriber)
 * @param includeSecondary Whether to include secondary insurance
 * @param cacheConfig Cache configuration
 * @returns InsuranceInfo object
 */
export async function generateInsuranceInfoWithAI(
  config: AzureOpenAIConfig,
  patient: Patient,
  includeSecondary: boolean = false,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<InsuranceInfo> {
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generateInsuranceInfo', patient.id, includeSecondary);
  
  // Try to get from cache first
  const cached = getFromCache<InsuranceInfo>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Insurance data retrieved from cache');
    return cached;
  }

  // 70% chance to use patient as subscriber (matching dataGenerator.ts logic)
  const usePatientAsSubscriber = Math.random() < 0.7;

  const prompt = `Generate complete insurance information for a medical record.

**Patient Information:**
- Name: ${patient.firstName} ${patient.lastName}
- DOB: ${patient.dateOfBirth}
- Gender: ${patient.gender}
- Address: ${patient.address.street}, ${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}
- Phone: ${patient.contact.phone}

**Requirements:**
- Primary insurance (required):
  - Provider name (major US insurer)
  - Policy number
  - Group number
  - Member ID
  - Effective date (current year)
  - Copay and deductible amounts
${includeSecondary ? '- Secondary insurance with similar details and different provider' : '- No secondary insurance (set to null)'}
- Subscriber information:
  ${usePatientAsSubscriber 
    ? '- IMPORTANT: Use the EXACT patient information above for subscriber (name, DOB, gender, address, phone)'
    : '- Generate DIFFERENT subscriber information (different person from patient)'}
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
      ResponseFormats.InsuranceInfo
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(InsuranceInfoSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid insurance data: ${errors.join(', ')}`);
    }

    console.log('✅ Insurance data validated successfully');
    let validatedData = validation.data;
    
    // Enforce the 70% rule: if we decided patient should be subscriber, override AI's response
    if (usePatientAsSubscriber) {
      validatedData = {
        ...validatedData,
        subscriberName: patient.name,
        subscriberDOB: patient.dateOfBirth,
        subscriberGender: patient.gender,
        address: patient.address,
        phone: patient.contact.phone
      };
    }
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate insurance data with AI:', error);
    throw new Error(
      `Insurance data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate CMS-1500 form using AI
 * Creates a complete CMS-1500 claim form with service lines
 * 
 * @param config Azure OpenAI configuration
 * @param patient Patient object
 * @param insuranceInfo Insurance information
 * @param provider Provider object
 * @param cacheConfig Cache configuration
 * @returns CMS1500 object
 */
export async function generateCMS1500WithAI(
  config: AzureOpenAIConfig,
  patient: Patient,
  insuranceInfo: InsuranceInfo,
  provider: Provider,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<CMS1500> {
  // Generate cache key based on patient ID
  const cacheKey = generateCacheKey('generateCMS1500', patient.id);
  
  // Try to get from cache first
  const cached = getFromCache<CMS1500>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ CMS-1500 data retrieved from cache');
    return cached;
  }

  const prompt = `Based on this patient data, generate realistic CMS-1500 insurance claim form data:

Patient: ${patient.firstName} ${patient.lastName}
DOB: ${patient.dateOfBirth}
Insurance: ${insuranceInfo.primaryInsurance.provider}
Provider: ${provider.name}

Generate comprehensive service lines (2-5 services) with:
- Date of service (within last 90 days)
- Place of service code (appropriate for service type)
- Procedure codes (CPT codes like 99213, 99214, 85025, etc.)
- Diagnosis pointers (linking to conditions)
- Charges (realistic amounts)
- Units and modifiers

Include claim information with:
- Patient relationship to subscriber
- Signature date
- Illness/injury date (if applicable)
- Diagnosis codes (ICD-10)
- Prior authorization number (if applicable)
- Total charges

Generate realistic, compliant claims data. All data must be completely synthetic.`;

  const systemPrompt = 'You are a medical billing expert specializing in CMS-1500 forms. Generate realistic, compliant claims data. Always respond with ONLY valid JSON.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.CMS1500
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(CMS1500Schema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid CMS-1500 data: ${errors.join(', ')}`);
    }

    console.log('✅ CMS-1500 data validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate CMS-1500 data with AI:', error);
    throw new Error(
      `CMS-1500 data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate laboratory reports using AI
 * Creates multiple lab reports for different test types
 * 
 * @param config Azure OpenAI configuration
 * @param patient Patient object
 * @param provider Provider object
 * @param testTypes Array of test types to generate (defaults to common tests)
 * @param progressCallback Optional callback for progress updates
 * @param cacheConfig Cache configuration
 * @returns Array of LabReport objects
 */
export async function generateLabReportsWithAI(
  config: AzureOpenAIConfig,
  patient: Patient,
  provider: Provider,
  testTypes: string[] = ['CBC', 'BMP', 'Lipid'],
  progressCallback?: (testType: string, report: any, current: number, total: number) => void,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<LabReport[]> {
  const labReports: LabReport[] = [];
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

  console.log(`\n🧪 Generating ${totalTests} laboratory reports...`);

  // Generate each laboratory report individually
  for (let i = 0; i < testTypes.length; i++) {
    const testType = testTypes[i];
    const currentStep = i + 1;

    // Check cache for individual test type
    const cacheKey = generateCacheKey('generateLabReport', patient.id, testType);
    const cached = getFromCache<LabReport>(cacheConfig, cacheKey);
    
    if (cached) {
      console.log(`  ✨ [${currentStep}/${totalTests}] ${testType}: Retrieved from cache`);
      labReports.push(cached);
      progressCallback?.(testType, cached, currentStep, totalTests);
      continue;
    }

    // Generate prompt for this specific test type
    const testDetail = testTypeDetails[testType] || testType;
    const prompt = `Generate a realistic laboratory test result for this patient:

Patient: ${patient.firstName} ${patient.lastName}
Age: ${patient.age} years
Provider: ${provider.name}

Generate a ${testType} laboratory report: ${testDetail}

Include:
- Test name and type
- Date of collection and reporting (within last 30 days)
- Specimen type and collection method
- Individual test results with values, units, and reference ranges
- Flags for abnormal values (High/Low)
- Performing laboratory information
- Ordering provider

Make results clinically coherent with patient age and realistic for the test type.`;

    const systemPrompt = 'You are a clinical laboratory specialist. Generate realistic, clinically accurate laboratory test results. Always respond with ONLY valid JSON.';

    try {
      console.log(`  🔬 [${currentStep}/${totalTests}] Generating ${testType}...`);
      const data = await generateDataWithAI(config, prompt, systemPrompt, 3, ResponseFormats.LabReportData);
      
      // Validate with Zod schema
      const validation = validateWithSchema(LabReportSchema, data);
      
      if (!validation.success) {
        const errors = formatZodErrors(validation.errors);
        console.error(`  ❌ [${currentStep}/${totalTests}] ${testType} validation failed:`, errors);
        progressCallback?.(testType, null, currentStep, totalTests);
        continue;
      }

      const validatedReport = validation.data;
      
      // Ensure testType is set
      if (!validatedReport.testType && !validatedReport.testName) {
        validatedReport.testType = testType as any;
      }

      // Save individual report to cache
      saveToCache(cacheConfig, cacheKey, validatedReport);
      
      labReports.push(validatedReport);
      console.log(`  ✅ [${currentStep}/${totalTests}] ${testType} generated successfully`);
      
      // Call progress callback
      progressCallback?.(testType, validatedReport, currentStep, totalTests);
      
    } catch (error) {
      console.error(`  ❌ [${currentStep}/${totalTests}] Failed to generate ${testType}:`, error);
      // Continue with other tests even if one fails
      progressCallback?.(testType, null, currentStep, totalTests);
    }
  }

  console.log(`✅ Generated ${labReports.length}/${totalTests} laboratory reports\n`);
  
  return labReports;
}

/**
 * Generate a visit report using AI
 * Creates a medical visit report with vitals, examination, and plan
 * 
 * @param config Azure OpenAI configuration
 * @param patient Patient object
 * @param provider Provider object
 * @param numberOfVisits Number of visits to generate (default: 1, returns first)
 * @param cacheConfig Cache configuration
 * @returns VisitReport object
 */
export async function generateVisitReportWithAI(
  config: AzureOpenAIConfig,
  patient: Patient,
  provider: Provider,
  numberOfVisits: number = 1,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<VisitReport> {
  // Generate cache key based on patient ID
  const cacheKey = generateCacheKey('generateVisitReport', patient.id, numberOfVisits);
  
  // Try to get from cache first
  const cached = getFromCache<VisitReport>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Visit report retrieved from cache');
    return cached;
  }

  const prompt = `Generate a realistic medical visit report for this patient:

Patient: ${patient.firstName} ${patient.lastName}
Age: ${patient.age} years
Gender: ${patient.gender}
Provider: ${provider.name}

Include:
- Visit date (within last 90 days)
- Chief complaint (realistic for patient age/gender)
- History of present illness
- Vital signs (BP, HR, Temp, RR, O2 Sat, Height, Weight, BMI)
- Physical examination findings
- Assessment and diagnosis
- Treatment plan
- Follow-up instructions
- Medications prescribed or refilled

Make the visit clinically coherent and age-appropriate. All data must be completely synthetic.`;

  const systemPrompt = 'You are an experienced physician creating synthetic medical visit documentation for educational purposes. Generate realistic, clinically accurate visit reports.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.VisitReport
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(VisitReportSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid visit report: ${errors.join(', ')}`);
    }

    console.log('✅ Visit report validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate visit report with AI:', error);
    throw new Error(
      `Visit report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate medical history using AI
 * Creates a comprehensive patient medical history
 * 
 * @param config Azure OpenAI configuration
 * @param patient Patient object (used for age-appropriate conditions)
 * @param complexity Complexity level: 'low', 'medium', or 'high'
 * @param cacheConfig Cache configuration
 * @returns MedicalHistory object
 */
export async function generateMedicalHistoryWithAI(
  config: AzureOpenAIConfig,
  patient: Patient,
  complexity: Complexity = 'medium',
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<MedicalHistory> {
  // Generate cache key based on patient ID and complexity
  const cacheKey = generateCacheKey('generateMedicalHistory', patient.id, complexity);
  
  // Try to get from cache first
  const cached = getFromCache<MedicalHistory>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Medical history retrieved from cache');
    return cached;
  }

  const complexityDetails = {
    low: '1-2 chronic conditions, 2-3 current medications, 1 allergy, minimal history',
    medium: '2-4 chronic conditions, 4-6 current medications, 2-3 allergies, moderate history',
    high: '4+ chronic conditions, 7+ current medications, 3+ allergies, extensive history'
  };

  const prompt = `Generate a comprehensive medical history for this patient:

Patient: ${patient.firstName} ${patient.lastName}
Age: ${patient.age} years
Gender: ${patient.gender}

**Complexity Level: ${complexity}** (${complexityDetails[complexity]})

Include:
- Current medications (with dosages, frequencies, start dates)
- Discontinued medications (with reasons)
- Chronic conditions (with diagnosis dates, status)
- Allergies (allergen, reaction, severity)
- Surgical history (procedures with dates)
- Family history (relatives, conditions, ages)
- Social history (smoking, alcohol, exercise, occupation)
- Immunizations (vaccines with dates)

Make all conditions and medications clinically appropriate for patient's age and gender.
Ensure internal consistency across all medical history elements.
All data must be completely synthetic.`;

  const systemPrompt = 'You are an experienced physician creating comprehensive synthetic medical histories for educational purposes. Generate realistic, clinically coherent medical data.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.MedicalHistory
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(MedicalHistorySchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid medical history: ${errors.join(', ')}`);
    }

    console.log('✅ Medical history validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate medical history with AI:', error);
    throw new Error(
      `Medical history generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
