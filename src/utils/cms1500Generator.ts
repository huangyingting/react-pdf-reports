/**
 * Generate sample CMS-1500 claim form data
 * This creates realistic claim data for testing and demonstration
 */

import { faker } from '@faker-js/faker';
import {
  BasicData,
  CMS1500Data
} from './types';


export const generateCMS1500Data = (data?: BasicData): CMS1500Data => {
  // Generate fallback values using Faker.js
  const fallbackFirstName = faker.person.firstName();
  const fallbackLastName = faker.person.lastName();
  const fallbackMiddleInitial = faker.string.alpha({ length: 1, casing: 'upper' });
  const fallbackDOB = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  const fallbackGender = faker.person.sex();
  const fallbackPatientId = `PAT-${faker.string.numeric(6)}`;
  const fallbackMRN = `MRN-${faker.string.numeric(8)}`;
  const fallbackPolicyNumber = faker.string.alphanumeric({ length: 12, casing: 'upper' });
  
  const result: CMS1500Data = {
    patient: {
      id: data?.patient?.id || fallbackPatientId,
      name: data?.patient?.name || `${fallbackLastName.toUpperCase()}, ${fallbackFirstName.toUpperCase()} ${fallbackMiddleInitial}`,
      lastName: data?.patient?.lastName || fallbackLastName.toUpperCase(),
      firstName: data?.patient?.firstName || fallbackFirstName.toUpperCase(),
      middleInitial: data?.patient?.middleInitial || fallbackMiddleInitial,
      dateOfBirth: data?.patient?.dateOfBirth || fallbackDOB.toLocaleDateString('en-US'),
      age: data?.patient?.age || new Date().getFullYear() - fallbackDOB.getFullYear(),
      gender: data?.patient?.gender || fallbackGender.charAt(0).toUpperCase(),
      address: {
        street: data?.patient?.address?.street || faker.location.streetAddress().toUpperCase(),
        city: data?.patient?.address?.city || faker.location.city().toUpperCase(),
        state: data?.patient?.address?.state || faker.location.state({ abbreviated: true }),
        zipCode: data?.patient?.address?.zipCode || faker.location.zipCode('#####'),
        country: data?.patient?.address?.country || 'USA',
      },
      contact: {
        phone: data?.patient?.contact?.phone || faker.phone.number(),
        email: data?.patient?.contact?.email || faker.internet.email({ firstName: fallbackFirstName.toLowerCase(), lastName: fallbackLastName.toLowerCase() }),
        emergencyContact: data?.patient?.contact?.emergencyContact || `${faker.person.fullName()} (${faker.helpers.arrayElement(['Spouse', 'Child', 'Parent', 'Sibling'])}) - ${faker.phone.number()}`,
      },
      insurance: data?.patient?.insurance || {
        provider: faker.helpers.arrayElement(['BLUE CROSS BLUE SHIELD', 'AETNA', 'CIGNA', 'UNITEDHEALTH', 'HUMANA']),
        policyNumber: fallbackPolicyNumber,
        groupNumber: `GRP-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`,
        effectiveDate: faker.date.past({ years: 2 }).toLocaleDateString('en-US'),
        memberId: fallbackPolicyNumber,
        copay: faker.helpers.arrayElement(['$20', '$30', '$40', '$50']),
        deductible: faker.helpers.arrayElement(['$500', '$1000', '$2500', '$5000'])
      },
      pharmacy: data?.patient?.pharmacy || {
        name: `${faker.location.city()} ${faker.helpers.arrayElement(['CVS Pharmacy', 'Walgreens', 'Rite Aid'])}`,
        address: faker.location.streetAddress(),
        phone: faker.phone.number()
      },
      medicalRecordNumber: data?.patient?.medicalRecordNumber || fallbackMRN,
      ssn: data?.patient?.ssn || faker.helpers.replaceSymbols('###-##-####'),
      accountNumber: data?.patient?.accountNumber || data?.patient?.id || fallbackPatientId,
    },

    insurance: {
      type: data?.insurance?.type || faker.helpers.arrayElement(['group', 'individual', 'medicare', 'medicaid']),
      picaCode: data?.insurance?.picaCode || (faker.datatype.boolean(0.3) ? faker.string.alphanumeric({ length: 2, casing: 'upper' }) : ''),
      primaryInsurance: {
        provider: data?.insurance?.primaryInsurance?.provider || faker.helpers.arrayElement(['BLUE CROSS BLUE SHIELD', 'AETNA', 'CIGNA', 'UNITEDHEALTH', 'HUMANA']),
        policyNumber: data?.insurance?.primaryInsurance?.policyNumber || faker.string.alphanumeric({ length: 12, casing: 'upper' }),
        groupNumber: data?.insurance?.primaryInsurance?.groupNumber || `GRP-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`,
        memberId: data?.insurance?.primaryInsurance?.memberId || faker.string.alphanumeric({ length: 12, casing: 'upper' }),
        effectiveDate: data?.insurance?.primaryInsurance?.effectiveDate || faker.date.past({ years: 2 }).toLocaleDateString('en-US'),
        copay: data?.insurance?.primaryInsurance?.copay || faker.helpers.arrayElement(['$20', '$30', '$40', '$50']),
        deductible: data?.insurance?.primaryInsurance?.deductible || faker.helpers.arrayElement(['$500', '$1000', '$2500', '$5000']),
      },
      secondaryInsurance: data?.insurance?.secondaryInsurance ? {
        provider: data.insurance.secondaryInsurance.provider,
        policyNumber: data.insurance.secondaryInsurance.policyNumber,
        groupNumber: data.insurance.secondaryInsurance.groupNumber || '',
        memberId: data.insurance.secondaryInsurance.memberId,
        effectiveDate: data.insurance.secondaryInsurance.effectiveDate,
        copay: data.insurance.secondaryInsurance.copay,
        deductible: data.insurance.secondaryInsurance.deductible
      } : null,
      subscriberName: data?.insurance?.subscriberName || data?.patient?.name || `${fallbackLastName.toUpperCase()}, ${fallbackFirstName.toUpperCase()} ${fallbackMiddleInitial}`,
      subscriberDOB: data?.insurance?.subscriberDOB || data?.patient?.dateOfBirth || fallbackDOB.toLocaleDateString('en-US'),
      subscriberGender: data?.insurance?.subscriberGender || data?.patient?.gender || fallbackGender.charAt(0).toUpperCase(),
      address: data?.insurance?.address || {
        street: faker.location.streetAddress().toUpperCase(),
        city: faker.location.city().toUpperCase(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode('#####'),
      },
      phone: data?.insurance?.phone || faker.phone.number(),
      secondaryInsured: data?.insurance?.secondaryInsured || {
        name: '',
        policyNumber: '',
        planName: '',
      },
    },

    provider: {
      name: data?.provider?.name || `Dr. ${faker.person.firstName()} ${faker.person.lastName()}, MD`,
      npi: data?.provider?.npi || faker.string.numeric(10),
      specialty: data?.provider?.specialty || faker.helpers.arrayElement(['Family Medicine', 'Internal Medicine', 'General Practice', 'Pediatrics']),
      phone: data?.provider?.phone || faker.phone.number(),
      address: data?.provider?.address || {
        street: faker.location.streetAddress().toUpperCase(),
        city: faker.location.city().toUpperCase(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode('#####')
      },
      signature: data?.provider?.signature || `Dr. ${faker.person.firstName()} ${faker.person.lastName()}, MD`,
      taxId: data?.provider?.taxId || faker.helpers.replaceSymbols('##-#######'),
      taxIdType: 'EIN' as const,
      facilityName: data?.provider?.facilityName || faker.helpers.arrayElement(['MEDICAL CENTER', 'HEALTH CLINIC', 'HEALTHCARE ASSOCIATES', 'MEDICAL GROUP']).toUpperCase(),
      facilityAddress: data?.provider?.facilityAddress || {
        street: faker.location.streetAddress().toUpperCase(),
        city: faker.location.city().toUpperCase(),
        state: faker.location.state({ abbreviated: true }),
        zipCode: faker.location.zipCode('#####')
      },
      facilityNPI: data?.provider?.facilityNPI || faker.string.numeric(10),
      billingName: data?.provider?.billingName || faker.helpers.arrayElement(['MEDICAL CENTER', 'HEALTH CLINIC', 'HEALTHCARE ASSOCIATES', 'MEDICAL GROUP']).toUpperCase(),
      billingAddress: data?.provider?.billingAddress || `${faker.location.streetAddress().toUpperCase()}, ${faker.location.city().toUpperCase()}, ${faker.location.state({ abbreviated: true })} ${faker.location.zipCode('#####')}`,
      billingPhone: data?.provider?.billingPhone || faker.phone.number(),
      billingNPI: data?.provider?.billingNPI || faker.string.numeric(10),
      referringProvider: data?.provider?.referringProvider || (faker.datatype.boolean(0.3) ? {
        name: `DR. ${faker.person.firstName().toUpperCase()} ${faker.person.lastName().toUpperCase()}`,
        npi: faker.string.numeric(10),
      } : undefined),
    },

    claim: (() => {
      // Generate dates in logical chronological order
      // 1. Date of illness (earliest, 15-45 days ago)
      const dateOfIllness = faker.date.recent({ days: faker.number.int({ min: 15, max: 45 }) });
      
      // 2. Hospitalization dates (if applicable, 5-15 days after illness)
      const hasHospitalization = faker.datatype.boolean(0.1);
      let hospitalizationFrom: Date | null = null;
      let hospitalizationTo: Date | null = null;
      if (hasHospitalization) {
        hospitalizationFrom = faker.date.between({ 
          from: new Date(dateOfIllness.getTime() + 5 * 24 * 60 * 60 * 1000), 
          to: new Date(dateOfIllness.getTime() + 15 * 24 * 60 * 60 * 1000) 
        });
        hospitalizationTo = faker.date.between({ 
          from: hospitalizationFrom, 
          to: new Date(hospitalizationFrom.getTime() + 7 * 24 * 60 * 60 * 1000) 
        });
      }
      
      // 3. Unable to work dates (if applicable, overlaps with illness/hospitalization)
      const hasUnableToWork = faker.datatype.boolean(0.1);
      let unableToWorkFrom: Date | null = null;
      let unableToWorkTo: Date | null = null;
      if (hasUnableToWork) {
        unableToWorkFrom = faker.date.between({ 
          from: dateOfIllness, 
          to: new Date(dateOfIllness.getTime() + 10 * 24 * 60 * 60 * 1000) 
        });
        unableToWorkTo = faker.date.between({ 
          from: unableToWorkFrom, 
          to: new Date(unableToWorkFrom.getTime() + 14 * 24 * 60 * 60 * 1000) 
        });
      }
      
      // 4. Service date (after illness, 7-30 days ago)
      const serviceDate = faker.date.recent({ 
        days: faker.number.int({ min: 7, max: 30 }) 
      });
      
      // Ensure service date is after illness date
      const adjustedServiceDate = serviceDate < dateOfIllness 
        ? new Date(dateOfIllness.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000)
        : serviceDate;
      
      // 5. Provider signature date (same as or shortly after service date)
      const providerSignatureDate = faker.date.between({ 
        from: adjustedServiceDate, 
        to: new Date(adjustedServiceDate.getTime() + 3 * 24 * 60 * 60 * 1000) 
      });
      
      // 6. Patient signature date (same as or after provider signature)
      const signatureDate = faker.date.between({ 
        from: providerSignatureDate, 
        to: new Date(providerSignatureDate.getTime() + 2 * 24 * 60 * 60 * 1000) 
      });
      
      // Other date (if applicable)
      const hasOtherDate = faker.datatype.boolean(0.2);
      const otherDate = hasOtherDate ? faker.date.between({ 
        from: dateOfIllness, 
        to: adjustedServiceDate 
      }) : null;
      
      return {
        patientRelationship: (() => {
          // Determine if patient is the subscriber
          const subscriberName = data?.insurance?.subscriberName || 
            data?.patient?.name || 
            `${fallbackLastName.toUpperCase()}, ${fallbackFirstName.toUpperCase()} ${fallbackMiddleInitial}`;
          const patientName = data?.patient?.name || 
            `${fallbackLastName.toUpperCase()}, ${fallbackFirstName.toUpperCase()} ${fallbackMiddleInitial}`;
          
          // If names match, patient is self; otherwise randomly select relationship
          return subscriberName === patientName 
            ? 'self' as const
            : faker.helpers.arrayElement(['spouse', 'child', 'other'] as const);
        })(),
        signatureDate: signatureDate.toLocaleDateString('en-US'),
        providerSignatureDate: providerSignatureDate.toLocaleDateString('en-US'),
        dateOfIllness: dateOfIllness.toLocaleDateString('en-US'),
        serviceDate: adjustedServiceDate.toLocaleDateString('en-US'),  // Add service date for use in service lines
        illnessQualifier: faker.helpers.arrayElement(['431', '484', '439']),
        otherDate: otherDate ? otherDate.toLocaleDateString('en-US') : '',
        otherDateQualifier: otherDate ? faker.helpers.arrayElement(['454', '304', '453']) : '',
        unableToWorkFrom: unableToWorkFrom ? unableToWorkFrom.toLocaleDateString('en-US') : '',
        unableToWorkTo: unableToWorkTo ? unableToWorkTo.toLocaleDateString('en-US') : '',
        hospitalizationFrom: hospitalizationFrom ? hospitalizationFrom.toLocaleDateString('en-US') : '',
        hospitalizationTo: hospitalizationTo ? hospitalizationTo.toLocaleDateString('en-US') : '',
        additionalInfo: '',
        outsideLab: faker.datatype.boolean(0.2),
        outsideLabCharges: faker.datatype.boolean(0.2) ? `${faker.number.int({ min: 50, max: 300 })}.00` : '',
        
        // Diagnosis codes (ICD-10)
        diagnosisCodes: faker.helpers.arrayElements([
          // Common chronic conditions
          'I10',      // Essential hypertension
          'E11.9',    // Type 2 diabetes mellitus without complications
          'E11.65',   // Type 2 diabetes with hyperglycemia
          'E78.5',    // Hyperlipidemia, unspecified
          'E78.0',    // Pure hypercholesterolemia
          'Z00.00',   // General adult medical examination without abnormal findings
          'J44.9',    // COPD, unspecified
          'J44.1',    // COPD with acute exacerbation
          'M19.90',   // Osteoarthritis, unspecified site
          'M79.3',    // Panniculitis, unspecified
          'F41.9',    // Anxiety disorder, unspecified
          'F32.9',    // Major depressive disorder, single episode, unspecified
          'K21.9',    // GERD without esophagitis
          'G43.909',  // Migraine, unspecified, not intractable, without status migrainosus
          'M54.5',    // Low back pain
          'J45.909',  // Asthma, unspecified, uncomplicated
          'N18.3',    // Chronic kidney disease, stage 3
          'E66.9',    // Obesity, unspecified
          'K58.9',    // Irritable bowel syndrome without diarrhea
          'R51',      // Headache
          
          // Critical diseases - Cardiovascular
          'I21.3',    // ST elevation myocardial infarction (STEMI)
          'I21.4',    // Non-ST elevation myocardial infarction (NSTEMI)
          'I50.9',    // Heart failure, unspecified
          'I50.23',   // Acute on chronic systolic heart failure
          'I63.9',    // Cerebral infarction (stroke), unspecified
          'I64',      // Stroke, not specified as hemorrhage or infarction
          'I48.91',   // Atrial fibrillation, unspecified
          'I71.4',    // Abdominal aortic aneurysm, without rupture
          
          // Critical diseases - Cancer
          'C50.919',  // Malignant neoplasm of breast, unspecified
          'C34.90',   // Malignant neoplasm of lung, unspecified
          'C18.9',    // Malignant neoplasm of colon, unspecified
          'C61',      // Malignant neoplasm of prostate
          'C25.9',    // Malignant neoplasm of pancreas, unspecified
          'C79.51',   // Secondary malignant neoplasm of bone
          'C91.10',   // Chronic lymphocytic leukemia, not having achieved remission
          
          // Critical diseases - Respiratory
          'J18.9',    // Pneumonia, unspecified organism
          'J96.00',   // Acute respiratory failure, unspecified
          'J80',      // Acute respiratory distress syndrome (ARDS)
          'J81.0',    // Acute pulmonary edema
          
          // Critical diseases - Neurological
          'G40.909',  // Epilepsy, unspecified, not intractable, without status epilepticus
          'G20',      // Parkinson's disease
          'G30.9',    // Alzheimer's disease, unspecified
          'G35',      // Multiple sclerosis
          
          // Critical diseases - Renal
          'N17.9',    // Acute kidney failure, unspecified
          'N18.6',    // End stage renal disease
          
          // Critical diseases - Infectious
          'A41.9',    // Sepsis, unspecified organism
          'B20',      // HIV disease
          'U07.1',    // COVID-19
          
          // Critical diseases - Other
          'E10.65',   // Type 1 diabetes with hyperglycemia
          'K72.90',   // Hepatic failure, unspecified without coma
          'D61.9',    // Aplastic anemia, unspecified
        ], faker.number.int({ min: 2, max: 4 })),
        
        resubmissionCode: '',
        originalRefNo: '',
        priorAuthNumber: faker.datatype.boolean(0.1) ? faker.string.alphanumeric({ length: 10, casing: 'upper' }) : '',
        
        // Placeholder values - will be set after service lines are generated
        serviceLines: [],
        hasOtherHealthPlan: false,
        otherClaimId: '',
        acceptAssignment: true,
        totalCharges: '0.00',
        amountPaid: '0.00',
      };
    })(),
  };
  
  // Now generate service lines using the actual diagnosis codes from the claim
  result.claim.serviceLines = (() => {
          const serviceProviderNPI = data?.provider?.npi || faker.string.numeric(10);
          const numServices = faker.number.int({ min: 1, max: 4 });
          
          // Map diagnosis codes to appropriate CPT codes
          const diagnosisBasedServices: Record<string, Array<{ code: string, chargeRange: [number, number], description: string }>> = {
            // Cardiovascular
            'I10': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '93000', chargeRange: [40, 60], description: 'ECG' },
              { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
            ],
            'I21.3': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '93000', chargeRange: [40, 60], description: 'ECG' },
              { code: '82550', chargeRange: [30, 50], description: 'CK-MB' },
              { code: '85025', chargeRange: [30, 50], description: 'CBC' },
            ],
            'I21.4': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '93000', chargeRange: [40, 60], description: 'ECG' },
              { code: '82550', chargeRange: [30, 50], description: 'CK-MB' },
            ],
            'I50.9': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '93000', chargeRange: [40, 60], description: 'ECG' },
              { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
              { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
            ],
            'I50.23': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '93000', chargeRange: [40, 60], description: 'ECG' },
              { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
            ],
            'I48.91': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '93000', chargeRange: [40, 60], description: 'ECG' },
              { code: '85025', chargeRange: [30, 50], description: 'CBC' },
            ],
            
            // Diabetes
            'E11.9': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '83036', chargeRange: [25, 40], description: 'Hemoglobin A1C' },
              { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
              { code: '80061', chargeRange: [50, 75], description: 'Lipid panel' },
            ],
            'E11.65': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '83036', chargeRange: [25, 40], description: 'Hemoglobin A1C' },
              { code: '82947', chargeRange: [15, 25], description: 'Glucose' },
            ],
            'E10.65': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '83036', chargeRange: [25, 40], description: 'Hemoglobin A1C' },
              { code: '82947', chargeRange: [15, 25], description: 'Glucose' },
            ],
            
            // Respiratory
            'J44.9': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '94060', chargeRange: [50, 80], description: 'Spirometry' },
              { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
            ],
            'J44.1': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '94640', chargeRange: [30, 50], description: 'Nebulizer therapy' },
              { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
            ],
            'J45.909': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '94060', chargeRange: [50, 80], description: 'Spirometry' },
            ],
            'J18.9': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
              { code: '85025', chargeRange: [30, 50], description: 'CBC' },
            ],
            'J96.00': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '94762', chargeRange: [40, 70], description: 'Pulse oximetry' },
              { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
            ],
            'J80': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
              { code: '85025', chargeRange: [30, 50], description: 'CBC' },
            ],
            
            // Cancer
            'C50.919': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '77065', chargeRange: [100, 150], description: 'Mammography screening' },
              { code: '19083', chargeRange: [200, 350], description: 'Breast biopsy' },
            ],
            'C34.90': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '71260', chargeRange: [300, 500], description: 'CT chest' },
              { code: '85025', chargeRange: [30, 50], description: 'CBC' },
            ],
            'C18.9': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '45378', chargeRange: [500, 800], description: 'Colonoscopy' },
              { code: '82274', chargeRange: [30, 50], description: 'Blood occult' },
            ],
            'C61': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '84153', chargeRange: [40, 60], description: 'PSA' },
              { code: '55700', chargeRange: [300, 500], description: 'Prostate biopsy' },
            ],
            
            // Musculoskeletal
            'M19.90': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '73560', chargeRange: [80, 120], description: 'Knee x-ray' },
              { code: '20610', chargeRange: [100, 150], description: 'Joint injection' },
            ],
            'M54.5': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '72100', chargeRange: [80, 120], description: 'Spine x-ray' },
              { code: '97110', chargeRange: [60, 90], description: 'Physical therapy' },
            ],
            
            // Mental health
            'F41.9': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '90834', chargeRange: [100, 150], description: 'Psychotherapy 45 min' },
            ],
            'F32.9': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '90834', chargeRange: [100, 150], description: 'Psychotherapy 45 min' },
            ],
            
            // Renal
            'N17.9': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
              { code: '85025', chargeRange: [30, 50], description: 'CBC' },
            ],
            'N18.3': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
            ],
            'N18.6': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '90935', chargeRange: [200, 350], description: 'Hemodialysis' },
              { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
            ],
            
            // Infectious
            'A41.9': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '85025', chargeRange: [30, 50], description: 'CBC' },
              { code: '87070', chargeRange: [40, 70], description: 'Blood culture' },
            ],
            'U07.1': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '87635', chargeRange: [50, 100], description: 'COVID-19 test' },
              { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
            ],
            
            // Neurological
            'G40.909': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '95819', chargeRange: [300, 500], description: 'EEG' },
            ],
            'G20': [
              { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
              { code: '95860', chargeRange: [200, 350], description: 'EMG' },
            ],
            'I63.9': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '70450', chargeRange: [400, 700], description: 'CT head' },
            ],
            'I64': [
              { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
              { code: '70450', chargeRange: [400, 700], description: 'CT head' },
            ],
          };
          
          // Default services for codes not specifically mapped
          const defaultServices = [
            { code: '99214', chargeRange: [200, 250] as [number, number], description: 'Office visit level 4' },
            { code: '99213', chargeRange: [150, 180] as [number, number], description: 'Office visit level 3' },
            { code: '80053', chargeRange: [75, 95] as [number, number], description: 'Comprehensive metabolic panel' },
            { code: '85025', chargeRange: [30, 50] as [number, number], description: 'CBC' },
            { code: '36415', chargeRange: [10, 20] as [number, number], description: 'Venipuncture' },
          ];
          
          // Reference the actual diagnosis codes from the claim
          const selectedDiagnoses = result.claim.diagnosisCodes;
          
          // Map procedure codes to their appropriate place of service
          const procedurePlaceOfService: Record<string, string> = {
            // Emergency visits
            '99285': '23',  // Emergency visit level 5 - ER
            
            // Office visits
            '99211': '11',  // Office visit, established patient, level 1
            '99212': '11',  // Office visit, established patient, level 2
            '99213': '11',  // Office visit, established patient, level 3
            '99214': '11',  // Office visit, established patient, level 4
            '99215': '11',  // Office visit, established patient, level 5
            
            // Lab tests (typically done in office or independent lab)
            '80053': '11',  // Comprehensive metabolic panel - Office
            '80061': '11',  // Lipid panel - Office
            '82274': '81',  // Blood occult test - Independent Lab
            '82550': '11',  // CK-MB (cardiac marker) - Office/Hospital
            '82947': '11',  // Glucose - Office
            '83036': '11',  // Hemoglobin A1C - Office
            '84153': '11',  // PSA - Office
            '85025': '11',  // Complete blood count (CBC) - Office
            '87070': '11',  // Blood culture - Office/Hospital
            '87635': '11',  // COVID-19 test - Office
            
            // Imaging (typically outpatient hospital or imaging center)
            '70450': '22',  // CT head - Outpatient Hospital
            '71045': '22',  // Chest x-ray - Outpatient Hospital
            '71260': '22',  // CT chest - Outpatient Hospital
            '72100': '22',  // Spine x-ray - Outpatient Hospital
            '73560': '22',  // Knee x-ray - Outpatient Hospital
            '77065': '22',  // Mammography screening - Outpatient Hospital
            
            // Cardiovascular procedures
            '93000': '11',  // Electrocardiogram (ECG) - Office
            
            // Respiratory procedures
            '94060': '11',  // Spirometry - Office
            '94640': '23',  // Nebulizer therapy - ER (typically for acute exacerbation)
            '94762': '11',  // Pulse oximetry - Office
            
            // Surgical/Invasive procedures
            '19083': '22',  // Breast biopsy - Outpatient Hospital
            '20610': '11',  // Joint injection - Office
            '36415': '11',  // Venipuncture - Office
            '45378': '24',  // Colonoscopy - Ambulatory Surgical Center
            '55700': '22',  // Prostate biopsy - Outpatient Hospital
            
            // Specialized procedures
            '90834': '11',  // Psychotherapy 45 min - Office
            '90935': '11',  // Hemodialysis - Dialysis Center (coded as Office)
            '95819': '22',  // EEG - Outpatient Hospital
            '95860': '22',  // EMG - Outpatient Hospital
            '97110': '11',  // Physical therapy - Office/PT Clinic
          };
          
          // Build available services based on diagnosis codes
          const availableServices: Array<{ code: string, charges: number, pointer: string, primaryDiagnosis: string }> = [];
          const diagnosisPointers = ['A', 'B', 'C', 'D'];
          
          selectedDiagnoses.forEach((diagnosis, index) => {
            const pointer = diagnosisPointers[index] || 'A';
            const serviceList = diagnosisBasedServices[diagnosis] || defaultServices;
            
            // Add 1-2 services for each diagnosis
            const servicesForDiagnosis = faker.helpers.arrayElements(
              serviceList, 
              faker.number.int({ min: 1, max: 2 })
            );
            
            servicesForDiagnosis.forEach(service => {
              // Avoid duplicate procedure codes
              if (!availableServices.find(s => s.code === service.code)) {
                availableServices.push({
                  code: service.code,
                  charges: faker.number.int({ min: service.chargeRange[0], max: service.chargeRange[1] }),
                  pointer: pointer,
                  primaryDiagnosis: diagnosis
                });
              }
            });
          });
          
          // If we have too few services, add some defaults
          if (availableServices.length < 2) {
            defaultServices.forEach(service => {
              if (availableServices.length < 3 && !availableServices.find(s => s.code === service.code)) {
                availableServices.push({
                  code: service.code,
                  charges: faker.number.int({ min: service.chargeRange[0], max: service.chargeRange[1] }),
                  pointer: 'A',
                  primaryDiagnosis: selectedDiagnoses[0]
                });
              }
            });
          }
          
          // Select final services (1-4 max)
          const finalServices = faker.helpers.arrayElements(
            availableServices, 
            Math.min(numServices, availableServices.length)
          );
          
    return finalServices.map(service => {
      // Determine appropriate place of service
      const placeOfService = procedurePlaceOfService[service.code] || 
        (service.code.startsWith('99285') ? '23' : '11');
      
      // Set emergency flag for ER visits
      const isEmergency = placeOfService === '23' || service.code === '99285';
      
      // Build diagnosis pointers - start with primary
      let pointers = [service.pointer];
      
      // For office visits and E/M services, add additional relevant diagnoses
      if (['99213', '99214', '99215', '99285'].includes(service.code)) {
        // E/M visits often address multiple conditions
        // Add up to 2 more diagnoses (randomly, weighted toward 1-2 total)
        const additionalCount = faker.number.int({ min: 0, max: 2 });
        const otherPointers = diagnosisPointers.filter(p => 
          p !== service.pointer && 
          diagnosisPointers.indexOf(p) < selectedDiagnoses.length
        );
        
        if (otherPointers.length > 0 && additionalCount > 0) {
          const additional = faker.helpers.arrayElements(
            otherPointers, 
            Math.min(additionalCount, otherPointers.length)
          );
          pointers = pointers.concat(additional).sort();
        }
      }
      
      // For general lab tests (metabolic panel, CBC), sometimes add related diagnoses
      if (['80053', '85025'].includes(service.code)) {
        if (faker.datatype.boolean(0.3)) { // 30% chance
          const otherPointers = diagnosisPointers.filter(p => 
            p !== service.pointer && 
            diagnosisPointers.indexOf(p) < selectedDiagnoses.length
          );
          if (otherPointers.length > 0) {
            const additional = faker.helpers.arrayElement(otherPointers);
            pointers.push(additional);
            pointers.sort();
          }
        }
      }
      
      return {
        dateFrom: result.claim.serviceDate,
        dateTo: result.claim.serviceDate,
        placeOfService: placeOfService,
        emg: isEmergency && faker.datatype.boolean(0.3) ? 'Y' : '',
        procedureCode: service.code,
        modifier: '',
        diagnosisPointer: pointers.join(','),
        charges: `${service.charges}.00`,
        units: '1',
        epsdt: '',
        idQual: 'NPI',
        renderingProviderNPI: serviceProviderNPI,
      };
    });
  })();
  
  // Set additional claim fields
  result.claim.hasOtherHealthPlan = faker.datatype.boolean(0.2);
  result.claim.otherClaimId = faker.datatype.boolean(0.2) ? faker.string.alphanumeric({ length: 10, casing: 'upper' }) : '';
  result.claim.acceptAssignment = faker.datatype.boolean(0.9);
  result.claim.totalCharges = '0.00'; // Will be calculated below
  result.claim.amountPaid = faker.datatype.boolean(0.3) ? `${faker.number.int({ min: 10, max: 100 })}.00` : '0.00';
  
  // Calculate total charges from service lines
  const totalCharges = result.claim.serviceLines.reduce((sum, line) => {
    return sum + parseFloat(line.charges);
  }, 0);
  result.claim.totalCharges = totalCharges.toFixed(2);
  
  return result;
};

/**
 * Generate multiple CMS-1500 forms if needed
 */
export const generateMultipleCMS1500Forms = (data: BasicData, count: number = 1): CMS1500Data[] => {
  const forms: CMS1500Data[] = [];
  for (let i = 0; i < count; i++) {
    forms.push(generateCMS1500Data(data));
  }
  return forms;
};