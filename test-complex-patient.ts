/**
 * Test script to verify Complex Patient data generation doesn't hang
 */

import { generateCompleteMedicalRecord } from './src/utils/medicalRecordsGenerator';

console.log('Testing Complex Patient data generation...');
console.log('This should complete in a few seconds...\n');

const startTime = Date.now();

try {
  const data = generateCompleteMedicalRecord({
    complexity: 'high',
    numberOfVisits: 5,
    numberOfLabTests: 10,
    includeSecondaryInsurance: true
  });
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log('✅ SUCCESS! Data generated successfully');
  console.log(`⏱️  Time taken: ${duration}ms`);
  console.log(`\nGenerated data summary:`);
  console.log(`- Patient: ${data.patient.name}`);
  console.log(`- Chronic conditions: ${data.medicalHistory.chronicConditions.length}`);
  console.log(`- Current medications: ${data.medications.current.length}`);
  console.log(`- Lab tests: ${data.labResults.length}`);
  console.log(`- Visit notes: ${data.visitNotes.length}`);
  console.log(`\nMedications list:`);
  data.medications.current.forEach((med, index) => {
    console.log(`  ${index + 1}. ${med.name} ${med.strength} - ${med.purpose}`);
  });
} catch (error) {
  console.error('❌ ERROR:', error);
  process.exit(1);
}
