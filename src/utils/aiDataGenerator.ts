/**
 * AI-Powered Medical Data Generator using Azure OpenAI
 * Generates realistic medical records using large language models
 */

import { generateDataWithAI, AzureOpenAIConfig } from './azureOpenAI';
import { BasicData, CMS1500Data, InsurancePolicyData, VisitReportData, MedicalHistoryData } from './types';
import { 
  ResponseFormats, 
  validateWithSchema, 
  formatZodErrors,
  BasicDataSchema,
  CMS1500DataSchema,
  InsurancePolicyDataSchema,
  VisitReportDataSchema
} from './jsonSchemaGenerator';

/**
 * Generate a complete medical record using Azure OpenAI
 * The structure is enforced by the Zod schema via structured outputs
 * 
 * Note: numberOfVisits and numberOfLabTests are not part of BasicData schema.
 * They are used by the calling code to generate additional reports.
 */
export async function generateBasicDataWithAI(
  config: AzureOpenAIConfig,
  complexity: 'low' | 'medium' | 'high' = 'medium'
): Promise<BasicData> {
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
      ResponseFormats.BasicData
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(BasicDataSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid data: ${errors.join(', ')}`);
    }

    console.log('✅ Medical record validated successfully with Zod');
    return validation.data as BasicData;
  } catch (error) {
    console.error('Failed to generate medical record with AI:', error);
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
  basicData: BasicData
): Promise<CMS1500Data> {
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
    return validation.data as CMS1500Data;
  } catch (error) {
    throw new Error(`Failed to generate CMS-1500 data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate Insurance Policy data using Azure OpenAI
 */
export async function generateInsurancePolicyDataWithAI(
  config: AzureOpenAIConfig,
  basicData: BasicData
): Promise<InsurancePolicyData> {
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
    return validation.data as InsurancePolicyData;
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
  numberOfVisits: number = 1
): Promise<VisitReportData[]> {
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
  complexity: 'low' | 'medium' | 'high' = 'medium'
): Promise<MedicalHistoryData> {
  const prompt = `Generate a comprehensive medical history for this patient:

Patient: ${basicData.patient.firstName} ${basicData.patient.lastName}
Age: ${new Date().getFullYear() - new Date(basicData.patient.dateOfBirth).getFullYear()} years

Complexity: ${complexity}
- Low: 1-2 conditions, 2-3 medications, minimal history
- Medium: 2-4 conditions, 4-6 medications, moderate history  
- High: 4+ conditions, 7+ medications, extensive history

Include:
- Allergies (medication name, allergen, reaction, severity)
- Active and past medical conditions (condition name, ICD-10 code, diagnosis date, status)
- Current and discontinued medications (name, dosage, frequency, start/end dates, prescribing doctor, notes)
- Surgical history (procedure name, date, surgeon, hospital, indications, complications)
- Family history (relative relationship, condition, age at diagnosis, status, notes)
- Social history (smoking, alcohol use, exercise, occupation, etc.)
- Immunization history

Ensure clinical coherence - medications should match conditions.

Respond with valid JSON matching MedicalHistoryData interface.`;

  const systemPrompt = 'You are a medical historian specializing in comprehensive patient histories. Generate realistic, clinically coherent medical histories. Always respond with ONLY valid JSON.';

  try {
    const data = await generateDataWithAI(config, prompt, systemPrompt);
    return data as MedicalHistoryData;
  } catch (error) {
    throw new Error(`Failed to generate Medical History data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate Laboratory Report data using Azure OpenAI
 */
export async function generateLaboratoryReportDataWithAI(
  config: AzureOpenAIConfig,
  basicData: BasicData,
  testTypes: string[]
): Promise<Map<string, any>> {
  const prompt = `Generate realistic laboratory test results for this patient:

Patient: ${basicData.patient.firstName} ${basicData.patient.lastName}
Age: ${new Date().getFullYear() - new Date(basicData.patient.dateOfBirth).getFullYear()} years
Provider: ${basicData.provider.name}

Generate ${testTypes.length} laboratory report(s) for the following test types: ${testTypes.join(', ')}

For each lab report, include:
- Test type and full test name
- Specimen type (e.g., Blood, Urine, etc.)
- Collection date and time (within last 30 days)
- Received date (same or next day after collection)
- Report date (1-3 days after collection)
- Report time
- Ordering physician: ${basicData.provider.name}
- Performing lab details (name, address, phone, CLIA number, director name)
- Detailed test results array with:
  * Parameter name
  * Value (realistic for the test)
  * Unit
  * Reference range
  * Flag (Normal/High/Low/Critical/Abnormal or empty string)
  * Optional notes for abnormal values
- Optional interpretation (for complex panels)
- Optional comments (clinical significance)
- Optional critical values array (if any results are critical)
- Technologist name (for who performed the test)
- Pathologist name (for who reviewed/signed off)

Test type details:
- CBC: Complete Blood Count (WBC, RBC, Hemoglobin, Hematocrit, Platelets, etc.)
- BMP: Basic Metabolic Panel (Glucose, Calcium, Sodium, Potassium, CO2, Chloride, BUN, Creatinine)
- CMP: Comprehensive Metabolic Panel (includes BMP + liver enzymes)
- Urinalysis: Color, Clarity, pH, Specific Gravity, Protein, Glucose, Ketones, Blood, etc.
- Lipid: Total Cholesterol, HDL, LDL, Triglycerides
- LFT: Liver Function Tests (ALT, AST, ALP, Bilirubin, Albumin, Total Protein)
- Thyroid: TSH, T3, T4
- HbA1c: Hemoglobin A1c percentage
- Coagulation: PT, PTT, INR
- Microbiology: Culture results, organism identification, sensitivities
- Pathology: Tissue examination, diagnosis
- Hormone: Various hormone levels
- Infectious: Disease markers, antibody tests

Make results clinically coherent with patient age and any conditions mentioned.

Respond with valid JSON object where keys are test types and values are LaboratoryReportData objects.`;

  const systemPrompt = 'You are a clinical laboratory specialist. Generate realistic, clinically accurate laboratory test results. Always respond with ONLY valid JSON.';

  try {
    const data = await generateDataWithAI(config, prompt, systemPrompt);
    const labReportsMap = new Map<string, any>();
    
    // Convert the response to a Map
    if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([testType, reportData]) => {
        labReportsMap.set(testType, reportData);
      });
    }
    
    return labReportsMap;
  } catch (error) {
    throw new Error(`Failed to generate Laboratory Report data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
