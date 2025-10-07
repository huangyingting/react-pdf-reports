/**
 * Test script to verify Visit Report and Medication History generation
 */

import { generateCompleteMedicalRecord } from '../src/utils/medicalRecordsGenerator';
import { generateVisitReportData } from '../src/utils/visitReportGenerator';
import { generateMedicationHistoryData } from '../src/utils/medicationHistoryGenerator';

console.log('Testing Visit Report and Medication History data generation...\n');

const startTime = Date.now();

try {
  // Generate base medical record
  console.log('1. Generating base medical record...');
  const medicalData = generateCompleteMedicalRecord({
    complexity: 'medium',
    numberOfVisits: 3,
    numberOfLabTests: 2,
    includeSecondaryInsurance: true
  });
  console.log('✅ Medical record generated');
  
  // Generate Visit Report
  console.log('\n2. Generating Visit Report...');
  const visitReportData = generateVisitReportData(medicalData);
  console.log('✅ Visit Report data generated');
  console.log(`   Patient: ${visitReportData.patient.name}`);
  console.log(`   Provider: ${visitReportData.provider.name}`);
  console.log(`   Visit Date: ${visitReportData.visit.date}`);
  console.log(`   Visit Type: ${visitReportData.visit.type}`);
  console.log(`   Chief Complaint: ${visitReportData.visit.chiefComplaint}`);
  console.log(`   Vital Signs:`);
  console.log(`     - BP: ${visitReportData.vitalSigns.bloodPressure}`);
  console.log(`     - HR: ${visitReportData.vitalSigns.heartRate}`);
  console.log(`     - Temp: ${visitReportData.vitalSigns.temperature}`);
  console.log(`     - O2 Sat: ${visitReportData.vitalSigns.oxygenSaturation}`);
  console.log(`   Assessment: ${visitReportData.visit.assessment.join(', ')}`);
  
  // Generate Medication History
  console.log('\n3. Generating Medication History...');
  const medicationHistoryData = generateMedicationHistoryData(medicalData);
  console.log('✅ Medication History data generated');
  console.log(`   Patient: ${medicationHistoryData.patient.name}`);
  console.log(`   Provider: ${medicationHistoryData.provider.name}`);
  console.log(`   Current Medications: ${medicationHistoryData.medications.current.length}`);
  console.log(`   Discontinued Medications: ${medicationHistoryData.medications.discontinued.length}`);
  console.log(`   Allergies: ${medicationHistoryData.allergies.length}`);
  
  console.log('\n   Current Medications List:');
  medicationHistoryData.medications.current.forEach((med, index) => {
    console.log(`     ${index + 1}. ${med.name} ${med.strength}`);
    console.log(`        Purpose: ${med.purpose}`);
    console.log(`        Dosage: ${med.dosage}`);
  });
  
  console.log('\n   Allergies:');
  medicationHistoryData.allergies.forEach((allergy, index) => {
    console.log(`     ${index + 1}. ${allergy.allergen} - ${allergy.severity}`);
    console.log(`        Reaction: ${allergy.reaction}`);
  });
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log(`\n✅ ALL TESTS PASSED!`);
  console.log(`⏱️  Total time: ${duration}ms`);
  
} catch (error) {
  console.error('\n❌ ERROR:', error);
  process.exit(1);
}
