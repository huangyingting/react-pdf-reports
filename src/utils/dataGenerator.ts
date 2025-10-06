import { faker } from '@faker-js/faker';

/**
 * Medical Records Data Generator using Faker.js
 * Generates realistic medical data for educational and testing purposes
 */

// Type definitions
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

export interface GenerationOptions {
  complexity?: 'low' | 'medium' | 'high';
  numberOfVisits?: number;
  numberOfLabTests?: number;
  includeSecondaryInsurance?: boolean;
}

// CMS-1500 Specific Interfaces
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

export interface DataPreset {
  name: string;
  description: string;
  options: Required<GenerationOptions>;
}

// Medical-specific data arrays
const MEDICAL_CONDITIONS: string[] = [
  'Hypertension', 'Diabetes Type 2', 'Hyperlipidemia', 'Asthma', 'COPD',
  'Arthritis', 'Depression', 'Anxiety', 'Migraine', 'GERD',
  'Thyroid Disease', 'Osteoporosis', 'Allergic Rhinitis', 'Sleep Apnea',
  'Atrial Fibrillation', 'Chronic Kidney Disease', 'Heart Disease'
];

const MEDICATIONS: string[] = [
  'Lisinopril 10mg', 'Metformin 500mg', 'Atorvastatin 20mg', 'Albuterol inhaler',
  'Levothyroxine 50mcg', 'Omeprazole 20mg', 'Sertraline 50mg', 'Ibuprofen 400mg',
  'Acetaminophen 500mg', 'Vitamin D3 1000IU', 'Multivitamin', 'Aspirin 81mg',
  'Prednisone 10mg', 'Losartan 50mg', 'Amlodipine 5mg', 'Gabapentin 300mg'
];

const VISIT_TYPES: string[] = [
  'Annual Physical Exam', 'Follow-up Visit', 'Sick Visit', 'Preventive Care',
  'Chronic Disease Management', 'Medication Review', 'Consultation',
  'Emergency Visit', 'Urgent Care', 'Specialist Referral'
];

const INSURANCE_COMPANIES: string[] = [
  'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare',
  'Humana', 'Kaiser Permanente', 'Medicare', 'Medicaid',
  'Anthem', 'Independence Blue Cross', 'HealthPartners', 'Molina Healthcare'
];

/**
 * Generate patient demographics
 */
export const generatePatientDemographics = (): PatientDemographics => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const middleInitial = faker.string.alpha({ length: 1, casing: 'upper' });
  const dateOfBirth = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  const gender = faker.person.sex();
  
  // Calculate accurate age
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  // Generate consistent IDs
  const patientId = `PAT-${faker.string.numeric(6)}`;
  const mrn = `MRN-${faker.string.numeric(8)}`;
  
  // Generate insurance with proper formatting
  const insuranceProvider = faker.helpers.arrayElement(INSURANCE_COMPANIES);
  const policyNumber = faker.string.alphanumeric({ length: 12, casing: 'upper' });
  const groupNumber = `GRP-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`;
  const effectiveDate = faker.date.past({ years: 2 });
  
  return {
    id: patientId,
    name: `${lastName}, ${firstName} ${middleInitial}`,
    firstName,
    lastName,
    middleInitial,
    dateOfBirth: dateOfBirth.toLocaleDateString('en-US'),
    age,
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
      country: 'USA'
    },
    contact: {
      phone: faker.phone.number(),
      email: faker.internet.email({ firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase() }),
      emergencyContact: `${faker.person.fullName()} (${faker.helpers.arrayElement(['Spouse', 'Child', 'Parent', 'Sibling', 'Friend'])}) - ${faker.phone.number()}`
    },
    insurance: {
      provider: insuranceProvider,
      policyNumber,
      groupNumber,
      effectiveDate: effectiveDate.toLocaleDateString('en-US'),
      memberId: policyNumber
    },
    medicalRecordNumber: mrn,
    ssn: faker.helpers.replaceSymbols('###-##-####'),
    accountNumber: patientId
  };
};

/**
 * Generate insurance information with all fields
 */
