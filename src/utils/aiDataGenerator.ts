/**
 * AI-Powered Medical Data Generator using Azure OpenAI
 * Generates realistic medical records using large language models
 */

import { generateMedicalDataWithAI, AzureOpenAIConfig } from './azureOpenAI';
import { BasicData, CMS1500Data, InsurancePolicyData, VisitReportData, MedicalHistoryData } from './types';

/**
 * Generate a complete medical record using Azure OpenAI
 */
export async function generateMedicalRecordWithAI(
  config: AzureOpenAIConfig,
  complexity: 'low' | 'medium' | 'high' = 'medium',
  numberOfVisits: number = 1,
  numberOfLabTests: number = 3
): Promise<BasicData> {
  const prompt = `Generate a complete, realistic synthetic medical record for educational purposes with the following specifications:

**Patient Requirements:**
- Generate realistic demographics (first name, middle initial, last name, date of birth, gender)
- Include contact information (phone, email, emergency contact)
- Include address (street, city, state, ZIP code)
- Generate unique medical record number and SSN
- Optional account number

**Insurance Requirements:**
- Primary insurance with provider, policy number, group number, member ID
- Include subscriber information (name, DOB, gender) if different from patient
- Include copay and deductible amounts
- Optional secondary insurance (20% chance)

**Provider Requirements:**
- Provider name, NPI number, specialty (choose from: Family Medicine, Internal Medicine, Cardiology, etc.)
- Phone number and tax ID information
- Facility name, phone, fax, NPI
- Complete address

**Complexity Level: ${complexity}**
- Low: 1-2 chronic conditions, 2-3 current medications, 1 allergy, minimal history
- Medium: 2-4 chronic conditions, 4-6 current medications, 2-3 allergies, moderate history
- High: 4+ chronic conditions, 7+ current medications, 3+ allergies, extensive history

**Additional Data:**
- Number of visits to generate: ${numberOfVisits}
- Number of lab tests: ${numberOfLabTests}
- Include metadata with complexity level, data version, generation timestamp

**IMPORTANT:**
1. Generate current date as today's date in MM/DD/YYYY format
2. Ensure all dates are realistic and consistent
3. All data must be completely synthetic and HIPAA-compliant
4. Return ONLY valid JSON matching this structure:

{
  "patient": {
    "firstName": "string",
    "middleInitial": "string",
    "lastName": "string",
    "dateOfBirth": "MM/DD/YYYY",
    "medicalRecordNumber": "string",
    "ssn": "XXX-XX-XXXX",
    "accountNumber": "string (optional)",
    "gender": "Male|Female|Other",
    "contact": {
      "phone": "string",
      "email": "string",
      "emergencyContact": "string"
    },
    "address": {
      "street": "string",
      "city": "string",
      "state": "XX",
      "zipCode": "string"
    }
  },
  "insurance": {
    "subscriberName": "string (optional)",
    "subscriberDOB": "string (optional)",
    "subscriberGender": "string (optional)",
    "primaryInsurance": {
      "provider": "string",
      "policyNumber": "string",
      "groupNumber": "string",
      "memberId": "string",
      "copay": "string",
      "deductible": "string"
    },
    "secondaryInsurance": null or {
      "provider": "string",
      "policyNumber": "string",
      "groupNumber": "string",
      "memberId": "string",
      "effectiveDate": "YYYY-MM-DD",
      "copay": "string",
      "deductible": "string"
    }
  },
  "provider": {
    "name": "Dr. FirstName LastName",
    "npi": "string (10 digits)",
    "specialty": "string",
    "phone": "string",
    "taxId": "string",
    "taxIdType": "SSN|EIN",
    "facilityName": "string",
    "facilityPhone": "string",
    "facilityFax": "string",
    "facilityNPI": "string",
    "address": {
      "street": "string",
      "city": "string",
      "state": "XX",
      "zipCode": "string"
    }
  },
  "generatedAt": "ISO8601 timestamp",
  "metadata": {
    "complexity": "${complexity}",
    "numberOfVisits": ${numberOfVisits},
    "numberOfLabTests": ${numberOfLabTests},
    "dataVersion": "2.0",
    "generationMethod": "azure-openai"
  }
}`;

  const systemPrompt = `You are an expert medical data generator creating synthetic, realistic medical records for educational and training purposes. 

Key Requirements:
- Generate completely fictional data that appears realistic
- Ensure all data is HIPAA-compliant (no real patient information)
- Follow US healthcare standards and formats
- Maintain internal consistency (e.g., dates, relationships)
- Use realistic medical terminology and conventions
- Always respond with ONLY valid JSON, no additional text

Your expertise includes:
- Medical record systems and EMR standards
- Healthcare billing and insurance processes
- Clinical documentation best practices
- Medical coding (ICD-10, CPT)
- US healthcare regulations`;

  try {
    const generatedData = await generateMedicalDataWithAI(config, prompt, systemPrompt);
    
    // Validate that we have the required structure
    if (!generatedData.patient || !generatedData.insurance || !generatedData.provider) {
      throw new Error('Generated data is missing required fields');
    }

    // Ensure metadata is present
    if (!generatedData.metadata) {
      generatedData.metadata = {
        complexity,
        numberOfVisits,
        numberOfLabTests,
        dataVersion: '2.0',
        generationMethod: 'azure-openai'
      };
    }

    // Ensure generatedAt is present
    if (!generatedData.generatedAt) {
      generatedData.generatedAt = new Date().toISOString();
    }

    // IMPORTANT: Ensure patient.insurance is populated from primaryInsurance
    // The PatientDemographics interface expects patient.insurance to be a simple Insurance object
    if (generatedData.insurance?.primaryInsurance && !generatedData.patient.insurance) {
      generatedData.patient.insurance = {
        provider: generatedData.insurance.primaryInsurance.provider,
        policyNumber: generatedData.insurance.primaryInsurance.policyNumber,
        groupNumber: generatedData.insurance.primaryInsurance.groupNumber,
        effectiveDate: generatedData.insurance.primaryInsurance.effectiveDate || new Date().toLocaleDateString('en-US'),
        memberId: generatedData.insurance.primaryInsurance.memberId,
        copay: generatedData.insurance.primaryInsurance.copay,
        deductible: generatedData.insurance.primaryInsurance.deductible
      };
    }

    // Ensure patient has required computed fields
    if (!generatedData.patient.id) {
      generatedData.patient.id = generatedData.patient.medicalRecordNumber || `MRN-${Date.now()}`;
    }
    if (!generatedData.patient.name) {
      generatedData.patient.name = `${generatedData.patient.lastName}, ${generatedData.patient.firstName}${generatedData.patient.middleInitial ? ' ' + generatedData.patient.middleInitial : ''}`;
    }
    if (!generatedData.patient.age && generatedData.patient.dateOfBirth) {
      const birthDate = new Date(generatedData.patient.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      generatedData.patient.age = age;
    }
    if (!generatedData.patient.pharmacy) {
      generatedData.patient.pharmacy = {
        name: 'CVS Pharmacy',
        address: '123 Main St',
        phone: '(555) 123-4567'
      };
    }
    if (!generatedData.patient.address?.country) {
      generatedData.patient.address = {
        ...generatedData.patient.address,
        country: 'USA'
      };
    }

    return generatedData as BasicData;
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
    const data = await generateMedicalDataWithAI(config, prompt, systemPrompt);
    return data as CMS1500Data;
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
    const data = await generateMedicalDataWithAI(config, prompt, systemPrompt);
    return data as InsurancePolicyData;
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
    const data = await generateMedicalDataWithAI(config, prompt, systemPrompt);
    return Array.isArray(data) ? data as VisitReportData[] : [data as VisitReportData];
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
    const data = await generateMedicalDataWithAI(config, prompt, systemPrompt);
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
    const data = await generateMedicalDataWithAI(config, prompt, systemPrompt);
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
