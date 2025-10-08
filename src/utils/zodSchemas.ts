/**
 * Zod Schema Definitions
 * 
 * Single source of truth for data structures - defines both:
 * 1. TypeScript types (via z.infer<>)
 * 2. Runtime validation (via schema.parse())
 * 3. JSON Schema (via zodToJsonSchema())
 */

import { z } from 'zod';

// ============================================================================
// Basic Building Blocks
// ============================================================================

export const AddressSchema = z.object({
  street: z.string().describe('Street address'),
  city: z.string().describe('City name'),
  state: z.string().length(2).describe('Two-letter state code (e.g., CA, NY)'),
  zipCode: z.string().describe('ZIP code'),
  country: z.string().nullable().describe('Country name (optional)')
});

export const ContactSchema = z.object({
  phone: z.string().describe('Phone number in format (XXX) XXX-XXXX'),
  email: z.string().email().describe('Email address'),
  emergencyContact: z.string().describe('Emergency contact name and phone')
});

export const InsuranceSchema = z.object({
  provider: z.string().describe('Insurance provider name'),
  policyNumber: z.string().describe('Policy number'),
  groupNumber: z.string().nullable().describe('Group number'),
  effectiveDate: z.string().describe('Effective date in YYYY-MM-DD format'),
  memberId: z.string().nullable().describe('Member ID'),
  copay: z.string().nullable().describe('Copay amount (e.g., $20)'),
  deductible: z.string().nullable().describe('Deductible amount (e.g., $1000)')
});

export const PharmacySchema = z.object({
  name: z.string().describe('Pharmacy name'),
  address: z.string().describe('Pharmacy address'),
  phone: z.string().describe('Pharmacy phone number')
});

// ============================================================================
// Patient
// ============================================================================

export const PatientSchema = z.object({
  id: z.string().describe('Unique patient identifier'),
  name: z.string().describe('Full name (FirstName MiddleInitial LastName)'),
  firstName: z.string().describe('First name'),
  lastName: z.string().describe('Last name'),
  middleInitial: z.string().nullable().describe('Middle initial'),
  dateOfBirth: z.string().describe('Date of birth in MM/DD/YYYY format'),
  age: z.number().int().min(1).describe('Age in years'),
  gender: z.string().describe('Gender'),
  address: AddressSchema,
  contact: ContactSchema,
  pharmacy: PharmacySchema,
  medicalRecordNumber: z.string().describe('Medical record number (MRN)'),
  ssn: z.string().describe('Social Security Number in XXX-XX-XXXX format'),
  accountNumber: z.string().describe('Account number')
});

// ============================================================================
// Insurance Information
// ============================================================================

export const InsuranceInfoSchema = z.object({
  primaryInsurance: InsuranceSchema,
  secondaryInsurance: InsuranceSchema.nullable(),
  subscriberName: z.string().describe('Subscribername if different from patient'),
  subscriberDOB: z.string().describe('Subscriber date of birth'),
  subscriberGender: z.string().describe('Subscriber gender'),
  type: z.string().describe('Insurance type'),
  picaCode: z.string().nullable().describe('PICA code'),
  phone: z.string().describe('Subscriber phone'),
  address: AddressSchema.describe("Subscriber address"),
  secondaryInsured: z.object({
    name: z.string(),
    policyNumber: z.string(),
    planName: z.string()
  }).nullable().describe('Secondary insured information')
});

// ============================================================================
// Provider Information
// ============================================================================

export const ProviderSchema = z.object({
  name: z.string().describe('Provider full name (e.g., Dr. John Smith)'),
  npi: z.string().length(10).describe('National Provider Identifier (10 digits)'),
  specialty: z.string().describe('Medical specialty'),
  phone: z.string().describe('Provider phone number'),
  address: AddressSchema,
  taxId: z.string().describe('Tax ID number'),
  taxIdType: z.enum(['SSN', 'EIN']).describe('Tax ID type'),
  signature: z.string().nullable().describe('Provider signature'),
  facilityName: z.string().describe('Facility name'),
  facilityAddress: AddressSchema,
  facilityPhone: z.string().describe('Facility phone number'),
  facilityFax: z.string().describe('Facility fax number'),
  facilityNPI: z.string().describe('Facility NPI'),
  billingName: z.string().describe('Billing provider name'),
  billingAddress: z.string().describe('Billing address'),
  billingPhone: z.string().describe('Billing phone number'),
  billingNPI: z.string().describe('Billing NPI'),
  // Legacy field for backward compatibility
  referringProvider: z.object({
    name: z.string(),
    npi: z.string()
  }).nullable().describe('Referring provider information')
});

// ============================================================================
// CMS-1500 Specific Schemas
// ============================================================================

