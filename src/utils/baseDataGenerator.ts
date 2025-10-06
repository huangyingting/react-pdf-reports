/**
 * Basic Data Generator
 * Contains core functions for generating patient, insurance, and provider data
 * For medical records generation, see medicalRecordsGenerator.ts
 */

import { faker } from '@faker-js/faker';
import {
  PatientDemographics,
  InsuranceInfo,
  Provider,
  Address,
  Insurance
} from './types';

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