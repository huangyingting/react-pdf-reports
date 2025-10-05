import { faker } from '@faker-js/faker';

/**
 * Medical Records Data Generator using Faker.js
 * Generates realistic medical data for educational and testing purposes
 */

// Medical-specific data arrays
const MEDICAL_CONDITIONS = [
  'Hypertension', 'Diabetes Type 2', 'Hyperlipidemia', 'Asthma', 'COPD',
  'Arthritis', 'Depression', 'Anxiety', 'Migraine', 'GERD',
  'Thyroid Disease', 'Osteoporosis', 'Allergic Rhinitis', 'Sleep Apnea',
  'Atrial Fibrillation', 'Chronic Kidney Disease', 'Heart Disease'
];

const MEDICATIONS = [
  'Lisinopril 10mg', 'Metformin 500mg', 'Atorvastatin 20mg', 'Albuterol inhaler',
  'Levothyroxine 50mcg', 'Omeprazole 20mg', 'Sertraline 50mg', 'Ibuprofen 400mg',
  'Acetaminophen 500mg', 'Vitamin D3 1000IU', 'Multivitamin', 'Aspirin 81mg',
  'Prednisone 10mg', 'Losartan 50mg', 'Amlodipine 5mg', 'Gabapentin 300mg'
];

const VISIT_TYPES = [
  'Annual Physical Exam', 'Follow-up Visit', 'Sick Visit', 'Preventive Care',
  'Chronic Disease Management', 'Medication Review', 'Consultation',
  'Emergency Visit', 'Urgent Care', 'Specialist Referral'
];

const INSURANCE_COMPANIES = [
  'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare',
  'Humana', 'Kaiser Permanente', 'Medicare', 'Medicaid',
  'Anthem', 'Independence Blue Cross', 'HealthPartners', 'Molina Healthcare'
];

/**
 * Generate patient demographics
 */
export const generatePatientDemographics = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const dateOfBirth = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  
  return {
    id: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
    name: `${lastName}, ${firstName}`,
    firstName,
    lastName,
    dateOfBirth: dateOfBirth.toLocaleDateString('en-US'),
    age: new Date().getFullYear() - dateOfBirth.getFullYear(),
    gender: faker.person.sexType(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      country: 'USA'
    },
    contact: {
      phone: faker.phone.number('(###) ###-####'),
      email: faker.internet.email({ firstName, lastName }),
      emergencyContact: `${faker.person.fullName()} (${faker.helpers.arrayElement(['Spouse', 'Child', 'Parent', 'Sibling', 'Friend'])}) - ${faker.phone.number('(###) ###-####')}`
    },
    insurance: {
      provider: faker.helpers.arrayElement(INSURANCE_COMPANIES),
      policyNumber: faker.string.alphanumeric({ length: 12, casing: 'upper' }),
      groupNumber: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
      effectiveDate: faker.date.past({ years: 2 }).toLocaleDateString('en-US')
    },
    medicalRecordNumber: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
    ssn: faker.helpers.replaceSymbols('###-##-####')
  };
};

/**
 * Generate insurance information
 */
export const generateInsuranceInfo = () => {
  return {
    primaryInsurance: {
      company: faker.helpers.arrayElement(INSURANCE_COMPANIES),
      policyNumber: faker.string.alphanumeric({ length: 12, casing: 'upper' }),
      groupNumber: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
      memberNumber: faker.string.alphanumeric({ length: 10, casing: 'upper' }),
      effectiveDate: faker.date.past({ years: 2 }).toLocaleDateString('en-US'),
      copay: faker.helpers.arrayElement(['$20', '$30', '$40', '$50']),
      deductible: faker.helpers.arrayElement(['$500', '$1000', '$2500', '$5000'])
    },
    secondaryInsurance: faker.datatype.boolean(0.3) ? {
      company: faker.helpers.arrayElement(INSURANCE_COMPANIES),
      policyNumber: faker.string.alphanumeric({ length: 12, casing: 'upper' }),
      memberNumber: faker.string.alphanumeric({ length: 10, casing: 'upper' })
    } : null
  };
};