export const ServiceLineSchema = z.object({
  dateFrom: z.string().describe('Service date from (MM/DD/YYYY)'),
  dateTo: z.string().describe('Service date to (MM/DD/YYYY)'),
  placeOfService: z.string().describe('Place of service code'),
  emg: z.string().describe('Emergency indicator'),
  procedureCode: z.string().describe('CPT/HCPCS procedure code'),
  modifier: z.string().describe('Procedure modifier'),
  diagnosisPointer: z.string().describe('Diagnosis pointer (e.g., A, B, C)'),
  charges: z.string().describe('Charge amount'),
  units: z.string().describe('Units of service'),
  epsdt: z.string().describe('EPSDT indicator'),
  idQual: z.string().describe('ID qualifier'),
  renderingProviderNPI: z.string().describe('Rendering provider NPI')
});

export const ClaimSchema = z.object({
  patientRelationship: z.enum(['self', 'spouse', 'child', 'other']).describe('Patient\'s relationship to subscriber'),
  signatureDate: z.string().describe('Patient signature date'),
  providerSignatureDate: z.string().describe('Provider signature date'),
  dateOfIllness: z.string().describe('Date of current illness/injury'),
  serviceDate: z.string().describe('Service date'),
  illnessQualifier: z.string().describe('Illness qualifier code'),
  otherDate: z.string().describe('Other date'),
  otherDateQualifier: z.string().describe('Other date qualifier'),
  unableToWorkFrom: z.string().describe('Unable to work from date'),
  unableToWorkTo: z.string().describe('Unable to work to date'),
  hospitalizationFrom: z.string().describe('Hospitalization from date'),
  hospitalizationTo: z.string().describe('Hospitalization to date'),
  additionalInfo: z.string().describe('Additional claim information'),
  outsideLab: z.boolean().describe('Outside lab used'),
  outsideLabCharges: z.string().describe('Outside lab charges'),
  diagnosisCodes: z.array(z.string()).describe('ICD-10 diagnosis codes'),
  resubmissionCode: z.string().describe('Resubmission code'),
  originalRefNo: z.string().describe('Original reference number'),
  priorAuthNumber: z.string().describe('Prior authorization number'),
  serviceLines: z.array(ServiceLineSchema).describe('Service line items'),
  hasOtherHealthPlan: z.boolean().describe('Has other health plan'),
  otherClaimId: z.string().describe('Other claim ID'),
  acceptAssignment: z.boolean().describe('Accept assignment'),
  totalCharges: z.string().describe('Total charges'),
  amountPaid: z.string().describe('Amount paid')
});

// ============================================================================
// Visit and Vital Signs
// ============================================================================

export const VisitVitalsSchema = z.object({
  bloodPressure: z.string().describe('Blood pressure (e.g., 120/80)'),
  heartRate: z.number().describe('Heart rate in bpm'),
  temperature: z.number().describe('Temperature in °F'),
  weight: z.number().describe('Weight in lbs'),
  height: z.string().describe('Height (e.g., 5\'10")'),
  oxygenSaturation: z.number().describe('Oxygen saturation %')
});

export const VitalSignsSchema = z.object({
  date: z.string().describe('Date in MM/DD/YYYY format'),
  time: z.string().describe('Time in HH:MM format'),
  bloodPressure: z.string().describe('Blood pressure (e.g., 120/80)'),
  heartRate: z.string().describe('Heart rate in bpm'),
  temperature: z.string().describe('Temperature in °F'),
  weight: z.string().describe('Weight in lbs'),
  height: z.string().describe('Height in inches or format 5\'10"'),
  bmi: z.string().describe('Body Mass Index'),
  oxygenSaturation: z.string().describe('Oxygen saturation %'),
  respiratoryRate: z.string().describe('Respiratory rate per minute')
});

export const VisitNoteSchema = z.object({
  date: z.string().describe('Visit date in MM/DD/YYYY format'),
  type: z.string().describe('Visit type (e.g., Office Visit, Follow-up)'),
  chiefComplaint: z.string().describe('Chief complaint'),
  assessment: z.array(z.string()).describe('Assessment findings'),
  plan: z.array(z.string()).describe('Treatment plan'),
  provider: z.string().describe('Provider name'),
  duration: z.string().describe('Visit duration'),
  vitals: VisitVitalsSchema
});

// ============================================================================
// Complete Document Schemas
// ============================================================================

export const CMS1500Schema = z.object({
  patient: PatientSchema,
  insuranceInfo: InsuranceInfoSchema,
  provider: ProviderSchema,
  claimInfo: ClaimSchema
});

export const InsurancePolicySchema = z.object({
  patient: PatientSchema,
  insuranceInfo: InsuranceInfoSchema
});

export const VisitReportSchema = z.object({
  visit: VisitNoteSchema,
  vitalSigns: VitalSignsSchema
});

