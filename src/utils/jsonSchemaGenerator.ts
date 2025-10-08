/**
 * JSON Schema Generator (Zod-based)
 * 
 * Converts Zod schemas to JSON Schema format for Azure OpenAI structured outputs.
 * Uses zod-to-json-schema for automatic conversion from Zod to JSON Schema.
 * 
 * Benefits:
 * - Single source of truth (Zod schemas define both TS types and JSON schemas)
 * - Runtime validation available via Zod
 * - Automatic JSON Schema generation
 * - Less code duplication
 */

import { z } from 'zod';
import {
  PatientDemographicsSchema,
  BasicDataSchema,
  CMS1500DataSchema,
  InsurancePolicyDataSchema,
  VisitReportDataSchema,
  MedicalHistoryDataSchema,
  LaboratoryReportDataSchema,
  LaboratoryReportsCollectionSchema
} from './zodSchemas';

/**
 * Convert a Zod schema to JSON Schema format compatible with Azure OpenAI
 * 
 * @param zodSchema - The Zod schema to convert
 * @param name - Name for the schema (used in OpenAI API)
 * @param options - Additional options for conversion
 */
export function zodToOpenAISchema(
  zodSchema: z.ZodType<any>,
  name: string,
  options?: {
    strict?: boolean;
    description?: string;
  }
) {
  // Use Zod v4's built-in z.toJSONSchema() static method
  // target: 'openapi-3.0' removes the $schema property automatically
  const jsonSchema = z.toJSONSchema(zodSchema, {
    target: 'openapi-3.0'
  });

  return {
    type: 'json_schema',
    json_schema: {
      name,
      strict: options?.strict !== false, // Default to strict mode
      schema: jsonSchema,
      ...(options?.description && { description: options.description })
    }
  };
}

/**
 * Helper function to create a response format object for Azure OpenAI
 * (Backward compatible with old API)
 */
export function createResponseFormat(schemaName: string, schema: any) {
  return {
    type: 'json_schema',
    json_schema: {
      name: schemaName,
      strict: true,
      schema: {
        ...schema,
        additionalProperties: false
      }
    }
  };
}

/**
 * Pre-built response formats using Zod schemas
 * These automatically convert Zod schemas to JSON Schema format
 */
export const ResponseFormats = {
  /**
   * Complete medical record with patient, insurance and provider
   */
  BasicData: zodToOpenAISchema(
    BasicDataSchema,
    'BasicDataResponse',
    { description: 'Basic data', strict: true }
  ),

  /**
   * CMS-1500 claim form data with patient, insurance, provider, and claim details
   */
  CMS1500Data: zodToOpenAISchema(
    CMS1500DataSchema,
    'CMS1500DataResponse',
    { description: 'CMS-1500 claim form data', strict: true }
  ),

  /**
   * Insurance policy document with patient and insurance information
   */
  InsurancePolicyData: zodToOpenAISchema(
    InsurancePolicyDataSchema,
    'InsurancePolicyDataResponse',
    { description: 'Insurance policy document', strict: true }
  ),

  /**
   * Visit report with patient, provider, visit notes, and vital signs
   */
  VisitReportData: zodToOpenAISchema(
    VisitReportDataSchema,
    'VisitReportDataResponse',
    { description: 'Medical visit report', strict: true }
  ),

  /**
   * Patient demographics only
   */
  PatientDemographics: zodToOpenAISchema(
    PatientDemographicsSchema,
    'PatientDemographicsResponse',
    { description: 'Patient demographics', strict: true }
  ),

  /**
   * Medical history with medications, allergies, conditions, and family history
   */
  MedicalHistoryData: zodToOpenAISchema(
    MedicalHistoryDataSchema,
    'MedicalHistoryDataResponse',
    { description: 'Complete medical history', strict: true }
  ),

  /**
   * Laboratory report with test results
   */
  LaboratoryReportData: zodToOpenAISchema(
    LaboratoryReportDataSchema,
    'LaboratoryReportDataResponse',
    { description: 'Laboratory test report', strict: true }
  ),

  /**
   * Multiple laboratory reports wrapped in object (Azure OpenAI requires object root)
   */
  LaboratoryReportsData: zodToOpenAISchema(
    LaboratoryReportsCollectionSchema,
    'LaboratoryReportsDataResponse',
    { description: 'Multiple laboratory test reports', strict: true }
  )
};


/**
 * Validate data against a Zod schema at runtime
 * 
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Validation result with parsed data or errors
 * 
 * @example
 * ```typescript
 * const result = validateWithSchema(PatientDemographicsSchema, patientData);
 * if (result.success) {
 *   console.log('Valid data:', result.data);
 * } else {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateWithSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Format Zod validation errors for display
 * 
 * @param error - Zod validation error
 * @returns Human-readable error messages
 */
export function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map(err => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });
}


/**
 * Export Zod schemas for direct use
 * This allows users to:
 * 1. Create custom schemas using Zod's API
 * 2. Validate data at runtime
 * 3. Convert to JSON Schema on demand
 */
export {
  PatientDemographicsSchema,
  BasicDataSchema,
  CMS1500DataSchema,
  InsurancePolicyDataSchema,
  VisitReportDataSchema,
  MedicalHistoryDataSchema,
  LaboratoryReportDataSchema,
  LaboratoryReportsCollectionSchema,
  // Also export individual component schemas for custom usage
  AllergySchema,
  ChronicConditionSchema,
  SurgicalHistorySchema,
  FamilyHistorySchema,
  CurrentMedicationSchema,
  DiscontinuedMedicationSchema,
  MedicationsSchema,
  LabTestResultSchema,
  LabTestTypeEnum
} from './zodSchemas';
