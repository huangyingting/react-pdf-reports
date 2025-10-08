import { faker } from '@faker-js/faker';
import { 
  PatientDemographics, 
  Provider,
  VisitNote,
  VitalSigns,
  BasicData,
  VisitReportData,
  MEDICAL_SPECIALTIES,
  FACILITY_NAMES,
  INSURANCE_COMPANIES,
  COPAY_AMOUNTS,
  DEDUCTIBLE_AMOUNTS
} from './types';

export const VISIT_TYPES: string[] = [
  'Annual Physical Exam', 'Follow-up Visit', 'Sick Visit', 'Preventive Care',
  'Chronic Disease Management', 'Medication Review', 'Consultation',
  'Emergency Visit', 'Urgent Care', 'Specialist Referral'
];


export const generateVisitReportData = (data?: BasicData, numberOfVisits: number = 1): VisitReportData[] => {
  const visitReports: VisitReportData[] = [];
  
  for (let i = 0; i < numberOfVisits; i++) {
    visitReports.push(generateSingleVisitReport(data, i));
  }
  
  return visitReports;
};

const generateSingleVisitReport = (data?: BasicData, visitIndex: number = 0): VisitReportData => {
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

  // Generate visit note
  const visitTypes = ['Office Visit', 'Follow-up Visit', 'Annual Physical', 'Sick Visit', 'Consultation', 'Initial Visit'];
  const visitType = faker.helpers.arrayElement(visitTypes);
  
  const chiefComplaints = [
    'Annual wellness exam',
    'Follow-up for hypertension',
    'Chest pain',
    'Shortness of breath',
    'Abdominal pain',
    'Headache',
    'Back pain',
    'Fatigue',
    'Cough and cold symptoms',
    'Joint pain',
    'Diabetes management',
    'Medication refill',
    'Skin rash',
    'Fever'
  ];
  
  const assessments = [
    ['Hypertension, controlled', 'Type 2 Diabetes Mellitus, stable'],
    ['Acute upper respiratory infection'],
    ['Chest pain, rule out cardiac origin', 'Hypertension, uncontrolled'],
    ['Gastroesophageal reflux disease (GERD)'],
    ['Migraine headache without aura'],
    ['Acute low back pain'],
    ['Generalized anxiety disorder'],
    ['Hyperlipidemia'],
    ['Osteoarthritis, right knee'],
    ['Allergic rhinitis'],
    ['Acute bronchitis'],
    ['Essential hypertension', 'Hyperlipidemia', 'Obesity']
  ];
  
  const plans = [
    ['Continue current medications', 'Follow-up in 3 months', 'Labs ordered: CBC, CMP, HbA1c'],
    ['Prescribed Amoxicillin 500mg TID x 7 days', 'Rest and fluids', 'Return if symptoms worsen'],
    ['ECG performed - normal sinus rhythm', 'Cardiac enzymes ordered', 'Chest X-ray ordered', 'Follow-up in 48 hours or sooner if symptoms worsen'],
    ['Prescribed Omeprazole 20mg daily', 'Dietary modifications advised', 'Follow-up in 4 weeks'],
    ['Prescribed Sumatriptan 50mg PRN', 'Headache diary recommended', 'Follow-up in 2 months'],
    ['Physical therapy referral', 'NSAIDs as needed', 'Core strengthening exercises', 'Follow-up in 6 weeks'],
    ['Continue current SSRIs', 'Referral to counseling services', 'Follow-up in 4 weeks'],
    ['Start Atorvastatin 20mg daily', 'Diet and exercise counseling', 'Lipid panel in 3 months'],
    ['Referral to orthopedics', 'NSAIDs for pain', 'Weight loss counseling', 'Follow-up in 4 weeks'],
    ['Prescribed Fluticasone nasal spray', 'Avoid known allergens', 'Follow-up PRN'],
    ['Prescribed Benzonatate 200mg TID PRN', 'Cough suppressant', 'Increase fluid intake', 'Follow-up if no improvement in 1 week'],
    ['Increase Lisinopril to 20mg daily', 'Continue Metformin', 'Weight management plan', 'Follow-up in 2 months with labs']
  ];
  
  // Generate visit date based on index - spread visits over the past year
  const daysAgo = 30 + (visitIndex * 60); // Space visits ~60 days apart, starting from 30 days ago
  const visitDate = faker.date.recent({ days: Math.min(daysAgo, 365) });
  const selectedAssessment = faker.helpers.arrayElement(assessments);
  const selectedPlan = faker.helpers.arrayElement(plans);
  
  const visit: VisitNote = {
    date: visitDate.toLocaleDateString('en-US'),
    type: visitType,
    chiefComplaint: faker.helpers.arrayElement(chiefComplaints),
    assessment: selectedAssessment,
    plan: selectedPlan,
    provider: providerName,
    duration: `${faker.number.int({ min: 15, max: 60 })} minutes`,
    vitals: {
      bloodPressure: `${faker.number.int({ min: 110, max: 145 })}/${faker.number.int({ min: 70, max: 95 })}`,
      heartRate: faker.number.int({ min: 60, max: 100 }),
      temperature: parseFloat(faker.number.float({ min: 97.0, max: 99.5, fractionDigits: 1 }).toFixed(1)),
      weight: faker.number.int({ min: 120, max: 250 }),
      height: `${faker.number.int({ min: 60, max: 75 })}"`,
      oxygenSaturation: faker.number.int({ min: 95, max: 100 })
    }
  };

  // Generate vital signs with full details
  const vitalSigns: VitalSigns = {
    date: visit.date,
    time: faker.date.recent({ days: 1 }).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    bloodPressure: visit.vitals.bloodPressure,
    heartRate: visit.vitals.heartRate.toString(),
    temperature: `${visit.vitals.temperature}°F`,
    weight: `${visit.vitals.weight} lbs`,
    height: visit.vitals.height,
    bmi: calculateBMI(visit.vitals.weight, visit.vitals.height),
    oxygenSaturation: `${visit.vitals.oxygenSaturation}%`,
    respiratoryRate: `${faker.number.int({ min: 12, max: 20 })} breaths/min`
  };

  return {
    patient,
    provider,
    visit,
    vitalSigns
  };
};

// Helper function to calculate BMI
function calculateBMI(weight: number, height: string): string {
  const heightInInches = parseInt(height);
  const bmi = (weight / (heightInInches * heightInInches)) * 703;
  return bmi.toFixed(1);
}
