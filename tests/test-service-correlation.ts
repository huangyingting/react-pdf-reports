/**
 * Test Service Correlation with Diagnosis Codes
 * This tests that service lines are properly correlated with diagnosis codes
 */

import { generateCMS1500Data } from '../src/utils/cms1500Data';

console.log('Testing Service Line Correlation with Diagnosis Codes\n');
console.log('============================================================\n');

// Generate multiple forms to test correlation
for (let i = 0; i < 5; i++) {
  console.log(`\n📋 Test Case ${i + 1}`);
  console.log('------------------------------------------------------------');
  
  const data = generateCMS1500Data();
  
  console.log('Patient:', data.patient.name);
  console.log('\nDiagnosis Codes (ICD-10):');
  data.claim.diagnosisCodes.forEach((code, index) => {
    const pointer = ['A', 'B', 'C', 'D'][index];
    console.log(`  ${pointer}. ${code}`);
  });
  
  console.log('\nService Lines:');
  data.claim.serviceLines.forEach((service, index) => {
    console.log(`  ${index + 1}. CPT ${service.procedureCode}`);
    console.log(`     Date: ${service.dateFrom}`);
    console.log(`     Place of Service: ${service.placeOfService}`);
    console.log(`     Diagnosis Pointer: ${service.diagnosisPointer}`);
    console.log(`     Charges: $${service.charges}`);
    console.log(`     Emergency: ${service.emg || 'No'}`);
  });
  
  // Verify correlations
  console.log('\n✓ Verification:');
  
  // Check if emergency codes have correct place of service
  const emergencyServices = data.claim.serviceLines.filter(s => s.procedureCode === '99285');
  if (emergencyServices.length > 0) {
    const allCorrect = emergencyServices.every(s => s.placeOfService === '23');
    console.log(`  Emergency services (99285) use POS 23: ${allCorrect ? '✅ Yes' : '❌ No'}`);
  }
  
  // Check if office visits have correct place of service
  const officeVisits = data.claim.serviceLines.filter(s => 
    ['99213', '99214', '99215'].includes(s.procedureCode)
  );
  if (officeVisits.length > 0) {
    const allCorrect = officeVisits.every(s => s.placeOfService === '11');
    console.log(`  Office visits use POS 11: ${allCorrect ? '✅ Yes' : '❌ No'}`);
  }
  
  // Check diagnosis pointers are valid
  const validPointers = data.claim.serviceLines.every(s => {
    const pointers = s.diagnosisPointer.split(',');
    const diagnosisIndexes = ['A', 'B', 'C', 'D'].slice(0, data.claim.diagnosisCodes.length);
    return pointers.every(p => diagnosisIndexes.includes(p.trim()));
  });
  console.log(`  All diagnosis pointers are valid: ${validPointers ? '✅ Yes' : '❌ No'}`);
  
  // Check if services make sense for diagnoses
  console.log('\n💡 Clinical Correlation Examples:');
  data.claim.diagnosisCodes.forEach((code, index) => {
    const pointer = ['A', 'B', 'C', 'D'][index];
    const relatedServices = data.claim.serviceLines
      .filter(s => s.diagnosisPointer.includes(pointer))
      .map(s => s.procedureCode);
    
    if (relatedServices.length > 0) {
      console.log(`  ${code} → ${relatedServices.join(', ')}`);
    }
  });
}

console.log('\n\n✅ Service correlation testing complete!');
