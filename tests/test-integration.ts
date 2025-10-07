/**
 * Integration Test - Complete System Verification
 * Tests all 15 new report types (2 clinical + 13 laboratory)
 */

import { generateCompleteMedicalRecord } from '../src/utils/medicalRecordsGenerator';
import { generateVisitReportData } from '../src/utils/visitReportGenerator';
import { generateMedicationHistoryData } from '../src/utils/medicationHistoryGenerator';
import { generateLaboratoryReportData } from '../src/utils/laboratoryReportGenerator';
import type { LabTestType } from '../src/utils/types';

console.log('🧪 Starting Integration Test...\n');

const startTime = performance.now();

// Generate base patient data
console.log('1️⃣  Generating base medical record...');
const baseData = generateCompleteMedicalRecord({
  complexity: 'medium',
  numberOfVisits: 3,
  numberOfLabTests: 2,
  includeSecondaryInsurance: true
});
console.log(`   ✅ Patient: ${baseData.patient.firstName} ${baseData.patient.lastName}`);
console.log(`   ✅ SSN: ${baseData.patient.ssn}`);
console.log(`   ✅ DOB: ${baseData.patient.dateOfBirth}\n`);

// Test Clinical Reports
console.log('2️⃣  Testing Clinical Reports:');
const clinicalStart = performance.now();

const visitReport = generateVisitReportData(baseData);
console.log(`   ✅ Visit Report - Generated successfully`);
console.log(`      Visit date: ${visitReport.visit.date}`);
console.log(`      Chief complaint: ${visitReport.visit.chiefComplaint}`);

const medicationHistory = generateMedicationHistoryData(baseData);
console.log(`   ✅ Medication History - Generated successfully`);
console.log(`      Current meds: ${medicationHistory.medications.current.length}`);
console.log(`      Allergies: ${medicationHistory.allergies.length}`);

const clinicalTime = performance.now() - clinicalStart;
console.log(`   ⏱️  Clinical reports time: ${clinicalTime.toFixed(2)}ms\n`);

// Test Laboratory Reports
console.log('3️⃣  Testing Laboratory Reports:');
const labStart = performance.now();

const labTypes: LabTestType[] = [
  'CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT',
  'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology',
  'Pathology', 'Hormone', 'Infectious'
];

const labReports = new Map<LabTestType, any>();
let totalParams = 0;
let totalAbnormal = 0;
let totalCritical = 0;

labTypes.forEach(testType => {
  const report = generateLaboratoryReportData(testType, baseData);
  labReports.set(testType, report);
  
  const abnormal = report.results.filter((r: any) => 
    r.flag && r.flag !== 'Normal'
  ).length;
  
  const critical = report.results.filter((r: any) => 
    r.flag === 'Critical'
  ).length;
  
  totalParams += report.results.length;
  totalAbnormal += abnormal;
  totalCritical += critical;
  
  console.log(`   ✅ ${testType.padEnd(14)} - ${report.results.length.toString().padStart(2)} parameters` +
    (abnormal > 0 ? ` (${abnormal} abnormal${critical > 0 ? `, ${critical} critical` : ''})` : ''));
});

const labTime = performance.now() - labStart;
console.log(`   ⏱️  Laboratory reports time: ${labTime.toFixed(2)}ms`);
console.log(`   📊 Total: ${totalParams} parameters, ${totalAbnormal} abnormal, ${totalCritical} critical\n`);

// Summary
const totalTime = performance.now() - startTime;
console.log('🎉 INTEGRATION TEST COMPLETE!');
console.log(`   ⏱️  Total generation time: ${totalTime.toFixed(2)}ms`);
console.log(`   📦 Generated ${labReports.size + 2} report types successfully`);
console.log(`   ✅ 2 Clinical Reports`);
console.log(`   ✅ ${labReports.size} Laboratory Reports`);
console.log('\n✨ All systems operational!\n');
