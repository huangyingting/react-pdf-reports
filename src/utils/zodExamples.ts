/**
 * Example: Using Zod Schemas with AI Data Generation
 * 
 * This file demonstrates how to use Zod schemas for:
 * 1. Type-safe data generation with Azure OpenAI
 * 2. Runtime validation of generated data
 * 3. Creating custom schemas for specific use cases
 */

import { generateDataWithAI, AzureOpenAIConfig } from './azureOpenAI';
import { 
  Patient, 
  BasicData
} from './zodSchemas';
import {
  ResponseFormats,
  validateWithSchema,
  formatZodErrors,
  zodToOpenAISchema,
  PatientDemographicsSchema,
  BasicDataSchema
} from './jsonSchemaGenerator';
import { z } from 'zod';

// ============================================================================
// Example 1: Generate and Validate Patient Demographics
// ============================================================================

/**
 * Generate patient demographics with automatic Zod schema validation
 */
export async function generateValidatedPatient(
  config: AzureOpenAIConfig
): Promise<Patient> {
  const prompt = `Generate realistic patient demographics with:
- Name, date of birth (age 25-75), contact information
- Complete US address
- Insurance details with copay and deductible
- Pharmacy information
- Medical record number and SSN`;

  // Generate data using Zod-derived JSON Schema
  const data = await generateDataWithAI(
    config,
    prompt,
    'You are a medical data generator creating HIPAA-compliant synthetic records.',
    3,
    ResponseFormats.PatientDemographics // Automatically uses Zod schema
  );

  // Runtime validation using Zod
  const validation = validateWithSchema(PatientDemographicsSchema, data);
  
  if (!validation.success) {
    const errors = formatZodErrors(validation.errors);
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }

  console.log('✅ Patient data validated successfully!');
  return validation.data;
}

// ============================================================================
// Example 2: Generate Complete Medical Record with Validation
// ============================================================================

/**
 * Generate a complete medical record
 */
export async function generateValidatedMedicalRecord(
  config: AzureOpenAIConfig,
  complexity: 'low' | 'medium' | 'high' = 'medium'
): Promise<BasicData> {
  const prompt = `Generate a complete medical record with complexity: ${complexity}

Include:
- Patient demographics (all required fields)
- Insurance (primary required, secondary optional)
- Provider with NPI, specialty, and facility details
- Current timestamp for generatedAt`;

  const data = await generateDataWithAI(
    config,
    prompt,
    'You are generating comprehensive medical records for educational purposes.',
    3,
    ResponseFormats.BasicData // Uses Zod-derived schema
  );

  // Validate with Zod
  const validation = validateWithSchema(BasicDataSchema, data);
  
  if (!validation.success) {
    console.error('Validation errors:', formatZodErrors(validation.errors));
    throw new Error('Generated data failed validation');
  }

  console.log('✅ Medical record validated!');
  console.log(`  - Patient: ${validation.data.patient.name}`);
  console.log(`  - Provider: ${validation.data.provider.name}`);

  return validation.data;
}

// ============================================================================
// Example 3: Custom Zod Schema for Specific Use Case
// ============================================================================

/**
 * Define a custom Zod schema for a simplified visit summary
 */
export const SimpleVisitSchema = z.object({
  visitId: z.string().uuid().describe('Unique visit identifier (UUID)'),
  patientName: z.string().min(1).describe('Patient full name'),
  visitDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).describe('Visit date in MM/DD/YYYY format'),
  chiefComplaint: z.string().describe('Primary reason for visit'),
  diagnosis: z.string().describe('Primary diagnosis'),
  vitals: z.object({
    bloodPressure: z.string().describe('BP in format 120/80'),
    heartRate: z.number().int().min(40).max(200).describe('Heart rate (40-200 bpm)'),
    temperature: z.number().min(95).max(105).describe('Temperature in °F (95-105)')
  }),
  medications: z.array(z.object({
    name: z.string().describe('Medication name'),
    dosage: z.string().describe('Dosage (e.g., "10mg twice daily")')
  })).describe('Prescribed medications'),
  followUpRequired: z.boolean().describe('Whether follow-up is needed'),
  followUpDays: z.number().int().positive().optional().describe('Days until follow-up (if required)')
});

export type SimpleVisit = z.infer<typeof SimpleVisitSchema>;

/**
 * Generate a simple visit summary using custom Zod schema
 */
export async function generateSimpleVisit(
  config: AzureOpenAIConfig
): Promise<SimpleVisit> {
  // Convert Zod schema to OpenAI format
  const responseFormat = zodToOpenAISchema(
    SimpleVisitSchema,
    'SimpleVisitSummary',
    { description: 'Simplified visit summary with core information' }
  );

  const prompt = `Generate a simple visit summary for a recent office visit.
Include visit ID (UUID), patient name, date, chief complaint, diagnosis, vitals, and any prescribed medications.`;

  const data = await generateDataWithAI(
    config,
    prompt,
    'You are generating visit summaries for educational purposes.',
    3,
    responseFormat
  );

  // Validate and parse with custom Zod schema
  const validation = validateWithSchema(SimpleVisitSchema, data);
  
  if (!validation.success) {
    throw new Error(`Validation failed: ${formatZodErrors(validation.errors).join(', ')}`);
  }

  return validation.data;
}

