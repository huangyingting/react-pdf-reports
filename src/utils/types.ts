/**
 * Shared Type Definitions for Medical Records and CMS-1500 Data Generation
 * This file contains all interface definitions used across the application
 */

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

// Basic Types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface Contact {
  phone: string;
  email: string;
  emergencyContact: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  effectiveDate: string;
  memberId?: string;  // Member ID for insurance (used in CMS-1500)
  copay?: string;
  deductible?: string;
}

export interface Pharmacy {
  name: string;
  address: string;
  phone: string;
}

// Patient Types
export interface PatientDemographics {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  address: Address;
  contact: Contact;
  insurance: Insurance;
  medicalRecordNumber: string;
  ssn: string;
  accountNumber?: string;
}

export interface InsuranceInfo {
  primaryInsurance: Insurance;
  secondaryInsurance: Insurance | null;
  subscriberName?: string;
  subscriberDOB?: string;
  subscriberGender?: string;
  type?: string;
  picaCode?: string;
  phone?: string;
  address?: Address;
  secondaryInsured?: {
    name: string;
    policyNumber: string;
    planName: string;
  };
}

// Provider Types
export interface Provider {
  name: string;
  npi: string;
  specialty: string;
  phone: string;
  address: Address;
  taxId?: string;
  taxIdType?: 'SSN' | 'EIN';
  signature?: string;
  // Facility information
  facilityName?: string;
  facilityAddress?: Address;
  facilityPhone?: string;
  facilityFax?: string;
  facilityNPI?: string;
  // Billing information
  billingName?: string;
  billingAddress?: string;
  billingPhone?: string;
  billingNPI?: string;
  referringProvider?: {
    name: string;
    npi: string;
  };
}

// Medical History Types
export interface Allergy {
  allergen: string;
  reaction: string;
  severity: string;
  dateIdentified: string;
}

export interface ChronicCondition {
  condition: string;
  diagnosedDate: string;
  status: string;
  notes: string;
}

export interface SurgicalHistory {
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  complications: string;
}

export interface FamilyHistory {
  relation: string;
  conditions: string[];
  ageAtDeath: string;
  causeOfDeath: string;
}

export interface MedicalHistory {
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  surgicalHistory: SurgicalHistory[];
  familyHistory: FamilyHistory[];
}

// Medication Types
export interface CurrentMedication {
  name: string;
  strength: string;
  dosage: string;
  purpose: string;
  prescribedBy: string;
  startDate: string;
  instructions: string;
}

export interface DiscontinuedMedication {
  name: string;
  strength: string;
  reason: string;
  discontinuedDate: string;
  prescribedBy: string;
}

export interface Medications {
  current: CurrentMedication[];
  discontinued: DiscontinuedMedication[];
}

// Vital Signs and Lab Results Types
export interface VitalSigns {
  date: string;
  time: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  bmi: string;
  oxygenSaturation: string;
  respiratoryRate: string;
}

export interface LabResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: string;
}

export interface LabTest {
  testDate: string;
  testName: string;
  results: LabResult[];
  orderingPhysician: string;
}

// Visit Types
export interface VisitVitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  weight: number;
  height: string;
  oxygenSaturation: number;
}

export interface VisitNote {
  date: string;
  type: string;
  chiefComplaint: string;
  assessment: string[];
  plan: string[];
  provider: string;
  duration: string;
  vitals: VisitVitals;
}

// CMS-1500 Specific Types
export interface ServiceLine {
  dateFrom: string;
  dateTo: string;
  placeOfService: string;
  emg: string;
  procedureCode: string;
  modifier: string;
  diagnosisPointer: string;
  charges: string;
  units: string;
  epsdt: string;
  idQual: string;
  renderingProviderNPI: string;
}

export interface ClaimInfo {
  patientRelationship: 'self' | 'spouse' | 'child' | 'other';
  signatureDate: string;
  providerSignatureDate: string;
  dateOfIllness: string;
  serviceDate: string;
  illnessQualifier: string;
  otherDate: string;
  otherDateQualifier: string;
  unableToWorkFrom: string;
  unableToWorkTo: string;
  hospitalizationFrom: string;
  hospitalizationTo: string;
  additionalInfo: string;
  outsideLab: boolean;
  outsideLabCharges: string;
  diagnosisCodes: string[];
  resubmissionCode: string;
  originalRefNo: string;
  priorAuthNumber: string;
  serviceLines: ServiceLine[];
  hasOtherHealthPlan: boolean;
  otherClaimId: string;
  acceptAssignment: boolean;
  totalCharges: string;
  amountPaid: string;
}

// Complete Record Types
export interface MedicalRecord {
  patient: PatientDemographics;
  insurance: InsuranceInfo;
  provider: Provider;
  medicalHistory: MedicalHistory;
  medications: Medications;
  labResults: LabTest[];
  vitalSigns: VitalSigns[];
  visitNotes: VisitNote[];
  generatedAt: string;
  metadata: {
    complexity: string;
    numberOfVisits: number;
    numberOfLabTests: number;
    dataVersion: string;
  };
}

export interface CMS1500Data {
  patient: PatientDemographics;
  insurance: InsuranceInfo;
  provider: Provider;
  claim: ClaimInfo;
}

export interface InsurancePolicyData {
  patient: PatientDemographics;
  insurance: InsuranceInfo;
}

export interface VisitReportData {
  patient: PatientDemographics;
  provider: Provider;
  visit: VisitNote;
  vitalSigns: VitalSigns;
}

export interface MedicationHistoryData {
  patient: PatientDemographics;
  provider: Provider;
  medications: Medications;
  allergies: Allergy[];
}

// Laboratory Report Types
export type LabTestType = 
  | 'CBC'           // Complete Blood Count
  | 'BMP'           // Basic Metabolic Panel
  | 'CMP'           // Comprehensive Metabolic Panel
  | 'Urinalysis'    // Urinalysis
  | 'Lipid'         // Lipid Profile
  | 'LFT'           // Liver Function Tests
  | 'Thyroid'       // Thyroid Function Tests
  | 'HbA1c'         // Hemoglobin A1c
  | 'Coagulation'   // Coagulation Panel
  | 'Microbiology'  // Microbiology Cultures
  | 'Pathology'     // Pathology Reports
  | 'Hormone'       // Hormone Panels
  | 'Infectious';   // Infectious Disease Panels

export interface LabTestResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: 'Normal' | 'High' | 'Low' | 'Critical' | 'Abnormal' | '';
  notes?: string;
}

export interface LaboratoryReportData {
  patient: PatientDemographics;
  provider: Provider;
  testType: LabTestType;
  testName: string;
  specimenType: string;
  specimenCollectionDate: string;
  specimenCollectionTime: string;
  specimenReceivedDate: string;
  reportDate: string;
  reportTime: string;
  orderingPhysician: string;
  performingLab: {
    name: string;
    address: Address;
    phone: string;
    cliaNumber: string;
    director: string;
  };
  results: LabTestResult[];
  interpretation?: string;
  comments?: string;
  criticalValues?: string[];
  technologist?: string;
  pathologist?: string;
}

// Generation Options and Presets
export interface GenerationOptions {
  complexity?: 'low' | 'medium' | 'high';
  numberOfVisits?: number;
  numberOfLabTests?: number;
  includeSecondaryInsurance?: boolean;
}

export interface DataPreset {
  name: string;
  description: string;
  options: Required<GenerationOptions>;
}

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