/**
 * Generate provider information
 */
export const generateProviderInfo = () => {
  return {
    primaryCare: {
      name: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      npi: faker.string.numeric(10),
      specialty: 'Family Medicine',
      phone: faker.phone.number('(###) ###-####'),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode()
      }
    },
    facility: {
      name: faker.helpers.arrayElement([
        'City Medical Center', 'Regional Health Clinic', 'Community Health Associates',
        'Primary Care Partners', 'Family Health Center', 'Medical Arts Building'
      ]),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode()
      },
      phone: faker.phone.number('(###) ###-####'),
      fax: faker.phone.number('(###) ###-####')
    }
  };
};

/**
 * Generate medical history
 */
export const generateMedicalHistory = (complexity = 'medium') => {
  const conditionCount = complexity === 'low' ? 2 : complexity === 'high' ? 6 : 4;
  const conditions = faker.helpers.arrayElements(MEDICAL_CONDITIONS, conditionCount);
  
  // Generate allergies as objects with required properties
  const allergyNames = ['Penicillin', 'Sulfa drugs', 'Latex', 'Shellfish', 'Nuts', 'Pollen'];
  const allergyCount = faker.datatype.boolean(0.6) ? faker.number.int({ min: 1, max: 3 }) : 0;
  const allergies = allergyCount > 0 ? 
    faker.helpers.arrayElements(allergyNames, allergyCount).map(allergen => ({
      allergen,
      reaction: faker.helpers.arrayElement([
        'Severe rash and difficulty breathing',
        'Hives and swelling',
        'Mild skin irritation',
        'Nausea and vomiting',
        'Respiratory distress',
        'Anaphylactic reaction'
      ]),
      severity: faker.helpers.arrayElement(['High', 'Moderate', 'Low']),
      dateIdentified: faker.date.past({ years: 10 }).toLocaleDateString('en-US')
    })) : [{
      allergen: 'No known allergies',
      reaction: 'None',
      severity: 'None',
      dateIdentified: 'N/A'
    }];

  // Generate surgical history as objects
  const surgicalCount = faker.datatype.boolean(0.4) ? faker.number.int({ min: 1, max: 3 }) : 0;
  const surgicalHistory = surgicalCount > 0 ?
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
  const familyHistory = [
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
 * Generate medications list
 */
export const generateMedications = (complexity = 'medium') => {
  const currentMedCount = complexity === 'low' ? 3 : complexity === 'high' ? 8 : 5;
  const discontinuedMedCount = complexity === 'low' ? 1 : complexity === 'high' ? 4 : 2;
  
  const currentMeds = faker.helpers.arrayElements(MEDICATIONS, currentMedCount);
  const discontinuedMeds = faker.helpers.arrayElements(MEDICATIONS, discontinuedMedCount);
  
  const current = currentMeds.map(medication => ({
    name: medication.split(' ')[0], // Extract medication name
    strength: medication.includes('mg') ? medication.split(' ')[1] : 'As directed',
    dosage: faker.helpers.arrayElement(['Daily', 'Twice daily', 'Three times daily', 'As needed', 'Weekly']),
    purpose: faker.helpers.arrayElement([
      'Blood pressure control', 'Diabetes management', 'Pain relief', 'Infection treatment',
      'Cholesterol management', 'Heart health', 'Thyroid regulation', 'Anxiety management',
      'Depression treatment', 'Sleep aid', 'Allergy relief', 'Inflammation control'
    ]),
    prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
    startDate: faker.date.past({ years: 2 }).toLocaleDateString('en-US'),
    instructions: faker.helpers.arrayElement([
      'Take with food', 'Take on empty stomach', 'Take at bedtime',
      'Take as needed for pain', 'Take with plenty of water', 'Follow package directions',
      'Do not crush or chew', 'May cause drowsiness', 'Avoid alcohol'
    ])
  }));

  const discontinued = discontinuedMeds.map(medication => ({
    name: medication.split(' ')[0],
    strength: medication.includes('mg') ? medication.split(' ')[1] : 'As directed',
    reason: faker.helpers.arrayElement([
      'Adverse reaction', 'No longer needed', 'Replaced with better option',
      'Patient request', 'Side effects', 'Cost concerns', 'Drug interaction',
      'Ineffective', 'Allergic reaction', 'Treatment completed'
    ]),
    discontinuedDate: faker.date.past({ years: 1 }).toLocaleDateString('en-US'),
    prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`
  }));

  return {
    current,
    discontinued
  };
};

/**
 * Generate vital signs history
 */
export const generateVitalSigns = (numberOfReadings = 2) => {
  return Array.from({ length: numberOfReadings }, (_, index) => {
    const date = faker.date.recent({ days: 30 * (index + 1) });
    const weight = faker.number.int({ min: 120, max: 220 });
    const heightInInches = faker.number.int({ min: 60, max: 76 });
    const heightFeet = Math.floor(heightInInches / 12);
    const heightInches = heightInInches % 12;
    const bmi = ((weight / (heightInInches * heightInInches)) * 703).toFixed(1);
    
    return {
      date: date.toLocaleDateString('en-US'),
      time: faker.helpers.arrayElement(['9:00 AM', '10:30 AM', '2:15 PM', '3:45 PM', '11:15 AM']),
      bloodPressure: `${faker.number.int({ min: 110, max: 140 })}/${faker.number.int({ min: 70, max: 90 })}`,
      heartRate: faker.number.int({ min: 60, max: 100 }).toString(),
      temperature: faker.number.float({ min: 97.0, max: 99.5, fractionDigits: 1 }).toString(),
      weight: weight.toString(),
      height: `${heightFeet}'${heightInches}"`,
      bmi: bmi,
      oxygenSaturation: `${faker.number.int({ min: 95, max: 100 })}%`,
      respiratoryRate: faker.number.int({ min: 12, max: 20 }).toString()
    };
  });
};

/**
 * Generate lab results
 */
export const generateLabResults = (numberOfTests = 3) => {
  const testTypes = [
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
    const results = testType.parameters.map(param => {
      const isNormal = faker.datatype.boolean(0.8); // 80% chance of normal values
      let value;
      let status;
      
      if (isNormal) {
        value = faker.number.float({
          min: param.normalRange[0],
          max: param.normalRange[1],
          fractionDigits: param.unit.includes('%') ? 1 : (param.parameter === 'Creatinine' ? 1 : 0)
        });
        status = 'Normal';
      } else {
        // Generate slightly abnormal values
        const isHigh = faker.datatype.boolean();
        if (isHigh) {
          value = faker.number.float({
            min: param.normalRange[1],
            max: param.normalRange[1] * 1.3,
            fractionDigits: param.unit.includes('%') ? 1 : (param.parameter === 'Creatinine' ? 1 : 0)
          });
          status = param.parameter === 'Glucose' && value > 125 ? 'High' : (value > param.normalRange[1] * 1.2 ? 'High' : 'Borderline');
        } else {
          value = faker.number.float({
            min: param.normalRange[0] * 0.7,
            max: param.normalRange[0],
            fractionDigits: param.unit.includes('%') ? 1 : (param.parameter === 'Creatinine' ? 1 : 0)
          });
          status = 'Low';
        }
      }
      
      return {
        parameter: param.parameter,
        value: value.toString(),
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
 * Get reference ranges for lab tests
 */
/**
 * Generate visit notes
 */
export const generateVisitNotes = (numberOfVisits = 3) => {
  return Array.from({ length: numberOfVisits }, (_, index) => {
    const visitDate = faker.date.recent({ days: 30 * (index + 1) });
    const visitType = faker.helpers.arrayElement(VISIT_TYPES);
    
    return {
      date: visitDate.toLocaleDateString('en-US'),
      type: visitType,
      chiefComplaint: generateChiefComplaint(),
      assessment: generateAssessment(),
      plan: generateTreatmentPlan(),
      provider: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      duration: faker.helpers.arrayElement(['15 min', '20 min', '30 min', '45 min']),
      vitals: {
        bloodPressure: `${faker.number.int({ min: 110, max: 140 })}/${faker.number.int({ min: 70, max: 90 })}`,
        heartRate: faker.number.int({ min: 60, max: 100 }),
        temperature: faker.number.float({ min: 97.0, max: 99.5, fractionDigits: 1 }),
        weight: faker.number.int({ min: 120, max: 220 }),
        height: `${faker.number.int({ min: 60, max: 76 })}"`,
        oxygenSaturation: faker.number.int({ min: 95, max: 100 })
      }
    };
  });
};

/**
 * Generate chief complaint
 */
const generateChiefComplaint = () => {
  const complaints = [
    'Annual physical examination',
    'Follow-up for hypertension',
    'Medication refill',
    'Cold symptoms',
    'Back pain',
    'Fatigue',
    'Headache',
    'Chest pain evaluation',
    'Shortness of breath',
    'Abdominal pain',
    'Routine check-up',
    'Lab result review'
  ];
  
  return faker.helpers.arrayElement(complaints);
};

/**
 * Generate assessment
 */
const generateAssessment = () => {
  const assessments = [
    'Patient appears well. Vital signs stable.',
    'Chronic conditions well controlled.',
    'Continue current medications.',
    'Mild upper respiratory infection.',
    'Blood pressure elevated, medication adjustment needed.',
    'Lab results within normal limits.',
    'Patient reports good adherence to medications.',
    'No acute distress noted.',
    'Stable chronic disease management.',
    'Preventive care up to date.',
    'Patient denies chest pain or shortness of breath.',
    'Weight stable since last visit.',
    'Medication compliance excellent.',
    'No new concerns today.',
    'Follow-up labs pending.'
  ];
  
  // Return 2-4 assessment items
  const count = faker.number.int({ min: 2, max: 4 });
  return faker.helpers.arrayElements(assessments, count);
};

/**
 * Generate treatment plan
 */
const generateTreatmentPlan = () => {
  const plans = [
    'Continue current medications, return in 6 months.',
    'Increase blood pressure medication, recheck in 4 weeks.',
    'Order lab work, follow up with results.',
    'Symptomatic treatment, return if symptoms worsen.',
    'Refer to specialist for further evaluation.',
    'Schedule mammogram/colonoscopy.',
    'Dietary counseling recommended.',
    'Physical therapy referral.',
    'Monitor symptoms, return PRN.',
    'Medication adjustment, follow up in 3 months.',
    'Patient education provided.',
    'Return to emergency department if symptoms worsen.',
    'Schedule follow-up appointment.',
    'Lifestyle modifications discussed.',
    'Review medications at next visit.'
  ];
  
  // Return 2-4 plan items
  const count = faker.number.int({ min: 2, max: 4 });
  return faker.helpers.arrayElements(plans, count);
};

/**
 * Generate complete medical records data
 */
export const generateCompleteMedicalRecord = (options = {}) => {
  const {
    complexity = 'medium',
    numberOfVisits = 3,
    numberOfLabTests = 3,
    includeSecondaryInsurance = true
  } = options;

  const patient = generatePatientDemographics();
  const insurance = generateInsuranceInfo();
  const provider = generateProviderInfo();
  const medicalHistory = generateMedicalHistory(complexity);
  const medications = generateMedications(complexity);
  const labResults = generateLabResults(numberOfLabTests);
  const visitNotes = generateVisitNotes(numberOfVisits);
  const vitalSigns = generateVitalSigns(2);

  return {
    patient,
    insurance: includeSecondaryInsurance ? insurance : { ...insurance, secondaryInsurance: null },
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
      dataVersion: '1.0'
    }
  };
};

/**
 * Data generation presets
 */
export const DATA_GENERATION_PRESETS = {
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