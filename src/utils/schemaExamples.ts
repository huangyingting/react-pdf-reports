/**
 * Example: Using JSON Schemas with AI Data Generation
 * 
 * This file demonstrates how to pass TypeScript type interfaces as JSON schemas
 * to Azure OpenAI for structured outputs, ensuring the AI returns properly typed data.
 */

import { generateDataWithAI, AzureOpenAIConfig } from './azureOpenAI';
import { 
  PatientDemographics, 
  BasicData, 
  CMS1500Data,
  InsurancePolicyData,
  VisitReportData 
} from './types';
import {
  ResponseFormats,
  createResponseFormat
} from './jsonSchemaGenerator';

/**
 * Example 1: Generate PatientDemographics with schema validation
 */
export async function generatePatientWithSchema(
  config: AzureOpenAIConfig
): Promise<PatientDemographics> {
  const prompt = `Generate a complete patient demographics record with:
- Realistic name, date of birth (between 1940-2005), and contact information
- Complete address in a US state
- Insurance information with provider, policy number, copay, and deductible
- Pharmacy information
- Medical record number and SSN`;

  const systemPrompt = 'You are a medical data generator creating HIPAA-compliant synthetic patient records for educational purposes.';

  // Pass the schema to ensure structured output
  const data = await generateDataWithAI(
    config,
    prompt,
    systemPrompt,
    3, // retries
    ResponseFormats.PatientDemographics // JSON schema for validation
  );

  return data as PatientDemographics;
}

/**
 * Example 2: Generate BasicData with schema validation
 */
export async function generateBasicDataWithSchema(
  config: AzureOpenAIConfig,
  complexity: 'low' | 'medium' | 'high' = 'medium'
): Promise<BasicData> {
  const prompt = `Generate a complete medical record with complexity level: ${complexity}

Include:
1. Patient demographics (name, DOB, contact, address, insurance, pharmacy, MRN, SSN)
2. Insurance information (primary insurance required, secondary insurance optional)
3. Provider information (name, NPI, specialty, facility details)
4. Generation timestamp (current date/time)

Ensure all data is realistic and internally consistent.`;

  const systemPrompt = 'You are a medical data generator creating comprehensive HIPAA-compliant synthetic medical records.';

  // Use the schema to guarantee correct structure
  const data = await generateDataWithAI(
    config,
    prompt,
    systemPrompt,
    3,
    ResponseFormats.BasicData // This ensures the response matches BasicData interface
  );

  return data as BasicData;
}

/**
 * Example 3: Generate CMS1500 claim data with schema validation
 */
export async function generateCMS1500WithSchema(
  config: AzureOpenAIConfig
): Promise<CMS1500Data> {
  const prompt = `Generate a complete CMS-1500 claim form data including:
- Patient demographics
- Insurance information (primary required)
- Provider information with NPI and facility details
- Claim information with:
  * Patient relationship to subscriber
  * Service dates
  * Diagnosis codes (ICD-10)
  * Service lines with CPT codes, charges, and diagnosis pointers
  * Total charges and payment information

Make it realistic for an office visit with labs.`;

  const data = await generateDataWithAI(
    config,
    prompt,
    'You are a medical billing data generator creating CMS-1500 claim forms for educational purposes.',
    3,
    ResponseFormats.CMS1500Data
  );

  return data as CMS1500Data;
}

/**
 * Example 4: Generate Insurance Policy with schema validation
 */
export async function generateInsurancePolicyWithSchema(
  config: AzureOpenAIConfig
): Promise<InsurancePolicyData> {
  const prompt = `Generate an insurance policy document with:
- Patient demographics
- Primary insurance with copay, deductible, coverage details
- Optional secondary insurance (30% chance)
- All dates should be current and realistic`;

  const data = await generateDataWithAI(
    config,
    prompt,
    'You are generating insurance policy documents for educational purposes.',
    3,
    ResponseFormats.InsurancePolicyData
  );

  return data as InsurancePolicyData;
}

/**
 * Example 5: Generate Visit Report with schema validation
 */
export async function generateVisitReportWithSchema(
  config: AzureOpenAIConfig
): Promise<VisitReportData> {
  const prompt = `Generate a medical visit report including:
- Patient demographics
- Provider information
- Visit note with:
  * Visit date (recent)
  * Chief complaint (e.g., "Annual physical", "Follow-up for hypertension")
  * Assessment findings (2-4 items)
  * Treatment plan (2-4 items)
  * Visit duration
  * Vital signs (BP, HR, temp, weight, height, O2 sat)
- Detailed vital signs with date and time`;

  const data = await generateDataWithAI(
    config,
    prompt,
    'You are generating medical visit reports for educational purposes.',
    3,
    ResponseFormats.VisitReportData
  );

  return data as VisitReportData;
}

/**
 * Example 6: Using custom schema for specific use case
 */
export async function generateCustomStructureWithSchema(
  config: AzureOpenAIConfig
): Promise<any> {
  // Define a custom schema for a specific use case
  const customSchema = {
    type: "object",
    properties: {
      patientId: { type: "string", description: "Unique patient identifier" },
      visitDate: { type: "string", description: "Visit date in MM/DD/YYYY format" },
      chiefComplaint: { type: "string", description: "Main reason for visit" },
      vitalSigns: {
        type: "object",
        properties: {
          bloodPressure: { type: "string" },
          heartRate: { type: "number" },
          temperature: { type: "number" }
        },
        required: ["bloodPressure", "heartRate", "temperature"]
      }
    },
    required: ["patientId", "visitDate", "chiefComplaint", "vitalSigns"]
  };

  const responseFormat = createResponseFormat("CustomVisitData", customSchema);

  const prompt = `Generate a simple visit record with patient ID, visit date, chief complaint, and vital signs.`;

  const data = await generateDataWithAI(
    config,
    prompt,
    'You are generating medical visit data.',
    3,
    responseFormat
  );

  return data;
}

/**
 * Benefits of using JSON schemas:
 * 
 * 1. **Type Safety**: Azure OpenAI guarantees the response matches your schema
 * 2. **No Parsing Errors**: Response is always valid JSON matching your structure
 * 3. **Better Prompts**: You don't need to describe JSON structure in the prompt
 * 4. **Consistency**: All generated data follows the same structure
 * 5. **Validation**: Schema validation happens on the API side
 * 
 * Requirements:
 * - Azure OpenAI API version 2024-08-01-preview or later
 * - Model must support structured outputs (gpt-4o, gpt-4o-mini, etc.)
 * - Set strict: true for maximum validation
 */

/**
 * Usage in your application:
 * 
 * ```typescript
 * import { generatePatientWithSchema } from './utils/schemaExamples';
 * import { getAzureConfig } from './utils/azureConfigStorage';
 * 
 * const config = getAzureConfig();
 * if (config) {
 *   const patient = await generatePatientWithSchema(config);
 *   console.log('Generated patient:', patient.name);
 *   // TypeScript knows patient has all PatientDemographics properties
 * }
 * ```
 */