export const VisitReportsSchema = z.array(VisitReportSchema).describe('Array of visit reports');

// ============================================================================
// Medical History Schemas
// ============================================================================

export const AllergySchema = z.object({
  allergen: z.string().describe('Allergen name (e.g., Penicillin, Peanuts)'),
  reaction: z.string().describe('Allergic reaction (e.g., Rash, Anaphylaxis)'),
  severity: z.string().describe('Severity level (Mild, Moderate, Severe)'),
  dateIdentified: z.string().describe('Date allergy was identified')
});

export const ChronicConditionSchema = z.object({
  condition: z.string().describe('Condition name (e.g., Hypertension, Diabetes)'),
  diagnosedDate: z.string().describe('Date of diagnosis'),
  status: z.string().describe('Current status (Active, Controlled, Resolved)'),
  notes: z.string().describe('Additional notes about the condition')
});

export const SurgicalHistorySchema = z.object({
  procedure: z.string().describe('Surgical procedure name'),
  date: z.string().describe('Date of surgery'),
  hospital: z.string().describe('Hospital or facility name'),
  surgeon: z.string().describe('Surgeon name'),
  complications: z.string().describe('Any complications (or "None")')
});

export const FamilyHistorySchema = z.object({
  relation: z.string().describe('Relationship to patient (e.g., Mother, Father, Sibling)'),
  conditions: z.array(z.string()).describe('Medical conditions'),
  ageAtDeath: z.string().describe('Age at death (if deceased) or "Living"'),
  causeOfDeath: z.string().describe('Cause of death (if applicable) or "N/A"')
});



// ============================================================================
// Medication Schemas
// ============================================================================

export const CurrentMedicationSchema = z.object({
  name: z.string().describe('Medication name'),
  strength: z.string().describe('Strength/dosage (e.g., 10mg)'),
  dosage: z.string().describe('Dosage instructions (e.g., Take 1 tablet)'),
  purpose: z.string().describe('Purpose/indication for medication'),
  prescribedBy: z.string().describe('Prescribing provider'),
  startDate: z.string().describe('Date started'),
  instructions: z.string().describe('Special instructions')
});

export const DiscontinuedMedicationSchema = z.object({
  name: z.string().describe('Medication name'),
  strength: z.string().describe('Strength/dosage (e.g., 10mg)'),
  reason: z.string().describe('Reason for discontinuation'),
  discontinuedDate: z.string().describe('Date discontinued'),
  prescribedBy: z.string().describe('Prescribing provider')
});

export const MedicationsSchema = z.object({
  current: z.array(CurrentMedicationSchema).describe('Current medications'),
  discontinued: z.array(DiscontinuedMedicationSchema).describe('Discontinued medications')
});

export const MedicalHistorySchema = z.object({
  medications: MedicationsSchema,
  allergies: z.array(AllergySchema).describe('List of allergies'),
  chronicConditions: z.array(ChronicConditionSchema).describe('List of chronic conditions'),
  surgicalHistory: z.array(SurgicalHistorySchema).describe('Surgical history'),
  familyHistory: z.array(FamilyHistorySchema).describe('Family medical history')
});
// ============================================================================
// Laboratory Report Schemas
// ============================================================================

export const LabTestTypeEnum = z.enum([
  'CBC',           // Complete Blood Count
  'BMP',           // Basic Metabolic Panel
  'CMP',           // Comprehensive Metabolic Panel
  'Urinalysis',    // Urinalysis
  'Lipid',         // Lipid Profile
  'LFT',           // Liver Function Tests
  'Thyroid',       // Thyroid Function Tests
  'HbA1c',         // Hemoglobin A1c
  'Coagulation',   // Coagulation Panel
  'Microbiology',  // Microbiology Cultures
  'Pathology',     // Pathology Reports
  'Hormone',       // Hormone Panels
  'Infectious'     // Infectious Disease Panels
]);

export const LabTestResultSchema = z.object({
  parameter: z.string().describe('Test parameter name'),
  value: z.string().describe('Test result value'),
  unit: z.string().describe('Unit of measurement'),
  referenceRange: z.string().describe('Normal reference range'),
  flag: z.enum(['Normal', 'High', 'Low', 'Critical', 'Abnormal', '']).describe('Result flag'),
  notes: z.string().nullable().describe('Additional notes')
});

