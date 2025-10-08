import { faker } from '@faker-js/faker';
import { 
  PatientDemographics, 
  Provider,
  MedicalRecord,
  MedicalHistoryData,
  MEDICAL_SPECIALTIES,
  FACILITY_NAMES,
  INSURANCE_COMPANIES,
  COPAY_AMOUNTS,
  DEDUCTIBLE_AMOUNTS
} from './types';
import { generateMedicalHistory, generateMedications } from './medicalRecordsGenerator';

export const generateMedicalHistoryData = (patientData?: MedicalRecord, complexity: 'low' | 'medium' | 'high' = 'medium'): MedicalHistoryData => {
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
