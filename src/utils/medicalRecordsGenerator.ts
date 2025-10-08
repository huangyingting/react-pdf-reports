/**
 * Medical Records Generator
 * Contains all medical-specific data generation logic
 */

import { faker } from '@faker-js/faker';
import {
  MedicalHistory,
  Medications,
  VitalSigns,
  GenerationOptions,
  MedicalRecord,
  ChronicCondition,
  Allergy,
  SurgicalHistory,
  FamilyHistory,
  CurrentMedication,
  DiscontinuedMedication,
} from './types';
import { generatePatientDemographics, generateInsuranceInfo, generateProviderInfo } from './baseDataGenerator';

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

export const VISIT_TYPES: string[] = [
  'Annual Physical Exam', 'Follow-up Visit', 'Sick Visit', 'Preventive Care',
  'Chronic Disease Management', 'Medication Review', 'Consultation',
  'Emergency Visit', 'Urgent Care', 'Specialist Referral'
];

export const INSURANCE_COMPANIES: string[] = [
  'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare',
  'Humana', 'Kaiser Permanente', 'Medicare', 'Medicaid',
  'Anthem', 'Independence Blue Cross', 'HealthPartners', 'Molina Healthcare'
];

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
  

  return {
    patient,
    insurance,
    provider,
    medicalHistory,
    medications,
    generatedAt: new Date().toISOString(),
    metadata: {
      complexity,
      numberOfVisits,
      numberOfLabTests,
      dataVersion: '2.0'
    }
  };
};