export const LabReportSchema = z.object({
  testType: LabTestTypeEnum.describe('Type of lab test'),
  testName: z.string().describe('Full test name'),
  specimenType: z.string().describe('Specimen type (e.g., Blood, Urine)'),
  specimenCollectionDate: z.string().describe('Date specimen collected'),
  specimenCollectionTime: z.string().describe('Time specimen collected'),
  specimenReceivedDate: z.string().describe('Date specimen received by lab'),
  reportDate: z.string().describe('Date report generated'),
  reportTime: z.string().describe('Time report generated'),
  orderingPhysician: z.string().describe('Ordering physician name'),
  performingLab: z.object({
    name: z.string().describe('Laboratory name'),
    address: AddressSchema,
    phone: z.string().describe('Lab phone number'),
    cliaNumber: z.string().describe('CLIA number'),
    director: z.string().describe('Lab director name')
  }).describe('Performing laboratory information'),
  results: z.array(LabTestResultSchema).describe('Test results'),
  interpretation: z.string().nullable().describe('Clinical interpretation'),
  comments: z.string().nullable().describe('Additional comments'),
  criticalValues: z.array(z.string()).nullable().describe('Critical values'),
  technologist: z.string().nullable().describe('Technologist name'),
  pathologist: z.string().nullable().describe('Pathologist name')
});

export const LabReportsSchema = z.array(LabReportSchema).describe('Array of laboratory reports');
// ============================================================================
// Generation Options and Presets
// ============================================================================

export const GenerationOptionsSchema = z.object({
  complexity: z.enum(['low', 'medium', 'high']).describe('Medical complexity level'),
  numberOfVisits: z.number().int().min(1).describe('Number of visits to generate'),
  numberOfLabTests: z.number().int().min(1).describe('Number of lab tests to generate'),
  includeSecondaryInsurance: z.boolean().describe('Whether to include secondary insurance')
});

export const DataPresetSchema = z.object({
  name: z.string().describe('Preset name'),
  description: z.string().describe('Preset description'),
  options: z.object({
    complexity: z.enum(['low', 'medium', 'high']),
    numberOfVisits: z.number().int().min(1),
    numberOfLabTests: z.number().int().min(1),
    includeSecondaryInsurance: z.boolean()
  }).describe('Preset options')
});


// ============================================================================
// TypeScript Type Exports (inferred from Zod schemas)
// ============================================================================

export type Address = z.infer<typeof AddressSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Pharmacy = z.infer<typeof PharmacySchema>;
export type Patient = z.infer<typeof PatientSchema>;
export type Insurance = z.infer<typeof InsuranceSchema>;
export type InsuranceInfo = z.infer<typeof InsuranceInfoSchema>;
export type Provider = z.infer<typeof ProviderSchema>;
export type ServiceLine = z.infer<typeof ServiceLineSchema>;
export type ClaimInfo = z.infer<typeof ClaimSchema>;
export type VisitVitals = z.infer<typeof VisitVitalsSchema>;
export type VitalSigns = z.infer<typeof VitalSignsSchema>;
export type VisitNote = z.infer<typeof VisitNoteSchema>;


// Composite document types
export type CMS1500 = z.infer<typeof CMS1500Schema>;
export type InsurancePolicy = z.infer<typeof InsurancePolicySchema>;
export type VisitReport = z.infer<typeof VisitReportSchema>;
export type VisitReports = z.infer<typeof VisitReportsSchema>;

// Medical History Types
export type Allergy = z.infer<typeof AllergySchema>;
export type ChronicCondition = z.infer<typeof ChronicConditionSchema>;
export type SurgicalHistory = z.infer<typeof SurgicalHistorySchema>;
export type FamilyHistory = z.infer<typeof FamilyHistorySchema>;
export type MedicalHistory = z.infer<typeof MedicalHistorySchema>;

// Medication Types
export type CurrentMedication = z.infer<typeof CurrentMedicationSchema>;
export type DiscontinuedMedication = z.infer<typeof DiscontinuedMedicationSchema>;
export type Medications = z.infer<typeof MedicationsSchema>;

// Laboratory Types
export type LabTestType = z.infer<typeof LabTestTypeEnum>;
export type LabTestResult = z.infer<typeof LabTestResultSchema>;
export type LabReport = z.infer<typeof LabReportSchema>;
export type LabReports = z.infer<typeof LabReportsSchema>;

// Generation Options
export type GenerationOptions = z.infer<typeof GenerationOptionsSchema>;
export type DataPreset = z.infer<typeof DataPresetSchema>;

// Define Zod schema for complexity
export const ComplexitySchema = z.enum(['low', 'medium', 'high']);
export type Complexity = z.infer<typeof ComplexitySchema>;

// Generated Data Schema - Complete data structure for all generated reports
export const GeneratedDataSchema = z.object({
  patient: PatientSchema,
  provider: ProviderSchema,
  insuranceInfo: InsuranceInfoSchema,
  medicalHistory: MedicalHistorySchema,
  visitReports: VisitReportsSchema,
  labReports: LabReportsSchema,
  cms1500: CMS1500Schema
});

export type GeneratedData = z.infer<typeof GeneratedDataSchema>;
