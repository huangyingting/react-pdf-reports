/**
 * Test script to verify all 13 laboratory report types generation
 */

import { generateLaboratoryReportData } from '../src/utils/laboratoryReportGenerator';
import { LabTestType } from '../src/utils/types';

console.log('Testing Laboratory Report generation for all 13 test types...\n');

const allTestTypes: LabTestType[] = [
  'CBC',
  'BMP',
  'CMP',
  'Urinalysis',
  'Lipid',
  'LFT',
  'Thyroid',
  'HbA1c',
  'Coagulation',
  'Microbiology',
  'Pathology',
  'Hormone',
  'Infectious'
];

const testNames = {
  CBC: 'Complete Blood Count',
  BMP: 'Basic Metabolic Panel',
  CMP: 'Comprehensive Metabolic Panel',
  Urinalysis: 'Urinalysis',
  Lipid: 'Lipid Profile',
  LFT: 'Liver Function Tests',
  Thyroid: 'Thyroid Function Panel',
  HbA1c: 'Hemoglobin A1c',
  Coagulation: 'Coagulation Panel',
  Microbiology: 'Microbiology Culture',
  Pathology: 'Pathology Report',
  Hormone: 'Hormone Panel',
  Infectious: 'Infectious Disease Panel'
};

const startTime = Date.now();

try {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  LABORATORY REPORT GENERATION TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  allTestTypes.forEach((testType, index) => {
    console.log(`${index + 1}. Testing ${testNames[testType]} (${testType})...`);
    
    try {
      const labData = generateLaboratoryReportData(testType);
      
      console.log(`   ✅ Generated successfully`);
      console.log(`      Patient: ${labData.patient.name}`);
      console.log(`      MRN: ${labData.patient.medicalRecordNumber}`);
      console.log(`      Test: ${labData.testName}`);
      console.log(`      Specimen: ${labData.specimenType}`);
      console.log(`      Results: ${labData.results.length} parameters`);
      console.log(`      Lab: ${labData.performingLab.name}`);
      console.log(`      CLIA#: ${labData.performingLab.cliaNumber}`);
      
      // Count abnormal results
      const abnormalCount = labData.results.filter(r => r.flag && r.flag !== 'Normal').length;
      const criticalCount = labData.results.filter(r => r.flag === 'Critical').length;
      
      if (abnormalCount > 0) {
        console.log(`      ⚠️  Abnormal: ${abnormalCount} results`);
      }
      if (criticalCount > 0) {
        console.log(`      🔴 Critical: ${criticalCount} results`);
      }
      
      // Show some sample results
      if (labData.results.length > 0) {
        console.log(`      Sample Results:`);
        labData.results.slice(0, 3).forEach(result => {
          const flagText = result.flag ? ` [${result.flag}]` : '';
          console.log(`        - ${result.parameter}: ${result.value} ${result.unit}${flagText}`);
        });
        if (labData.results.length > 3) {
          console.log(`        ... and ${labData.results.length - 3} more`);
        }
      }
      
      if (labData.interpretation) {
        console.log(`      Interpretation: ${labData.interpretation.substring(0, 80)}...`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`   ❌ ERROR generating ${testType}:`, error);
      throw error;
    }
  });
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`✅ ALL ${allTestTypes.length} LABORATORY REPORT TYPES GENERATED SUCCESSFULLY!`);
  console.log(`⏱️  Total time: ${duration}ms (avg: ${(duration / allTestTypes.length).toFixed(1)}ms per test)`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('Test Types Verified:');
  allTestTypes.forEach((type, index) => {
    console.log(`  ${index + 1}. ${testNames[type]} ✓`);
  });
  
  console.log('\nAll laboratory reports are ready for integration into the application.');
  
} catch (error) {
  console.error('\n❌ TEST FAILED:', error);
  process.exit(1);
}
