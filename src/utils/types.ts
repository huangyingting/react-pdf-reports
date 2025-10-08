/**
 * Shared Type Definitions for Medical Records and CMS-1500 Data Generation
 * 
 * This file now primarily contains:
 * - Constants (MEDICAL_SPECIALTIES, FACILITY_NAMES, etc.)
 * - Re-exports from zodSchemas.ts for backward compatibility
 * - Types not yet migrated to Zod schemas (MedicalHistoryData, LaboratoryReportData, etc.)
 * 
 * Main type definitions are now in zodSchemas.ts
 */

// Import and re-export types from zodSchemas.ts for backward compatibility
import type {
  Address,
  Contact,
  Insurance,
  Pharmacy,
  PatientDemographics,
  InsuranceInfo,
  Provider,
  ServiceLine,
  ClaimInfo,
  VisitVitals,
  VitalSigns,
  VisitNote,
  BasicData,
  CMS1500Data,
  InsurancePolicyData,
  VisitReportData,
  // Medical History Types
  Allergy,
  ChronicCondition,
  SurgicalHistory,
  FamilyHistory,
  MedicalHistory,
  // Medication Types
  CurrentMedication,
  DiscontinuedMedication,
  Medications,
  MedicalHistoryData,
  // Laboratory Types
  LabTestType,
  LabTestResult,
  LaboratoryReportData,
  // Generation Options
  GenerationOptions,
  DataPreset
} from './zodSchemas';

export type {
  Address,
  Contact,
  Insurance,
  Pharmacy,
  PatientDemographics,
  InsuranceInfo,
  Provider,
  ServiceLine,
  ClaimInfo,
  VisitVitals,
  VitalSigns,
  VisitNote,
  BasicData,
  CMS1500Data,
  InsurancePolicyData,
  VisitReportData,
  // Medical History Types
  Allergy,
  ChronicCondition,
  SurgicalHistory,
  FamilyHistory,
  MedicalHistory,
  // Medication Types
  CurrentMedication,
  DiscontinuedMedication,
  Medications,
  MedicalHistoryData,
  // Laboratory Types
  LabTestType,
  LabTestResult,
  LaboratoryReportData,
  // Generation Options
  GenerationOptions,
  DataPreset
};

// Constants
export const MEDICAL_SPECIALTIES = [
  'Family Medicine',
  'Internal Medicine',
  'General Practice',
  'Pediatrics',
  'Geriatrics',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Hematology',
  'Nephrology',
  'Neurology',
  'Obstetrics and Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology (ENT)',
  'Psychiatry',
  'Pulmonology',
  'Rheumatology',
  'Urology',
  'Emergency Medicine',
  'Anesthesiology',
  'Radiology',
  'Pathology'
] as const;

export type MedicalSpecialty = typeof MEDICAL_SPECIALTIES[number];

export const FACILITY_NAMES = [
  'City Medical Center',
  'Regional Health Clinic',
  'Community Health Associates',
  'Primary Care Partners',
  'Family Health Center',
  'Medical Arts Building',
  'Healthcare Plaza',
  'Medical Group Associates',
  'University Hospital',
  'Memorial Medical Center',
  'St. Mary\'s Hospital',
  'General Hospital',
  'County Medical Center',
  'Mercy Hospital',
  'Providence Health Center',
  'Valley View Medical Group',
  'Lakeside Clinic',
  'Mountain View Healthcare',
  'Riverside Medical Associates',
  'Central Health Clinic',
  'Metro Medical Center',
  'Suburban Health Services',
  'Northwest Medical Group',
  'Eastside Family Medicine',
  'Southside Health Partners'
] as const;

export type FacilityName = typeof FACILITY_NAMES[number];

export const PHARMACY_NAMES = [
  'CVS Pharmacy',
  'Walgreens',
  'Rite Aid',
  'Walmart Pharmacy',
  'Target Pharmacy',
  'Kroger Pharmacy',
  'Safeway Pharmacy',
  'Community Pharmacy',
  'HealthMart Pharmacy',
  'Costco Pharmacy'
] as const;

export type PharmacyName = typeof PHARMACY_NAMES[number];

export const INSURANCE_COMPANIES = [
  'Blue Cross Blue Shield',
  'Aetna',
  'Cigna',
  'UnitedHealthcare',
  'Humana',
  'Kaiser Permanente',
  'Medicare',
  'Medicaid',
  'Anthem',
  'Independence Blue Cross',
  'HealthPartners',
  'Molina Healthcare',
  'WellCare',
  'Centene',
  'Oscar Health',
  'Bright Health',
  'Tricare',
  'Geisinger Health Plan',
  'HealthFirst',
  'EmblemHealth'
] as const;

export type InsuranceCompany = typeof INSURANCE_COMPANIES[number];

export const INSURANCE_PLAN_TYPES = [
  'HMO',
  'PPO',
  'EPO',
  'POS',
  'HDHP',
  'Indemnity'
] as const;

export type InsurancePlanType = typeof INSURANCE_PLAN_TYPES[number];

export const COPAY_AMOUNTS = [
  '$0',
  '$10',
  '$15',
  '$20',
  '$25',
  '$30',
  '$35',
  '$40',
  '$45',
  '$50',
  '$75',
  '$100'
] as const;

export type CopayAmount = typeof COPAY_AMOUNTS[number];

export const DEDUCTIBLE_AMOUNTS = [
  '$0',
  '$250',
  '$500',
  '$750',
  '$1000',
  '$1500',
  '$2000',
  '$2500',
  '$3000',
  '$4000',
  '$5000',
  '$6000',
  '$7500',
  '$10000'
] as const;

export type DeductibleAmount = typeof DEDUCTIBLE_AMOUNTS[number];

// NOTE: All interface types are now defined in zodSchemas.ts and re-exported above
// This includes: Address, Contact, Insurance, Pharmacy, PatientDemographics, InsuranceInfo,
// Provider, ServiceLine, ClaimInfo, VisitVitals, VitalSigns, VisitNote, BasicData,
// CMS1500Data, InsurancePolicyData, VisitReportData, Allergy, ChronicCondition,
// SurgicalHistory, FamilyHistory, MedicalHistory, CurrentMedication, DiscontinuedMedication,
// Medications, MedicalHistoryData, LabTestType, LabTestResult, LaboratoryReportData,
// GenerationOptions, and DataPreset

/**
 * Data generation presets
 */
export const DATA_GENERATION_PRESETS: Record<string, DataPreset> = {
  simple: {
    name: 'Simple Patient',
    description: 'Basic patient with minimal medical history',
    options: {
      complexity: 'low',
      numberOfVisits: 1,
      numberOfLabTests: 1,
      includeSecondaryInsurance: false
    }
  },
  standard: {
    name: 'Standard Patient',
    description: 'Typical patient with moderate medical complexity',
    options: {
      complexity: 'medium',
      numberOfVisits: 2,
      numberOfLabTests: 2,
      includeSecondaryInsurance: true
    }
  },
  complex: {
    name: 'Complex Patient',
    description: 'Patient with multiple conditions and extensive history',
    options: {
      complexity: 'high',
      numberOfVisits: 3,
      numberOfLabTests: 3,
      includeSecondaryInsurance: true
    }
  }
};
