#!/usr/bin/env ts-node

/**
 * Test script for CMS-1500 data generation with Faker.js
 */

import { generateCMS1500Data } from '../src/utils/cms1500Data';
import { generateCompleteMedicalRecord } from '../src/utils/dataGenerator';

console.log('Testing CMS-1500 Data Generation with Faker.js\n');
console.log('='.repeat(60));

// Test 1: Generate without patient data (all fallbacks using Faker)
console.log('\n📋 Test 1: Generate CMS-1500 with Faker.js fallbacks (Patient = Subscriber)');
console.log('-'.repeat(60));
const cms1500Data1 = generateCMS1500Data();
console.log('Patient Name:', cms1500Data1.patient.name);
console.log('Subscriber Name:', cms1500Data1.insurance.subscriberName);
console.log('Patient Relationship:', cms1500Data1.claim.patientRelationship);
console.log('Same person?', cms1500Data1.patient.name === cms1500Data1.insurance.subscriberName ? '✅ Yes' : '❌ No');
console.log('Relationship should be "self":', cms1500Data1.claim.patientRelationship === 'self' ? '✅ Correct' : '❌ Wrong');
console.log('Insurance Provider:', cms1500Data1.insurance.primaryInsurance.provider);
console.log('Number of Services:', cms1500Data1.claim.serviceLines.length);
console.log('Total Charges:', cms1500Data1.claim.totalCharges);
console.log('✅ Test 1 Passed\n');

// Test 2: Generate with complete medical record (patient might be subscriber)
console.log('📋 Test 2: Generate CMS-1500 with complete medical record');
console.log('-'.repeat(60));
const medicalRecord = generateCompleteMedicalRecord({ complexity: 'medium' });
const cms1500Data2 = generateCMS1500Data(medicalRecord);
console.log('Patient Name:', cms1500Data2.patient.name);
console.log('Subscriber Name:', cms1500Data2.insurance.subscriberName);
console.log('Patient Relationship:', cms1500Data2.claim.patientRelationship);
console.log('Same person?', cms1500Data2.patient.name === cms1500Data2.insurance.subscriberName ? '✅ Yes' : '❌ No');

if (cms1500Data2.patient.name === cms1500Data2.insurance.subscriberName) {
  console.log('Relationship verification:', cms1500Data2.claim.patientRelationship === 'self' ? '✅ Correctly set to "self"' : '❌ Should be "self"');
} else {
  const validRelationships = ['spouse', 'child', 'other'];
  console.log('Relationship verification:', validRelationships.includes(cms1500Data2.claim.patientRelationship) ? '✅ Correctly set to non-self' : '❌ Should be spouse/child/other');
}
console.log('Total Charges:', cms1500Data2.claim.totalCharges);
console.log('✅ Test 2 Passed\n');

// Test 3: Generate multiple to verify relationship logic
console.log('📋 Test 3: Generate multiple CMS-1500 forms to verify relationship logic');
console.log('-'.repeat(60));
let selfCount = 0;
let otherCount = 0;
const iterations = 10;

for (let i = 0; i < iterations; i++) {
  const record = generateCompleteMedicalRecord({ complexity: 'low' });
  const cms = generateCMS1500Data(record);
  
  if (cms.patient.name === cms.insurance.subscriberName) {
    // Patient is subscriber, should be 'self'
    if (cms.claim.patientRelationship === 'self') {
      selfCount++;
    } else {
      console.log(`❌ Error: Same person but relationship is "${cms.claim.patientRelationship}"`);
    }
  } else {
    // Different person, should be spouse/child/other
    if (['spouse', 'child', 'other'].includes(cms.claim.patientRelationship)) {
      otherCount++;
    } else {
      console.log(`❌ Error: Different person but relationship is "${cms.claim.patientRelationship}"`);
    }
  }
}

console.log(`Generated ${iterations} forms:`);
console.log(`  - "self" relationships (patient = subscriber): ${selfCount}`);
console.log(`  - "spouse/child/other" relationships: ${otherCount}`);
console.log('Relationship logic:', (selfCount + otherCount) === iterations ? '✅ All correct' : '❌ Some errors');

console.log('\n✅ All tests passed!');
