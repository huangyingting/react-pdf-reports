/**
 * Generate sample CMS-1500 claim form data
 * This creates realistic claim data for testing and demonstration
 */

import { MedicalRecord } from './dataGenerator';

export interface CMS1500Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CMS1500Patient {
  name: string;
  lastName: string;
  firstName: string;
  middleInitial: string;
  dateOfBirth: string;
  gender: string;
  address: CMS1500Address;
  contact: {
    phone: string;
  };
  accountNumber: string;
}

export interface CMS1500Insurance {
  type: string;
  picaCode: string;
  primaryInsurance: {
    company: string;
    memberId: string;
    groupNumber: string;
  };
  subscriberName: string;
  subscriberDOB: string;
  subscriberGender: string;
  address: CMS1500Address;
  phone: string;
  secondaryInsured: {
    name: string;
    policyNumber: string;
    planName: string;
  };
}

export interface CMS1500Provider {
  signature: string;
  taxId: string;
  taxIdType: 'SSN' | 'EIN';
  facilityName: string;
  facilityAddress: string;
  facilityNPI: string;
  billingName: string;
  billingAddress: string;
  billingPhone: string;
  billingNPI: string;
  referringProvider: {
    name: string;
    npi: string;
  };
}

export interface CMS1500ServiceLine {
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

export interface CMS1500Claim {
  patientRelationship: 'self' | 'spouse' | 'child' | 'other';
  signatureDate: string;
  providerSignatureDate: string;
  dateOfIllness: string;
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
  serviceLines: CMS1500ServiceLine[];
  hasOtherHealthPlan: boolean;
  otherClaimId: string;
  acceptAssignment: boolean;
  totalCharges: string;
  amountPaid: string;
}

export interface CMS1500Data {
  patient: CMS1500Patient;
  insurance: CMS1500Insurance;
  provider: CMS1500Provider;
  claim: CMS1500Claim;
}

export const generateCMS1500Data = (patientData?: MedicalRecord): CMS1500Data => {
  return {
    patient: {
      name: patientData?.patient?.name || 'SMITH, JOHN A',
      lastName: patientData?.patient?.lastName || 'SMITH',
      firstName: patientData?.patient?.firstName || 'JOHN',
      middleInitial: 'A',
      dateOfBirth: patientData?.patient?.dateOfBirth || '01/15/1965',
      gender: patientData?.patient?.gender || 'M',
      address: {
        street: patientData?.patient?.address?.street || '123 MAIN STREET',
        city: patientData?.patient?.address?.city || 'SPRINGFIELD',
        state: patientData?.patient?.address?.state || 'IL',
        zipCode: patientData?.patient?.address?.zipCode || '62701',
      },
      contact: {
        phone: patientData?.patient?.contact?.phone || '(555) 123-4567',
      },
      accountNumber: patientData?.patient?.id || 'PAT-2024-001',
    },

    insurance: {
      type: 'group',
      picaCode: '',
      primaryInsurance: {
        company: patientData?.insurance?.primaryInsurance?.company || 'BLUE CROSS BLUE SHIELD',
        memberId: patientData?.insurance?.primaryInsurance?.memberNumber || 'XYZ123456789',
        groupNumber: patientData?.insurance?.primaryInsurance?.groupNumber || 'GRP-001234',
      },
      subscriberName: patientData?.patient?.name || 'SMITH, JOHN A',
      subscriberDOB: patientData?.patient?.dateOfBirth || '01/15/1965',
      subscriberGender: patientData?.patient?.gender || 'M',
      address: {
        street: '123 MAIN STREET',
        city: 'SPRINGFIELD',
        state: 'IL',
        zipCode: '62701',
      },
      phone: '(555) 123-4567',
      secondaryInsured: {
        name: '',
        policyNumber: '',
        planName: '',
      },
    },

    provider: {
      signature: 'Dr. Sarah Williams, MD',
      taxId: '12-3456789',
      taxIdType: 'EIN',
      facilityName: 'SPRINGFIELD MEDICAL CENTER',
      facilityAddress: '123 HEALTHCARE BLVD, SPRINGFIELD, IL 62701',
      facilityNPI: '1234567890',
      billingName: 'SPRINGFIELD MEDICAL CENTER',
      billingAddress: '123 HEALTHCARE BLVD, SPRINGFIELD, IL 62701',
      billingPhone: '(555) 555-0100',
      billingNPI: '1234567890',
      referringProvider: {
        name: 'DR. ROBERT JOHNSON',
        npi: '9876543210',
      },
    },

    claim: {
      patientRelationship: 'self',
      signatureDate: '10/05/2024',
      providerSignatureDate: '10/05/2024',
      dateOfIllness: '09/15/2024',
      illnessQualifier: '431',
      otherDate: '',
      otherDateQualifier: '',
      unableToWorkFrom: '',
      unableToWorkTo: '',
      hospitalizationFrom: '',
      hospitalizationTo: '',
      additionalInfo: '',
      outsideLab: false,
      outsideLabCharges: '',
      
      // Diagnosis codes (ICD-10)
      diagnosisCodes: [
        'I10',      // A. Essential hypertension
        'E11.9',    // B. Type 2 diabetes mellitus without complications
        'E78.5',    // C. Hyperlipidemia, unspecified
        'Z00.00',   // D. Encounter for general adult medical examination
      ],
      
      resubmissionCode: '',
      originalRefNo: '',
      priorAuthNumber: '',
      
      // Service lines
      serviceLines: [
        {
          dateFrom: '09/15/2024',
          dateTo: '09/15/2024',
          placeOfService: '11',
          emg: '',
          procedureCode: '99214',
          modifier: '',
          diagnosisPointer: 'A,B,C',
          charges: '225.00',
          units: '1',
          epsdt: '',
          idQual: 'NPI',
          renderingProviderNPI: '1234567890',
        },
        {
          dateFrom: '09/15/2024',
          dateTo: '09/15/2024',
          placeOfService: '11',
          emg: '',
          procedureCode: '80053',
          modifier: '',
          diagnosisPointer: 'B,C',
          charges: '85.00',
          units: '1',
          epsdt: '',
          idQual: 'NPI',
          renderingProviderNPI: '1234567890',
        },
        {
          dateFrom: '09/15/2024',
          dateTo: '09/15/2024',
          placeOfService: '11',
          emg: '',
          procedureCode: '93000',
          modifier: '',
          diagnosisPointer: 'A',
          charges: '45.00',
          units: '1',
          epsdt: '',
          idQual: 'NPI',
          renderingProviderNPI: '1234567890',
        },
      ],
      
      hasOtherHealthPlan: false,
      otherClaimId: '',
      acceptAssignment: true,
      
      // Financial
      totalCharges: '355.00',
      amountPaid: '0.00',
    },
  };
};

/**
 * Generate multiple CMS-1500 forms if needed
 */
export const generateMultipleCMS1500Forms = (patientData: MedicalRecord, count: number = 1): CMS1500Data[] => {
  const forms: CMS1500Data[] = [];
  for (let i = 0; i < count; i++) {
    forms.push(generateCMS1500Data(patientData));
  }
  return forms;
};

/**
 * Common place of service codes
 */
export const PLACE_OF_SERVICE_CODES: Record<string, string> = {
  '11': 'Office',
  '12': 'Home',
  '21': 'Inpatient Hospital',
  '22': 'Outpatient Hospital',
  '23': 'Emergency Room - Hospital',
  '24': 'Ambulatory Surgical Center',
  '31': 'Skilled Nursing Facility',
  '32': 'Nursing Facility',
  '41': 'Ambulance - Land',
  '42': 'Ambulance - Air or Water',
  '81': 'Independent Laboratory',
};

/**
 * Common CPT codes for reference
 */
export const COMMON_CPT_CODES: Record<string, string> = {
  // Office Visits
  '99201': 'Office visit, new patient, level 1',
  '99202': 'Office visit, new patient, level 2',
  '99203': 'Office visit, new patient, level 3',
  '99204': 'Office visit, new patient, level 4',
  '99205': 'Office visit, new patient, level 5',
  '99211': 'Office visit, established patient, level 1',
  '99212': 'Office visit, established patient, level 2',
  '99213': 'Office visit, established patient, level 3',
  '99214': 'Office visit, established patient, level 4',
  '99215': 'Office visit, established patient, level 5',
  
  // Lab Tests
  '80053': 'Comprehensive metabolic panel',
  '85025': 'Complete blood count with differential',
  '83036': 'Hemoglobin A1C',
  '80061': 'Lipid panel',
  '84443': 'Thyroid stimulating hormone',
  
  // Procedures
  '93000': 'Electrocardiogram, routine ECG',
  '71045': 'Chest x-ray, single view',
  '36415': 'Venipuncture',
};
