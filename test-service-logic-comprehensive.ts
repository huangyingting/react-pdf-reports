/**
 * Comprehensive Service Generation Logic Test
 * Tests dates, place of service, emergency flags, and diagnosis correlation
 */

import { generateCMS1500Data } from './src/utils/cms1500Data';

console.log('Comprehensive Service Generation Logic Test\n');
console.log('============================================================\n');

let allTestsPassed = true;

// Test 100 forms to ensure logic is consistent
const testCases = 100;
let emergencyServiceCount = 0;
let officeVisitCount = 0;
let procedureCount = 0;

const placeOfServiceViolations: string[] = [];
const dateViolations: string[] = [];
const pointerViolations: string[] = [];

console.log(`Testing ${testCases} generated forms...\n`);

for (let i = 0; i < testCases; i++) {
  const data = generateCMS1500Data();
  
  // Convert date strings to Date objects for comparison
  const illnessDate = new Date(data.claim.dateOfIllness);
  const serviceDate = new Date(data.claim.serviceDate);
  const providerSigDate = new Date(data.claim.providerSignatureDate);
  const patientSigDate = new Date(data.claim.signatureDate);
  
  // Test 1: Date Logic - Service date should be on or after illness date
  if (serviceDate < illnessDate) {
    dateViolations.push(`Case ${i + 1}: Service date (${data.claim.serviceDate}) before illness date (${data.claim.dateOfIllness})`);
  }
  
  // Test 2: Provider signature should be on or after service date
  if (providerSigDate < serviceDate) {
    dateViolations.push(`Case ${i + 1}: Provider signature (${data.claim.providerSignatureDate}) before service date (${data.claim.serviceDate})`);
  }
  
  // Test 3: Patient signature should be on or after provider signature
  if (patientSigDate < providerSigDate) {
    dateViolations.push(`Case ${i + 1}: Patient signature (${data.claim.signatureDate}) before provider signature (${data.claim.providerSignatureDate})`);
  }
  
  data.claim.serviceLines.forEach((service, idx) => {
    // Test 4: Place of Service correctness
    if (service.procedureCode === '99285' && service.placeOfService !== '23') {
      placeOfServiceViolations.push(`Case ${i + 1}, Service ${idx + 1}: Emergency visit (99285) not in ER (POS ${service.placeOfService})`);
    }
    
    if (['99213', '99214', '99215'].includes(service.procedureCode) && service.placeOfService !== '11') {
      placeOfServiceViolations.push(`Case ${i + 1}, Service ${idx + 1}: Office visit (${service.procedureCode}) not in office (POS ${service.placeOfService})`);
    }
    
    if (service.procedureCode === '45378' && !['22', '24'].includes(service.placeOfService)) {
      placeOfServiceViolations.push(`Case ${i + 1}, Service ${idx + 1}: Colonoscopy should be in hospital/ASC (POS ${service.placeOfService})`);
    }
    
    // Test 5: Diagnosis pointers are valid
    const pointers = service.diagnosisPointer.split(',').map(p => p.trim());
    const validPointers = ['A', 'B', 'C', 'D'].slice(0, data.claim.diagnosisCodes.length);
    pointers.forEach(pointer => {
      if (!validPointers.includes(pointer)) {
        pointerViolations.push(`Case ${i + 1}, Service ${idx + 1}: Invalid pointer ${pointer} (only ${validPointers.join(', ')} are valid)`);
      }
    });
    
    // Test 6: Service dates match claim service date
    if (service.dateFrom !== data.claim.serviceDate || service.dateTo !== data.claim.serviceDate) {
      dateViolations.push(`Case ${i + 1}, Service ${idx + 1}: Service line dates don't match claim service date`);
    }
    
    // Count service types
    if (service.procedureCode === '99285') emergencyServiceCount++;
    if (['99213', '99214', '99215'].includes(service.procedureCode)) officeVisitCount++;
    procedureCount++;
  });
}

console.log('📊 Test Results:\n');
console.log(`Total forms tested: ${testCases}`);
console.log(`Total services generated: ${procedureCount}`);
console.log(`  - Emergency visits (99285): ${emergencyServiceCount}`);
console.log(`  - Office visits (99213-99215): ${officeVisitCount}`);
console.log(`  - Other procedures: ${procedureCount - emergencyServiceCount - officeVisitCount}\n`);

console.log('🔍 Validation Results:\n');

// Report violations
if (dateViolations.length === 0) {
  console.log('✅ Date Logic: All dates are in correct chronological order');
} else {
  console.log(`❌ Date Logic: ${dateViolations.length} violations found:`);
  dateViolations.slice(0, 5).forEach(v => console.log(`   - ${v}`));
  if (dateViolations.length > 5) {
    console.log(`   ... and ${dateViolations.length - 5} more`);
  }
  allTestsPassed = false;
}

if (placeOfServiceViolations.length === 0) {
  console.log('✅ Place of Service: All procedures have appropriate POS codes');
} else {
  console.log(`❌ Place of Service: ${placeOfServiceViolations.length} violations found:`);
  placeOfServiceViolations.slice(0, 5).forEach(v => console.log(`   - ${v}`));
  if (placeOfServiceViolations.length > 5) {
    console.log(`   ... and ${placeOfServiceViolations.length - 5} more`);
  }
  allTestsPassed = false;
}

if (pointerViolations.length === 0) {
  console.log('✅ Diagnosis Pointers: All pointers reference valid diagnoses');
} else {
  console.log(`❌ Diagnosis Pointers: ${pointerViolations.length} violations found:`);
  pointerViolations.slice(0, 5).forEach(v => console.log(`   - ${v}`));
  if (pointerViolations.length > 5) {
    console.log(`   ... and ${pointerViolations.length - 5} more`);
  }
  allTestsPassed = false;
}

console.log('\n💡 Sample Diagnosis-to-Service Mappings:\n');

// Show some examples
const exampleData = generateCMS1500Data();
console.log('Example Claim:');
console.log(`Patient: ${exampleData.patient.name}`);
console.log(`\nDiagnosis Codes:`);
exampleData.claim.diagnosisCodes.forEach((code, idx) => {
  console.log(`  ${['A', 'B', 'C', 'D'][idx]}. ${code}`);
});

console.log(`\nService Lines:`);
exampleData.claim.serviceLines.forEach((service, idx) => {
  const relatedDiagnoses = service.diagnosisPointer.split(',').map(p => {
    const index = ['A', 'B', 'C', 'D'].indexOf(p.trim());
    return exampleData.claim.diagnosisCodes[index];
  }).filter(Boolean);
  
  console.log(`  ${idx + 1}. CPT ${service.procedureCode} (POS ${service.placeOfService})`);
  console.log(`     Diagnosis: ${relatedDiagnoses.join(', ')}`);
  console.log(`     Date: ${service.dateFrom}`);
  console.log(`     Charges: $${service.charges}`);
});

console.log('\n' + '='.repeat(60));
if (allTestsPassed) {
  console.log('✅ All comprehensive tests PASSED!');
} else {
  console.log('❌ Some tests FAILED - see details above');
}
console.log('='.repeat(60));