export const generateInsuranceInfo = (
  includeSecondary: boolean = false,
  subscriberInfo?: {
    name: string;
    dateOfBirth: string;
    gender: string;
    address: Address;
    phone: string;
  }
): InsuranceInfo => {
  const primaryProvider = faker.helpers.arrayElement(INSURANCE_COMPANIES);
  const primaryPolicyNumber = faker.string.alphanumeric({ length: 12, casing: 'upper' });
  const primaryGroupNumber = `GRP-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`;
  const primaryEffectiveDate = faker.date.past({ years: 2 });
  
  // Generate subscriber information (defaults to patient if not provided)
  const subscriberName = subscriberInfo?.name || `${faker.person.lastName()}, ${faker.person.firstName()} ${faker.string.alpha({ length: 1, casing: 'upper' })}`;
  const subscriberDOB = subscriberInfo?.dateOfBirth || faker.date.birthdate({ min: 18, max: 85, mode: 'age' }).toLocaleDateString('en-US');
  const subscriberGender = subscriberInfo?.gender || faker.person.sex().charAt(0).toUpperCase();
  const subscriberAddress = subscriberInfo?.address || {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
    country: 'USA'
  };
  const subscriberPhone = subscriberInfo?.phone || faker.phone.number();
  
  let secondaryInsurance: Insurance | null = null;
  let secondaryInsured: { name: string; policyNumber: string; planName: string } | undefined;
  
  if (includeSecondary && faker.datatype.boolean(0.3)) {
    // Ensure secondary insurance is from a different provider
    const remainingProviders = INSURANCE_COMPANIES.filter(p => p !== primaryProvider);
    const secondaryProvider = faker.helpers.arrayElement(remainingProviders);
    const secondaryPolicyNumber = faker.string.alphanumeric({ length: 12, casing: 'upper' });
    const secondaryGroupNumber = `GRP-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`;
    const secondaryEffectiveDate = faker.date.past({ years: 2 });
    
    secondaryInsurance = {
      provider: secondaryProvider,
      policyNumber: secondaryPolicyNumber,
      groupNumber: secondaryGroupNumber,
      memberId: secondaryPolicyNumber,
      effectiveDate: secondaryEffectiveDate.toLocaleDateString('en-US'),
      copay: faker.helpers.arrayElement(['$10', '$15', '$20', '$25']),
      deductible: faker.helpers.arrayElement(['$250', '$500', '$1000', '$2000'])
    };
    
    // Generate secondary insured information
    secondaryInsured = {
      name: `${faker.person.lastName()}, ${faker.person.firstName()}`,
      policyNumber: secondaryPolicyNumber,
      planName: `${secondaryProvider} ${faker.helpers.arrayElement(['HMO', 'PPO', 'EPO', 'POS'])} Plan`
    };
  }
  
  return {
    primaryInsurance: {
      provider: primaryProvider,
      policyNumber: primaryPolicyNumber,
      groupNumber: primaryGroupNumber,
      memberId: primaryPolicyNumber,
      effectiveDate: primaryEffectiveDate.toLocaleDateString('en-US'),
      copay: faker.helpers.arrayElement(['$20', '$30', '$40', '$50']),
      deductible: faker.helpers.arrayElement(['$500', '$1000', '$2500', '$5000'])
    },
    secondaryInsurance,
    subscriberName,
    subscriberDOB,
    subscriberGender,
    type: faker.helpers.arrayElement(['group', 'individual', 'medicare', 'medicaid']),
    picaCode: faker.datatype.boolean(0.3) ? faker.string.alphanumeric({ length: 2, casing: 'upper' }) : '',
    phone: subscriberPhone,
    address: subscriberAddress,
    secondaryInsured
  };
};

/**
 * Generate provider information
 */
export const generateProviderInfo = (): Provider => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const providerNPI = faker.string.numeric(10);
  const facilityNPI = faker.string.numeric(10);
  const specialty = faker.helpers.arrayElement([
    'Family Medicine', 'Internal Medicine', 'General Practice', 
    'Pediatrics', 'Geriatrics'
  ]);
  
  // Generate consistent facility information
  const facilityName = faker.helpers.arrayElement([
    'City Medical Center', 'Regional Health Clinic', 'Community Health Associates',
    'Primary Care Partners', 'Family Health Center', 'Medical Arts Building',
    'Healthcare Plaza', 'Medical Group Associates'
  ]);
  
  const facilityAddress = {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####')
  };
  
  const providerAddress = faker.datatype.boolean(0.7) 
    ? facilityAddress // 70% chance provider works at the facility
    : {
        street: faker.location.streetAddress(),
        city: facilityAddress.city, // Same city but different address
        state: facilityAddress.state,
        zipCode: faker.location.zipCode('#####')
      };
  
  const facilityPhone = faker.phone.number();
  const taxId = faker.helpers.replaceSymbols('##-#######');
  
  return {
    name: `Dr. ${firstName} ${lastName}`,
    npi: providerNPI,
    specialty,
    phone: faker.phone.number(),
    address: providerAddress,
    taxId,
    taxIdType: 'EIN' as const,
    signature: `Dr. ${firstName} ${lastName}`,
    facilityName,
    facilityAddress,
    facilityPhone,
    facilityFax: faker.phone.number(),
    facilityNPI,
    billingName: facilityName,
    billingAddress: `${facilityAddress.street}, ${facilityAddress.city}, ${facilityAddress.state} ${facilityAddress.zipCode}`,
    billingPhone: facilityPhone,
    billingNPI: facilityNPI,
    referringProvider: faker.datatype.boolean(0.3) ? {
      name: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      npi: faker.string.numeric(10)
    } : undefined
  };
};

