import { faker } from '@faker-js/faker';
import { 
  PatientDemographics, 
  Provider,
  BasicData,
  MedicalHistoryData,
  MedicalHistory,
  ChronicCondition,
  Allergy,
  SurgicalHistory,
  FamilyHistory,
  CurrentMedication,
  DiscontinuedMedication,
  Medications,
  MEDICAL_SPECIALTIES,
  FACILITY_NAMES,
  INSURANCE_COMPANIES,
  COPAY_AMOUNTS,
  DEDUCTIBLE_AMOUNTS
} from './types';


// Medical-specific data arrays
export const MEDICAL_CONDITIONS: string[] = [
  'Hypertension', 'Diabetes Type 2', 'Hyperlipidemia', 'Asthma', 'COPD',
  'Arthritis', 'Depression', 'Anxiety', 'Migraine', 'GERD',
  'Thyroid Disease', 'Osteoporosis', 'Allergic Rhinitis', 'Sleep Apnea',
  'Atrial Fibrillation', 'Chronic Kidney Disease', 'Heart Disease'
];

export const MEDICATIONS: string[] = [
  'Lisinopril 10mg', 'Metformin 500mg', 'Atorvastatin 20mg', 'Albuterol inhaler',
  'Levothyroxine 50mcg', 'Omeprazole 20mg', 'Sertraline 50mg', 'Ibuprofen 400mg',
  'Acetaminophen 500mg', 'Vitamin D3 1000IU', 'Multivitamin', 'Aspirin 81mg',
  'Prednisone 10mg', 'Losartan 50mg', 'Amlodipine 5mg', 'Gabapentin 300mg'
];


/**
 * Generate medical history including allergies, chronic conditions, surgical and family history
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
  const generalMeds = [
    {name: 'Vitamin D3', strength: '1000IU', purpose: 'Bone health', dosage: 'Daily'},
    {name: 'Multivitamin', strength: 'As directed', purpose: 'General health', dosage: 'Daily'},
    {name: 'Aspirin', strength: '81mg', purpose: 'Heart health', dosage: 'Daily'},
    {name: 'Acetaminophen', strength: '500mg', purpose: 'Pain relief', dosage: 'As needed'},
    {name: 'Calcium', strength: '600mg', purpose: 'Bone health', dosage: 'Twice daily'},
    {name: 'Fish Oil', strength: '1000mg', purpose: 'Heart health', dosage: 'Daily'},
    {name: 'Probiotic', strength: 'As directed', purpose: 'Digestive health', dosage: 'Daily'},
    {name: 'Vitamin B12', strength: '1000mcg', purpose: 'Energy and nerve health', dosage: 'Daily'},
    {name: 'Magnesium', strength: '400mg', purpose: 'Muscle and nerve function', dosage: 'Daily'},
    {name: 'Zinc', strength: '50mg', purpose: 'Immune support', dosage: 'Daily'}
  ];
  
  // Safety counter to prevent infinite loops
  let attempts = 0;
  const maxAttempts = generalMeds.length * 2;
  
  while (currentMedications.length < currentMedCount && attempts < maxAttempts) {
    attempts++;
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

export const generateMedicalHistoryData = (data?: BasicData, complexity: 'low' | 'medium' | 'high' = 'medium'): MedicalHistoryData => {
  // Generate fallback values using Faker.js
  const fallbackFirstName = faker.person.firstName();
  const fallbackLastName = faker.person.lastName();
  const fallbackMiddleInitial = faker.string.alpha({ length: 1, casing: 'upper' });
  const fallbackDOB = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  const fallbackGender = faker.person.sex();
  const fallbackPatientId = `PAT-${faker.string.numeric(6)}`;
  const fallbackMRN = `MRN-${faker.string.numeric(8)}`;
  const fallbackInsuranceProvider = faker.helpers.arrayElement(INSURANCE_COMPANIES);
  const fallbackPolicyNumber = faker.string.alphanumeric({ length: 12, casing: 'upper' });
  const fallbackGroupNumber = `GRP-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`;
  const fallbackEffectiveDate = faker.date.past({ years: 2 });
  
  // Calculate fallback age
  const today = new Date();
  let fallbackAge = today.getFullYear() - fallbackDOB.getFullYear();
  const monthDiff = today.getMonth() - fallbackDOB.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fallbackDOB.getDate())) {
    fallbackAge--;
  }
  
  const patient: PatientDemographics = {
    id: data?.patient?.id || fallbackPatientId,
    name: data?.patient?.name || `${fallbackLastName}, ${fallbackFirstName} ${fallbackMiddleInitial}`,
    firstName: data?.patient?.firstName || fallbackFirstName,
    lastName: data?.patient?.lastName || fallbackLastName,
    middleInitial: data?.patient?.middleInitial || fallbackMiddleInitial,
    dateOfBirth: data?.patient?.dateOfBirth || fallbackDOB.toLocaleDateString('en-US'),
    age: data?.patient?.age || fallbackAge,
    gender: data?.patient?.gender || (fallbackGender.charAt(0).toUpperCase() + fallbackGender.slice(1)),
    address: {
      street: data?.patient?.address?.street || faker.location.streetAddress(),
      city: data?.patient?.address?.city || faker.location.city(),
      state: data?.patient?.address?.state || faker.location.state({ abbreviated: true }),
      zipCode: data?.patient?.address?.zipCode || faker.location.zipCode('#####'),
      country: data?.patient?.address?.country || 'USA'
    },
    contact: {
      phone: data?.patient?.contact?.phone || faker.phone.number(),
      email: data?.patient?.contact?.email || faker.internet.email({ firstName: fallbackFirstName.toLowerCase(), lastName: fallbackLastName.toLowerCase() }),
      emergencyContact: data?.patient?.contact?.emergencyContact || `${faker.person.fullName()} (${faker.helpers.arrayElement(['Spouse', 'Child', 'Parent', 'Sibling', 'Friend'])}) - ${faker.phone.number()}`
    },
    medicalRecordNumber: data?.patient?.medicalRecordNumber || fallbackMRN,
    ssn: data?.patient?.ssn || faker.helpers.replaceSymbols('###-##-####'),
    accountNumber: data?.patient?.accountNumber || data?.patient?.id || fallbackPatientId,
    pharmacy: data?.patient?.pharmacy || {
      name: faker.company.name() + ' Pharmacy',
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state({ abbreviated: true })} ${faker.location.zipCode('#####')}`,
      phone: faker.phone.number()
    }
  };

  // Generate provider information
  const providerName = `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`;
  const specialty = faker.helpers.arrayElement(MEDICAL_SPECIALTIES);
  const facilityName = faker.helpers.arrayElement(FACILITY_NAMES);
  
  const provider: Provider = data?.provider || {
    name: providerName,
    npi: faker.string.numeric(10),
    specialty: specialty,
    phone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
      country: 'USA'
    },
    taxId: faker.helpers.replaceSymbols('##-#######'),
    taxIdType: 'EIN',
    facilityName: facilityName,
    facilityNPI: faker.string.numeric(10),
    facilityPhone: faker.phone.number(),
    facilityFax: faker.phone.number()
  };

  // Generate medical history and medications using imported functions from medicalRecordsGenerator
  const medicalHistory = generateMedicalHistory(complexity);
  const medications = generateMedications(complexity, medicalHistory.chronicConditions);

  return {
    patient,
    provider,
    medications,
    allergies: medicalHistory.allergies,
    chronicConditions: medicalHistory.chronicConditions,
    surgicalHistory: medicalHistory.surgicalHistory,
    familyHistory: medicalHistory.familyHistory
  };
};
