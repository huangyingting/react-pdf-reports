import { faker } from '@faker-js/faker';
import { 
  PatientDemographics, 
  InsuranceInfo, 
  INSURANCE_COMPANIES,
  INSURANCE_PLAN_TYPES,
  COPAY_AMOUNTS,
  DEDUCTIBLE_AMOUNTS,
  BasicData,
  InsurancePolicyData
} from './types';


export const generateInsurancePolicyData = (data?: BasicData): InsurancePolicyData => {
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
    insurance: data?.patient?.insurance || {
      provider: fallbackInsuranceProvider,
      policyNumber: fallbackPolicyNumber,
      groupNumber: fallbackGroupNumber,
      effectiveDate: fallbackEffectiveDate.toLocaleDateString('en-US'),
      memberId: fallbackPolicyNumber,
      copay: faker.helpers.arrayElement(COPAY_AMOUNTS),
      deductible: faker.helpers.arrayElement(DEDUCTIBLE_AMOUNTS)
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
  
  const insurance: InsuranceInfo = {
    primaryInsurance: {
      provider: data?.patient?.insurance?.provider || fallbackInsuranceProvider,
      policyNumber: data?.patient?.insurance?.policyNumber || fallbackPolicyNumber,
      groupNumber: data?.patient?.insurance?.groupNumber || fallbackGroupNumber,
      memberId: data?.patient?.insurance?.memberId || data?.patient?.insurance?.policyNumber || fallbackPolicyNumber,
      effectiveDate: data?.patient?.insurance?.effectiveDate || fallbackEffectiveDate.toLocaleDateString('en-US'),
      copay: data?.patient?.insurance?.copay || faker.helpers.arrayElement(COPAY_AMOUNTS),
      deductible: data?.patient?.insurance?.deductible || faker.helpers.arrayElement(DEDUCTIBLE_AMOUNTS)
    },
    secondaryInsurance: null,
    subscriberName: data?.patient?.name || `${fallbackLastName}, ${fallbackFirstName} ${fallbackMiddleInitial}`,
    subscriberDOB: data?.patient?.dateOfBirth || fallbackDOB.toLocaleDateString('en-US'),
    subscriberGender: data?.patient?.gender?.charAt(0).toUpperCase() || fallbackGender.charAt(0).toUpperCase(),
    type: faker.helpers.arrayElement(INSURANCE_PLAN_TYPES),
    picaCode: faker.datatype.boolean(0.3) ? faker.string.alphanumeric({ length: 2, casing: 'upper' }) : '',
    phone: data?.patient?.contact?.phone || faker.phone.number(),
    address: data?.patient?.address || {
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