/**
 * Generate medical history
 */
export const generateMedicalHistory = (complexity: 'low' | 'medium' | 'high' = 'medium'): MedicalHistory => {
  const conditionCount = complexity === 'low' ? 2 : complexity === 'high' ? 6 : 4;
  const conditions = faker.helpers.arrayElements(MEDICAL_CONDITIONS, conditionCount);
  
  // Generate allergies as objects with required properties
  const allergyNames = [
    { name: 'Penicillin', reaction: 'Severe rash and difficulty breathing', severity: 'High' },
    { name: 'Sulfa drugs', reaction: 'Hives and swelling', severity: 'Moderate' },
    { name: 'Latex', reaction: 'Contact dermatitis and itching', severity: 'Moderate' },
    { name: 'Shellfish', reaction: 'Hives and swelling', severity: 'Moderate' },
    { name: 'Nuts', reaction: 'Anaphylactic reaction', severity: 'High' },
    { name: 'Pollen', reaction: 'Seasonal allergies, sneezing', severity: 'Low' }
  ];
  const allergyCount = faker.datatype.boolean(0.6) ? faker.number.int({ min: 1, max: 3 }) : 0;
  const allergies: Allergy[] = allergyCount > 0 ? 
    faker.helpers.arrayElements(allergyNames, allergyCount).map(allergy => ({
      allergen: allergy.name,
      reaction: allergy.reaction,
      severity: allergy.severity,
      dateIdentified: faker.date.past({ years: 10 }).toLocaleDateString('en-US')
    })) : [{
      allergen: 'No known allergies',
      reaction: 'None',
      severity: 'None',
      dateIdentified: 'N/A'
    }];

  // Generate surgical history as objects
  const surgicalCount = faker.datatype.boolean(0.4) ? faker.number.int({ min: 1, max: 3 }) : 0;
  const surgicalHistory: SurgicalHistory[] = surgicalCount > 0 ?
    Array.from({ length: surgicalCount }, () => ({
      procedure: faker.helpers.arrayElement([
        'Appendectomy', 'Cholecystectomy', 'Hernia repair', 'Knee arthroscopy',
        'Cataract surgery', 'Colonoscopy', 'Skin lesion removal', 'Gallbladder removal'
      ]),
      date: faker.date.past({ years: 10 }).toLocaleDateString('en-US'),
      hospital: faker.helpers.arrayElement([
        'Springfield Medical Center', 'Regional Hospital', 'City General Hospital',
        'University Medical Center', 'Community Health Center'
      ]),
      surgeon: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      complications: faker.helpers.arrayElement(['None', 'Minor bleeding', 'Infection', 'Delayed healing', 'None reported'])
    })) : [{
      procedure: 'No surgical history',
      date: 'N/A',
      hospital: 'N/A',
      surgeon: 'N/A',
      complications: 'N/A'
    }];

  // Generate family history as objects
  const familyHistory: FamilyHistory[] = [
    {
      relation: 'Mother',
      conditions: faker.helpers.arrayElements(['Diabetes', 'Hypertension', 'Cancer', 'Heart disease'], 
        faker.number.int({ min: 0, max: 2 })),
      ageAtDeath: faker.datatype.boolean(0.3) ? faker.number.int({ min: 65, max: 90 }).toString() : 'Living',
      causeOfDeath: faker.datatype.boolean(0.3) ? faker.helpers.arrayElement(['Cancer', 'Heart disease', 'Stroke', 'Natural causes']) : 'N/A'
    },
    {
      relation: 'Father',
      conditions: faker.helpers.arrayElements(['Heart disease', 'Diabetes', 'Cancer', 'Stroke'], 
        faker.number.int({ min: 0, max: 2 })),
      ageAtDeath: faker.datatype.boolean(0.4) ? faker.number.int({ min: 60, max: 85 }).toString() : 'Living',
      causeOfDeath: faker.datatype.boolean(0.4) ? faker.helpers.arrayElement(['Heart attack', 'Cancer', 'Stroke', 'Natural causes']) : 'N/A'
    }
  ];

  return {
    allergies,
    chronicConditions: conditions.map(condition => ({
      condition,
      diagnosedDate: faker.date.past({ years: 5 }).toLocaleDateString('en-US'),
      status: faker.helpers.arrayElement(['Active', 'Stable', 'Improving', 'Monitoring']),
      notes: faker.helpers.arrayElement([
        'Well controlled with medication',
        'Regular monitoring required',
        'Lifestyle modifications recommended',
        'Specialist follow-up scheduled',
        'Patient compliant with treatment'
      ])
    })),
    surgicalHistory,
    familyHistory
  };
};

/**
 * Generate medications list that correlate with chronic conditions
 */