// ============================================================================
// Example 4: Schema Composition with Zod
// ============================================================================

/**
 * Create a composite schema using existing Zod schemas
 */
export const PatientSummarySchema = z.object({
  demographics: z.object({
    name: z.string(),
    age: z.number(),
    gender: z.enum(['Male', 'Female', 'Other'])
  }),
  recentVisits: z.array(z.object({
    date: z.string(),
    type: z.string(),
    provider: z.string()
  })).max(5).describe('Most recent 5 visits'),
  activeConditions: z.array(z.string()).describe('Active chronic conditions'),
  currentMedications: z.array(z.string()).describe('Current medication names')
});

export type PatientSummary = z.infer<typeof PatientSummarySchema>;

/**
 * Generate a patient summary using composed schemas
 */
export async function generatePatientSummary(
  config: AzureOpenAIConfig
): Promise<PatientSummary> {
  const responseFormat = zodToOpenAISchema(
    PatientSummarySchema,
    'PatientSummary',
    { description: 'Concise patient summary' }
  );

  const prompt = `Generate a patient summary with demographics, recent visits, active conditions, and current medications.`;

  const data = await generateDataWithAI(
    config,
    prompt,
    'You are generating patient summaries.',
    3,
    responseFormat
  );

  const validated = PatientSummarySchema.parse(data); // Throws on validation error
  return validated;
}

// ============================================================================
// Example 5: Conditional Validation
// ============================================================================

/**
 * Schema with conditional validation using Zod's refine
 */
export const AppointmentSchema = z.object({
  appointmentType: z.enum(['in-person', 'telehealth']),
  location: z.string().optional(),
  videoLink: z.string().url().optional()
}).refine(
  (data) => {
    // In-person appointments must have location
    if (data.appointmentType === 'in-person') {
      return !!data.location;
    }
    // Telehealth appointments must have video link
    if (data.appointmentType === 'telehealth') {
      return !!data.videoLink;
    }
    return true;
  },
  {
    message: 'In-person appointments require location, telehealth requires videoLink'
  }
);

export type Appointment = z.infer<typeof AppointmentSchema>;

/**
 * Generate appointment with conditional validation
 */
export async function generateAppointment(
  config: AzureOpenAIConfig,
  type: 'in-person' | 'telehealth'
): Promise<Appointment> {
  const responseFormat = zodToOpenAISchema(AppointmentSchema, 'Appointment');

  const prompt = `Generate a ${type} appointment. ${
    type === 'in-person' 
      ? 'Include physical location address.' 
      : 'Include video conference link.'
  }`;

  const data = await generateDataWithAI(config, prompt, 'Generate appointment data.', 3, responseFormat);

  // This will throw if validation fails (including the refine check)
  return AppointmentSchema.parse(data);
}

// ============================================================================
// Example 6: Transforming Data with Zod
// ============================================================================

/**
 * Schema that transforms data during validation
 */
export const DateTransformSchema = z.object({
  visitDate: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/)
    .transform((str) => {
      const [month, day, year] = str.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }),
  patientName: z.string().trim().toLowerCase().transform((name) => {
    // Transform to title case
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  })
});

/**
 * Benefits of Zod over Plain JSON Schema:
 * 
 * 1. **Single Source of Truth**
 *    - Define once, get TypeScript types + JSON Schema + validation
 * 
 * 2. **Runtime Validation**
 *    - Validate API responses, user input, generated data
 *    - Catch errors before they propagate
 * 
 * 3. **Type Safety**
 *    - TypeScript types automatically inferred from schemas
 *    - No manual type/schema synchronization
 * 
 * 4. **Composability**
 *    - Build complex schemas from simpler ones
 *    - Reuse common patterns
 * 
 * 5. **Transformations**
 *    - Transform data during validation (date parsing, formatting, etc.)
 * 
 * 6. **Conditional Logic**
 *    - Complex validation rules with .refine() and .superRefine()
 * 
 * 7. **Better Error Messages**
 *    - Detailed, path-specific error messages
 *    - Easy to format and display to users
 * 
 * 8. **Less Code**
 *    - No duplicate type definitions
 *    - Automatic JSON Schema generation
 */

/**
 * Usage Example:
 * 
 * ```typescript
 * import { generateValidatedPatient } from './utils/zodExamples';
 * import { getAzureConfig } from './utils/azureConfigStorage';
 * 
 * const config = getAzureConfig();
 * if (config) {
 *   try {
 *     // Generate and validate in one go
 *     const patient = await generateValidatedPatient(config);
 *     console.log('Valid patient:', patient.name);
 *     
 *     // TypeScript knows all patient properties
 *     console.log('Age:', patient.age);
 *     console.log('Insurance:', patient.insurance.provider);
 *   } catch (error) {
 *     console.error('Generation or validation failed:', error);
 *   }
 * }
 * ```
 */
