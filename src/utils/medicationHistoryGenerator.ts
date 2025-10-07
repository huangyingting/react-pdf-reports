import { faker } from '@faker-js/faker';
import { 
  PatientDemographics, 
  Provider,
  Medications,
  CurrentMedication,
  DiscontinuedMedication,
  Allergy,
  MedicalRecord,
  MedicationHistoryData,
  MEDICAL_SPECIALTIES,
  FACILITY_NAMES,
  INSURANCE_COMPANIES,
  COPAY_AMOUNTS,
  DEDUCTIBLE_AMOUNTS
} from './types';

export const generateMedicationHistoryData = (patientData?: MedicalRecord): MedicationHistoryData => {
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
    id: patientData?.patient?.id || fallbackPatientId,
    name: patientData?.patient?.name || `${fallbackLastName}, ${fallbackFirstName} ${fallbackMiddleInitial}`,
    firstName: patientData?.patient?.firstName || fallbackFirstName,
    lastName: patientData?.patient?.lastName || fallbackLastName,
    middleInitial: patientData?.patient?.middleInitial || fallbackMiddleInitial,
    dateOfBirth: patientData?.patient?.dateOfBirth || fallbackDOB.toLocaleDateString('en-US'),
    age: patientData?.patient?.age || fallbackAge,
    gender: patientData?.patient?.gender || (fallbackGender.charAt(0).toUpperCase() + fallbackGender.slice(1)),
    address: {
      street: patientData?.patient?.address?.street || faker.location.streetAddress(),
      city: patientData?.patient?.address?.city || faker.location.city(),
      state: patientData?.patient?.address?.state || faker.location.state({ abbreviated: true }),
      zipCode: patientData?.patient?.address?.zipCode || faker.location.zipCode('#####'),
      country: patientData?.patient?.address?.country || 'USA'
    },
    contact: {
      phone: patientData?.patient?.contact?.phone || faker.phone.number(),
      email: patientData?.patient?.contact?.email || faker.internet.email({ firstName: fallbackFirstName.toLowerCase(), lastName: fallbackLastName.toLowerCase() }),
      emergencyContact: patientData?.patient?.contact?.emergencyContact || `${faker.person.fullName()} (${faker.helpers.arrayElement(['Spouse', 'Child', 'Parent', 'Sibling', 'Friend'])}) - ${faker.phone.number()}`
    },
    insurance: patientData?.patient?.insurance || {
      provider: fallbackInsuranceProvider,
      policyNumber: fallbackPolicyNumber,
      groupNumber: fallbackGroupNumber,
      effectiveDate: fallbackEffectiveDate.toLocaleDateString('en-US'),
      memberId: fallbackPolicyNumber,
      copay: faker.helpers.arrayElement(COPAY_AMOUNTS),
      deductible: faker.helpers.arrayElement(DEDUCTIBLE_AMOUNTS)
    },
    medicalRecordNumber: patientData?.patient?.medicalRecordNumber || fallbackMRN,
    ssn: patientData?.patient?.ssn || faker.helpers.replaceSymbols('###-##-####'),
    accountNumber: patientData?.patient?.accountNumber || patientData?.patient?.id || fallbackPatientId,
    pharmacy: patientData?.patient?.pharmacy || {
      name: faker.company.name() + ' Pharmacy',
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state({ abbreviated: true })} ${faker.location.zipCode('#####')}`,
      phone: faker.phone.number()
    }
  };

  // Generate provider information
  const providerName = `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`;
  const specialty = faker.helpers.arrayElement(MEDICAL_SPECIALTIES);
  const facilityName = faker.helpers.arrayElement(FACILITY_NAMES);
  
  const provider: Provider = patientData?.provider || {
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

  // Generate medications
  const medicationTemplates = [
    { name: 'Lisinopril', strengths: ['5mg', '10mg', '20mg', '40mg'], purpose: 'Hypertension', type: 'tablet' },
    { name: 'Metformin', strengths: ['500mg', '850mg', '1000mg'], purpose: 'Type 2 Diabetes', type: 'tablet' },
    { name: 'Atorvastatin', strengths: ['10mg', '20mg', '40mg', '80mg'], purpose: 'Hyperlipidemia', type: 'tablet' },
    { name: 'Levothyroxine', strengths: ['25mcg', '50mcg', '75mcg', '100mcg'], purpose: 'Hypothyroidism', type: 'tablet' },
    { name: 'Amlodipine', strengths: ['2.5mg', '5mg', '10mg'], purpose: 'Hypertension', type: 'tablet' },
    { name: 'Omeprazole', strengths: ['20mg', '40mg'], purpose: 'GERD/Acid Reflux', type: 'capsule' },
    { name: 'Metoprolol', strengths: ['25mg', '50mg', '100mg'], purpose: 'Hypertension/Heart Disease', type: 'tablet' },
    { name: 'Gabapentin', strengths: ['100mg', '300mg', '400mg'], purpose: 'Neuropathic Pain', type: 'capsule' },
    { name: 'Sertraline', strengths: ['25mg', '50mg', '100mg'], purpose: 'Depression/Anxiety', type: 'tablet' },
    { name: 'Albuterol', strengths: ['90mcg'], purpose: 'Asthma/COPD', type: 'inhaler' },
    { name: 'Aspirin', strengths: ['81mg'], purpose: 'Cardiovascular Prevention', type: 'tablet' },
    { name: 'Losartan', strengths: ['25mg', '50mg', '100mg'], purpose: 'Hypertension', type: 'tablet' },
    { name: 'Furosemide', strengths: ['20mg', '40mg', '80mg'], purpose: 'Edema/Heart Failure', type: 'tablet' },
    { name: 'Warfarin', strengths: ['1mg', '2mg', '5mg'], purpose: 'Anticoagulation', type: 'tablet' },
    { name: 'Insulin Glargine', strengths: ['100 units/mL'], purpose: 'Diabetes', type: 'injection' }
  ];

  const generateCurrentMedications = (): CurrentMedication[] => {
    if (patientData?.medications?.current && patientData.medications.current.length > 0) {
      return patientData.medications.current;
    }
    
    const numMedications = faker.number.int({ min: 3, max: 8 });
    const selectedMeds = faker.helpers.arrayElements(medicationTemplates, numMedications);
    
    return selectedMeds.map(med => {
      const strength = faker.helpers.arrayElement(med.strengths);
      let dosage = '';
      
      if (med.type === 'inhaler') {
        dosage = 'Two puffs every 4-6 hours as needed';
      } else if (med.type === 'injection') {
        dosage = `${faker.number.int({ min: 10, max: 40 })} units subcutaneously once daily at bedtime`;
      } else {
        const frequency = faker.helpers.arrayElement(['once daily', 'twice daily', 'three times daily', 'every 12 hours']);
        const timing = faker.helpers.arrayElement(['with food', 'on empty stomach', 'at bedtime', 'in the morning', 'as needed']);
        dosage = `Take one ${med.type} ${frequency} ${timing}`;
      }
      
      return {
        name: med.name,
        strength: strength,
        dosage: dosage,
        purpose: med.purpose,
        prescribedBy: providerName,
        startDate: faker.date.past({ years: 2 }).toLocaleDateString('en-US'),
        instructions: dosage
      };
    });
  };

  const generateDiscontinuedMedications = (): DiscontinuedMedication[] => {
    if (patientData?.medications?.discontinued && patientData.medications.discontinued.length > 0) {
      return patientData.medications.discontinued;
    }
    
    const numDiscontinued = faker.number.int({ min: 1, max: 4 });
    const selectedMeds = faker.helpers.arrayElements(medicationTemplates, numDiscontinued);
    
    const discontinueReasons = [
      'Switched to alternative medication',
      'Side effects (nausea, dizziness)',
      'Ineffective for condition',
      'Allergic reaction',
      'No longer needed',
      'Drug interaction concern',
      'Patient request',
      'Condition resolved',
      'Cost concerns'
    ];
    
    return selectedMeds.map(med => ({
      name: med.name,
      strength: faker.helpers.arrayElement(med.strengths),
      reason: faker.helpers.arrayElement(discontinueReasons),
      discontinuedDate: faker.date.past({ years: 1 }).toLocaleDateString('en-US'),
      prescribedBy: providerName
    }));
  };

  const medications: Medications = {
    current: generateCurrentMedications(),
    discontinued: generateDiscontinuedMedications()
  };

  // Generate allergies
  const generateAllergies = (): Allergy[] => {
    if (patientData?.medicalHistory?.allergies && patientData.medicalHistory.allergies.length > 0) {
      return patientData.medicalHistory.allergies;
    }
    
    const allergenTemplates = [
      { allergen: 'Penicillin', reaction: 'Rash, hives', severity: 'Moderate' },
      { allergen: 'Sulfa drugs', reaction: 'Stevens-Johnson syndrome', severity: 'Severe' },
      { allergen: 'Aspirin', reaction: 'Gastrointestinal bleeding', severity: 'Severe' },
      { allergen: 'Latex', reaction: 'Contact dermatitis, itching', severity: 'Mild' },
      { allergen: 'Iodine contrast', reaction: 'Anaphylaxis', severity: 'Severe' },
      { allergen: 'Codeine', reaction: 'Nausea, vomiting', severity: 'Moderate' },
      { allergen: 'Shellfish', reaction: 'Anaphylaxis, breathing difficulty', severity: 'Severe' },
      { allergen: 'Pollen', reaction: 'Rhinitis, sneezing', severity: 'Mild' },
      { allergen: 'Dust mites', reaction: 'Asthma exacerbation', severity: 'Moderate' },
      { allergen: 'NSAIDs', reaction: 'Stomach upset, ulcers', severity: 'Moderate' }
    ];
    
    const hasAllergies = faker.datatype.boolean(0.7);
    if (!hasAllergies) {
      return [{
        allergen: 'No Known Drug Allergies (NKDA)',
        reaction: 'None',
        severity: 'N/A',
        dateIdentified: 'N/A'
      }];
    }
    
    const numAllergies = faker.number.int({ min: 1, max: 3 });
    const selectedAllergies = faker.helpers.arrayElements(allergenTemplates, numAllergies);
    
    return selectedAllergies.map(allergy => ({
      ...allergy,
      dateIdentified: faker.date.past({ years: 5 }).toLocaleDateString('en-US')
    }));
  };

  const allergies = generateAllergies();

  return {
    patient,
    provider,
    medications,
    allergies
  };
};