export const generateMedications = (
  complexity: 'low' | 'medium' | 'high' = 'medium',
  chronicConditions: ChronicCondition[] = []
): Medications => {
  const currentMedCount = complexity === 'low' ? 3 : complexity === 'high' ? 8 : 5;
  const discontinuedMedCount = complexity === 'low' ? 1 : complexity === 'high' ? 4 : 2;
  
  // Map conditions to appropriate medications
  const conditionMedicationMap: Record<string, Array<{name: string, strength: string, purpose: string}>> = {
    'Hypertension': [
      {name: 'Lisinopril', strength: '10mg', purpose: 'Blood pressure control'},
      {name: 'Losartan', strength: '50mg', purpose: 'Blood pressure control'},
      {name: 'Amlodipine', strength: '5mg', purpose: 'Blood pressure control'}
    ],
    'Diabetes Type 2': [
      {name: 'Metformin', strength: '500mg', purpose: 'Diabetes management'},
      {name: 'Glipizide', strength: '5mg', purpose: 'Blood sugar control'}
    ],
    'Hyperlipidemia': [
      {name: 'Atorvastatin', strength: '20mg', purpose: 'Cholesterol management'},
      {name: 'Simvastatin', strength: '40mg', purpose: 'Cholesterol management'}
    ],
    'Asthma': [
      {name: 'Albuterol', strength: 'inhaler', purpose: 'Asthma control'},
      {name: 'Fluticasone', strength: 'inhaler', purpose: 'Asthma prevention'}
    ],
    'COPD': [
      {name: 'Albuterol', strength: 'inhaler', purpose: 'COPD management'},
      {name: 'Tiotropium', strength: 'inhaler', purpose: 'COPD control'}
    ],
    'Depression': [
      {name: 'Sertraline', strength: '50mg', purpose: 'Depression treatment'},
      {name: 'Escitalopram', strength: '10mg', purpose: 'Depression management'}
    ],
    'Anxiety': [
      {name: 'Buspirone', strength: '10mg', purpose: 'Anxiety management'},
      {name: 'Hydroxyzine', strength: '25mg', purpose: 'Anxiety relief'}
    ],
    'Thyroid Disease': [
      {name: 'Levothyroxine', strength: '50mcg', purpose: 'Thyroid regulation'}
    ],
    'GERD': [
      {name: 'Omeprazole', strength: '20mg', purpose: 'Acid reflux control'},
      {name: 'Pantoprazole', strength: '40mg', purpose: 'Stomach acid reduction'}
    ],
    'Arthritis': [
      {name: 'Ibuprofen', strength: '400mg', purpose: 'Pain and inflammation relief'},
      {name: 'Naproxen', strength: '500mg', purpose: 'Arthritis pain management'}
    ]
  };
  
  // Generate medications based on conditions
  const currentMedications: CurrentMedication[] = [];
  const usedMedications = new Set<string>();
  
  // Add medications for each chronic condition
  chronicConditions.forEach(condition => {
    const medOptions = conditionMedicationMap[condition.condition];
    if (medOptions && currentMedications.length < currentMedCount) {
      const med = faker.helpers.arrayElement(medOptions);
      if (!usedMedications.has(med.name)) {
        usedMedications.add(med.name);
        currentMedications.push({
          name: med.name,
          strength: med.strength,
          dosage: faker.helpers.arrayElement(['Once daily', 'Twice daily', 'Three times daily', 'As needed']),
          purpose: med.purpose,
          prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
          startDate: faker.date.between({
            from: new Date(condition.diagnosedDate),
            to: new Date()
          }).toLocaleDateString('en-US'),
          instructions: faker.helpers.arrayElement([
            'Take with food', 'Take on empty stomach', 'Take at bedtime',
            'Take with plenty of water', 'Do not crush or chew', 'May cause drowsiness'
          ])
        });
      }
    }
  });
  
  // Add general medications if needed to reach target count
  while (currentMedications.length < currentMedCount) {
    const generalMeds = [
      {name: 'Vitamin D3', strength: '1000IU', purpose: 'Bone health', dosage: 'Daily'},
      {name: 'Multivitamin', strength: 'As directed', purpose: 'General health', dosage: 'Daily'},
      {name: 'Aspirin', strength: '81mg', purpose: 'Heart health', dosage: 'Daily'},
      {name: 'Acetaminophen', strength: '500mg', purpose: 'Pain relief', dosage: 'As needed'}
    ];
    
    const med = faker.helpers.arrayElement(generalMeds);
    if (!usedMedications.has(med.name)) {
      usedMedications.add(med.name);
      currentMedications.push({
        name: med.name,
        strength: med.strength,
        dosage: med.dosage,
        purpose: med.purpose,
        prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
        startDate: faker.date.past({ years: 1 }).toLocaleDateString('en-US'),
        instructions: 'Take as directed'
      });
    }
  }

  // Generate discontinued medications
  const discontinued: DiscontinuedMedication[] = Array.from({ length: discontinuedMedCount }, () => {
    const med = faker.helpers.arrayElement(MEDICATIONS);
    const discontinuedDate = faker.date.past({ years: 2 });
    return {
      name: med.split(' ')[0],
      strength: med.includes('mg') ? med.split(' ')[1] : 'As directed',
      reason: faker.helpers.arrayElement([
        'Adverse reaction', 'No longer needed', 'Replaced with better option',
        'Side effects', 'Cost concerns', 'Drug interaction', 'Ineffective'
      ]),
      discontinuedDate: discontinuedDate.toLocaleDateString('en-US'),
      prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`
    };
  });

  return {
    current: currentMedications,
    discontinued
  };
};

/**
 * Generate vital signs history with values correlated to patient conditions
 */
export const generateVitalSigns = (
  numberOfReadings: number = 2,
  chronicConditions: ChronicCondition[] = []
): VitalSigns[] => {
  // Determine if patient has specific conditions
  const hasHypertension = chronicConditions.some(c => c.condition.toLowerCase().includes('hypertension'));
  const hasCOPD = chronicConditions.some(c => c.condition === 'COPD');
  const hasHeartDisease = chronicConditions.some(c => c.condition.toLowerCase().includes('heart'));
  
  // Generate consistent height for all readings
  const heightInInches = faker.number.int({ min: 60, max: 76 });
  const heightFeet = Math.floor(heightInInches / 12);
  const heightInchesRemainder = heightInInches % 12;
  const heightString = `${heightFeet}'${heightInchesRemainder}"`;
  
  return Array.from({ length: numberOfReadings }, (_, index) => {
    const date = faker.date.recent({ days: 30 * (numberOfReadings - index) });
    
    // Weight may vary slightly between readings
    const baseWeight = faker.number.int({ min: 120, max: 220 });
    const weight = baseWeight + faker.number.int({ min: -3, max: 3 });
    
    // Calculate accurate BMI
    const bmi = ((weight / (heightInInches * heightInInches)) * 703).toFixed(1);
    
    // Blood pressure based on conditions
    let systolic: number, diastolic: number;
    if (hasHypertension) {
      // Elevated but controlled with medication
      systolic = faker.number.int({ min: 125, max: 145 });
      diastolic = faker.number.int({ min: 78, max: 92 });
    } else {
      // Normal blood pressure
      systolic = faker.number.int({ min: 110, max: 130 });
      diastolic = faker.number.int({ min: 70, max: 85 });
    }
    
    // Heart rate based on conditions
    let heartRate: number;
    if (hasHeartDisease) {
      heartRate = faker.number.int({ min: 65, max: 95 });
    } else {
      heartRate = faker.number.int({ min: 60, max: 90 });
    }
    
    // Oxygen saturation based on respiratory conditions
    let oxygenSaturation: number;
    if (hasCOPD) {
      oxygenSaturation = faker.number.int({ min: 90, max: 96 });
    } else {
      oxygenSaturation = faker.number.int({ min: 95, max: 100 });
    }
    
    // Respiratory rate
    const respiratoryRate = hasCOPD 
      ? faker.number.int({ min: 16, max: 24 })
      : faker.number.int({ min: 12, max: 20 });
    
    return {
      date: date.toLocaleDateString('en-US'),
      time: faker.helpers.arrayElement(['9:00 AM', '10:30 AM', '2:15 PM', '3:45 PM', '11:15 AM']),
      bloodPressure: `${systolic}/${diastolic}`,
      heartRate: heartRate.toString(),
      temperature: faker.number.float({ min: 97.0, max: 99.2, fractionDigits: 1 }).toString(),
      weight: weight.toString(),
      height: heightString,
      bmi,
      oxygenSaturation: `${oxygenSaturation}%`,
      respiratoryRate: respiratoryRate.toString()
    };
  });
};

/**
 * Generate lab results with values correlated to patient's chronic conditions
 */
export const generateLabResults = (
  numberOfTests: number = 3,
  chronicConditions: ChronicCondition[] = []
): LabTest[] => {
  // Determine relevant conditions
  const hasDiabetes = chronicConditions.some(c => c.condition.toLowerCase().includes('diabetes'));
  const hasHyperlipidemia = chronicConditions.some(c => c.condition.toLowerCase().includes('lipid') || c.condition.toLowerCase().includes('cholesterol'));
  const hasKidneyDisease = chronicConditions.some(c => c.condition.toLowerCase().includes('kidney'));
  
  interface LabTestType {
    name: string;
    parameters: {
      parameter: string;
      unit: string;
      referenceRange: string;
      normalRange: [number, number];
    }[];
  }

  const testTypes: LabTestType[] = [
    {
      name: 'Complete Blood Count (CBC)',
      parameters: [
        { parameter: 'White Blood Cells', unit: 'K/uL', referenceRange: '4.0-11.0', normalRange: [4.0, 11.0] },
        { parameter: 'Red Blood Cells', unit: 'M/uL', referenceRange: '4.2-5.4', normalRange: [4.2, 5.4] },
        { parameter: 'Hemoglobin', unit: 'g/dL', referenceRange: '12.0-16.0', normalRange: [12.0, 16.0] },
        { parameter: 'Hematocrit', unit: '%', referenceRange: '36.0-46.0', normalRange: [36.0, 46.0] },
        { parameter: 'Platelets', unit: 'K/uL', referenceRange: '150-450', normalRange: [150, 450] }
      ]
    },
    {
      name: 'Comprehensive Metabolic Panel',
      parameters: [
        { parameter: 'Glucose', unit: 'mg/dL', referenceRange: '70-100', normalRange: [70, 100] },
        { parameter: 'BUN', unit: 'mg/dL', referenceRange: '7-20', normalRange: [7, 20] },
        { parameter: 'Creatinine', unit: 'mg/dL', referenceRange: '0.7-1.3', normalRange: [0.7, 1.3] },
        { parameter: 'Sodium', unit: 'mEq/L', referenceRange: '136-145', normalRange: [136, 145] },
        { parameter: 'Potassium', unit: 'mEq/L', referenceRange: '3.5-5.1', normalRange: [3.5, 5.1] },
        { parameter: 'Chloride', unit: 'mEq/L', referenceRange: '98-107', normalRange: [98, 107] }
      ]
    },
    {
      name: 'Lipid Panel',
      parameters: [
        { parameter: 'Total Cholesterol', unit: 'mg/dL', referenceRange: '<200', normalRange: [150, 200] },
        { parameter: 'HDL Cholesterol', unit: 'mg/dL', referenceRange: '>40', normalRange: [40, 80] },
        { parameter: 'LDL Cholesterol', unit: 'mg/dL', referenceRange: '<100', normalRange: [60, 100] },
        { parameter: 'Triglycerides', unit: 'mg/dL', referenceRange: '<150', normalRange: [50, 150] }
      ]
    }
  ];

  const selectedTests = faker.helpers.arrayElements(testTypes, Math.min(numberOfTests, testTypes.length));
  
  return selectedTests.map(testType => {
    const testDate = faker.date.recent({ days: 90 });
    const results: LabResult[] = testType.parameters.map(param => {
      // Determine if this parameter should be abnormal based on conditions
      let forceAbnormal = false;
      if (hasDiabetes && param.parameter === 'Glucose') {
        forceAbnormal = faker.datatype.boolean(0.6); // 60% chance of elevated glucose
      } else if (hasHyperlipidemia && param.parameter.includes('Cholesterol')) {
        forceAbnormal = faker.datatype.boolean(0.5); // 50% chance of abnormal cholesterol
      } else if (hasKidneyDisease && (param.parameter === 'Creatinine' || param.parameter === 'BUN')) {
        forceAbnormal = faker.datatype.boolean(0.5); // 50% chance of abnormal kidney function
      }
      
      const isNormal = forceAbnormal ? false : faker.datatype.boolean(0.8); // 80% chance of normal values
      let value: number;
      let status: string;
      
      // Determine decimal places based on parameter
      const fractionDigits = 
        param.parameter === 'Creatinine' ? 1 :
        param.unit.includes('%') ? 1 :
        param.parameter.includes('Cholesterol') || param.parameter === 'Glucose' ? 0 :
        param.unit === 'M/uL' ? 2 : 1;
      
      if (isNormal) {
        value = faker.number.float({
          min: param.normalRange[0],
          max: param.normalRange[1],
          fractionDigits
        });
        status = 'Normal';
      } else {
        // Generate slightly abnormal values, biased based on condition
        let isHigh = faker.datatype.boolean();
        
        // For specific parameters with known conditions, bias towards expected abnormality
        if (hasDiabetes && param.parameter === 'Glucose') {
          isHigh = true; // Diabetes causes high glucose
        } else if (hasHyperlipidemia && (param.parameter === 'LDL Cholesterol' || param.parameter === 'Total Cholesterol')) {
          isHigh = true; // Hyperlipidemia causes high cholesterol
        } else if (hasKidneyDisease && (param.parameter === 'Creatinine' || param.parameter === 'BUN')) {
          isHigh = true; // Kidney disease causes elevated markers
        }
        
        if (isHigh) {
          value = faker.number.float({
            min: param.normalRange[1],
            max: param.normalRange[1] * 1.3,
            fractionDigits
          });
          // More accurate status determination
          if (value > param.normalRange[1] * 1.2) {
            status = 'High';
          } else if (value > param.normalRange[1] * 1.1) {
            status = 'Borderline High';
          } else {
            status = 'Slightly Elevated';
          }
        } else {
          value = faker.number.float({
            min: param.normalRange[0] * 0.7,
            max: param.normalRange[0],
            fractionDigits
          });
          status = value < param.normalRange[0] * 0.85 ? 'Low' : 'Borderline Low';
        }
      }
      
      return {
        parameter: param.parameter,
        value: value.toFixed(fractionDigits),
        unit: param.unit,
        referenceRange: param.referenceRange,
        status
      };
    });
    
    return {
      testDate: testDate.toLocaleDateString('en-US'),
      testName: testType.name,
      results,
      orderingPhysician: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`
    };
  });
};

/**
 * Generate visit notes correlated with patient's chronic conditions
 */
export const generateVisitNotes = (
  numberOfVisits: number = 3,
  chronicConditions: ChronicCondition[] = []
): VisitNote[] => {
  // Determine conditions for contextual visit generation
  const hasHypertension = chronicConditions.some(c => c.condition.toLowerCase().includes('hypertension'));
  const hasCOPD = chronicConditions.some(c => c.condition === 'COPD');
  const hasHeartDisease = chronicConditions.some(c => c.condition.toLowerCase().includes('heart'));
  
  // Generate consistent height for all visits
  const heightInInches = faker.number.int({ min: 60, max: 76 });
  const baseWeight = faker.number.int({ min: 120, max: 220 });
  
  // Generate visits in reverse chronological order (most recent first)
  return Array.from({ length: numberOfVisits }, (_, index) => {
    const daysAgo = 30 * (index + 1);
    const visitDate = faker.date.recent({ days: daysAgo });
    const visitType = faker.helpers.arrayElement(VISIT_TYPES);
    
    // Weight may vary slightly between visits
    const weight = baseWeight + faker.number.int({ min: -5, max: 5 });
    
    // Blood pressure based on conditions
    let systolic: number, diastolic: number;
    if (hasHypertension) {
      systolic = faker.number.int({ min: 125, max: 145 });
      diastolic = faker.number.int({ min: 78, max: 92 });
    } else {
      systolic = faker.number.int({ min: 110, max: 130 });
      diastolic = faker.number.int({ min: 70, max: 85 });
    }
    
    // Heart rate
    const heartRate = hasHeartDisease 
      ? faker.number.int({ min: 65, max: 95 })
      : faker.number.int({ min: 60, max: 90 });
    
    // Oxygen saturation
    const oxygenSaturation = hasCOPD
      ? faker.number.int({ min: 90, max: 96 })
      : faker.number.int({ min: 95, max: 100 });
    
    return {
      date: visitDate.toLocaleDateString('en-US'),
      type: visitType,
      chiefComplaint: generateChiefComplaint(chronicConditions),
      assessment: generateAssessment(chronicConditions),
      plan: generateTreatmentPlan(chronicConditions),
      provider: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      duration: faker.helpers.arrayElement(['15 min', '20 min', '30 min', '45 min']),
      vitals: {
        bloodPressure: `${systolic}/${diastolic}`,
        heartRate,
        temperature: faker.number.float({ min: 97.0, max: 99.2, fractionDigits: 1 }),
        weight,
        height: `${heightInInches}"`,
        oxygenSaturation
      }
    };
  });
};

/**
 * Generate chief complaint based on patient's chronic conditions
 */
const generateChiefComplaint = (chronicConditions: ChronicCondition[] = []): string => {
  const conditionNames = chronicConditions.map(c => c.condition.toLowerCase());
  
  // Condition-specific complaints
  const conditionComplaints: string[] = [];
  
  if (conditionNames.some(c => c.includes('hypertension'))) {
    conditionComplaints.push('Follow-up for blood pressure', 'Blood pressure check');
  }
  if (conditionNames.some(c => c.includes('diabetes'))) {
    conditionComplaints.push('Diabetes follow-up', 'Blood sugar management');
  }
  if (conditionNames.some(c => c.includes('asthma') || c.includes('copd'))) {
    conditionComplaints.push('Shortness of breath', 'Respiratory follow-up');
  }
  if (conditionNames.some(c => c.includes('arthritis'))) {
    conditionComplaints.push('Joint pain', 'Arthritis management');
  }
  
  // General complaints
  const generalComplaints = [
    'Annual physical examination',
    'Medication refill',
    'Cold symptoms',
    'Back pain',
    'Fatigue',
    'Headache',
    'Routine check-up',
    'Lab result review',
    'Preventive care visit'
  ];
  
  // Combine and select
  const allComplaints = [...conditionComplaints, ...generalComplaints];
  return faker.helpers.arrayElement(allComplaints);
};

/**
 * Generate assessment based on patient's chronic conditions
 */
const generateAssessment = (chronicConditions: ChronicCondition[] = []): string[] => {
  const assessments: string[] = ['Patient appears well.', 'Vital signs stable.'];
  
  // Add condition-specific assessments
  chronicConditions.forEach(condition => {
    const status = condition.status.toLowerCase();
    if (status === 'active' || status === 'stable') {
      assessments.push(`${condition.condition} - ${status}, well controlled with current regimen.`);
    } else if (status === 'improving') {
      assessments.push(`${condition.condition} - showing improvement with treatment.`);
    } else if (status === 'monitoring') {
      assessments.push(`${condition.condition} - under close monitoring.`);
    }
  });
  
  // Add general assessments
  const generalAssessments = [
    'Patient reports good adherence to medications.',
    'No acute distress noted.',
    'Lab results reviewed with patient.',
    'Patient denies new symptoms.',
    'Weight stable since last visit.',
    'No new concerns today.'
  ];
  
  // Add 1-2 general assessments
  const selectedGeneral = faker.helpers.arrayElements(generalAssessments, faker.number.int({ min: 1, max: 2 }));
  assessments.push(...selectedGeneral);
  
  return assessments.slice(0, 5); // Limit to 5 total assessments
};

/**
 * Generate treatment plan based on patient's chronic conditions
 */
const generateTreatmentPlan = (chronicConditions: ChronicCondition[] = []): string[] => {
  const plans: string[] = [];
  const conditionNames = chronicConditions.map(c => c.condition.toLowerCase());
  
  // Add condition-specific plans
  if (conditionNames.some(c => c.includes('hypertension'))) {
    plans.push(faker.helpers.arrayElement([
      'Continue current blood pressure medications.',
      'Monitor blood pressure at home daily.',
      'Reduce sodium intake, maintain DASH diet.'
    ]));
  }
  
  if (conditionNames.some(c => c.includes('diabetes'))) {
    plans.push(faker.helpers.arrayElement([
      'Continue diabetes medications as prescribed.',
      'Order HbA1c, follow up in 3 months.',
      'Continue glucose monitoring, adjust insulin as needed.'
    ]));
  }
  
  if (conditionNames.some(c => c.includes('lipid') || c.includes('cholesterol'))) {
    plans.push(faker.helpers.arrayElement([
      'Continue statin therapy for cholesterol management.',
      'Repeat lipid panel in 6 months.',
      'Dietary counseling for lipid control.'
    ]));
  }
  
  if (conditionNames.some(c => c.includes('asthma') || c.includes('copd'))) {
    plans.push(faker.helpers.arrayElement([
      'Continue current respiratory medications.',
      'Use rescue inhaler as needed for symptoms.',
      'Pulmonary function testing scheduled.'
    ]));
  }
  
  // Add general plans
  const generalPlans = [
    'Continue current medications as prescribed.',
    'Return for follow-up in 3-6 months.',
    'Order routine lab work for next visit.',
    'Patient education materials provided.',
    'Schedule preventive health screenings.',
    'Lifestyle modifications discussed.',
    'Return sooner if symptoms worsen.',
    'Medication compliance emphasized.'
  ];
  
  // Add 1-2 general plans
  const selectedGeneral = faker.helpers.arrayElements(generalPlans, faker.number.int({ min: 1, max: 2 }));
  plans.push(...selectedGeneral);
  
  return plans.slice(0, 4); // Limit to 4 total plan items
};

/**
 * Generate complete medical records data with logically consistent relationships
 */
export const generateCompleteMedicalRecord = (options: GenerationOptions = {}): MedicalRecord => {
  const {
    complexity = 'medium',
    numberOfVisits = 3,
    numberOfLabTests = 3,
    includeSecondaryInsurance = true
  } = options;

  // Generate patient demographics first
  const patient = generatePatientDemographics();
  
  // Generate insurance with proper secondary insurance handling and subscriber info
  // 70% chance the patient is the subscriber, 30% chance someone else is (spouse, parent, etc.)
  const isPatientSubscriber = faker.datatype.boolean(0.7);
  const insurance = generateInsuranceInfo(includeSecondaryInsurance, isPatientSubscriber ? {
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender.charAt(0).toUpperCase(),
    address: patient.address,
    phone: patient.contact.phone
  } : undefined);
  
  // Generate provider information
  const provider = generateProviderInfo();
  
  // Generate medical history
  const medicalHistory = generateMedicalHistory(complexity);
  
  // Generate medications correlated with chronic conditions
  const medications = generateMedications(complexity, medicalHistory.chronicConditions);
  
  // Generate lab results correlated with chronic conditions
  const labResults = generateLabResults(numberOfLabTests, medicalHistory.chronicConditions);
  
  // Generate visit notes correlated with chronic conditions
  const visitNotes = generateVisitNotes(numberOfVisits, medicalHistory.chronicConditions);
  
  // Generate vital signs correlated with chronic conditions
  const vitalSigns = generateVitalSigns(2, medicalHistory.chronicConditions);

  return {
    patient,
    insurance,
    provider,
    medicalHistory,
    medications,
    labResults,
    vitalSigns,
    visitNotes,
    generatedAt: new Date().toISOString(),
    metadata: {
      complexity,
      numberOfVisits,
      numberOfLabTests,
      dataVersion: '2.0'
    }
  };
};

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
