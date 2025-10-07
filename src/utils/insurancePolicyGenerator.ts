import { faker } from '@faker-js/faker';
import { 
  PatientDemographics, 
  InsuranceInfo, 
  INSURANCE_COMPANIES,
  INSURANCE_PLAN_TYPES,
  COPAY_AMOUNTS,
  DEDUCTIBLE_AMOUNTS,
  MedicalRecord,
  InsurancePolicyData
} from './types';


export const generateInsurancePolicyData = (patientData?: MedicalRecord): InsurancePolicyData => {
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
  
  const insurance: InsuranceInfo = {
    primaryInsurance: {
      provider: patientData?.patient?.insurance?.provider || fallbackInsuranceProvider,
      policyNumber: patientData?.patient?.insurance?.policyNumber || fallbackPolicyNumber,
      groupNumber: patientData?.patient?.insurance?.groupNumber || fallbackGroupNumber,
      memberId: patientData?.patient?.insurance?.memberId || patientData?.patient?.insurance?.policyNumber || fallbackPolicyNumber,
      effectiveDate: patientData?.patient?.insurance?.effectiveDate || fallbackEffectiveDate.toLocaleDateString('en-US'),
      copay: patientData?.patient?.insurance?.copay || faker.helpers.arrayElement(COPAY_AMOUNTS),
      deductible: patientData?.patient?.insurance?.deductible || faker.helpers.arrayElement(DEDUCTIBLE_AMOUNTS)
    },
    secondaryInsurance: null,
    subscriberName: patientData?.patient?.name || `${fallbackLastName}, ${fallbackFirstName} ${fallbackMiddleInitial}`,
    subscriberDOB: patientData?.patient?.dateOfBirth || fallbackDOB.toLocaleDateString('en-US'),
    subscriberGender: patientData?.patient?.gender?.charAt(0).toUpperCase() || fallbackGender.charAt(0).toUpperCase(),
    type: faker.helpers.arrayElement(INSURANCE_PLAN_TYPES),
    picaCode: faker.datatype.boolean(0.3) ? faker.string.alphanumeric({ length: 2, casing: 'upper' }) : '',
    phone: patientData?.patient?.contact?.phone || faker.phone.number(),
    address: patientData?.patient?.address || {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
      country: 'USA'
    }
  };
  
  return {
    patient,
    insurance
  };
}