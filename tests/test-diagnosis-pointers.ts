/**
 * Test Diagnosis Pointer Logic
 * Verify that diagnosis pointers correctly link services to diagnoses
 */

import { generateCMS1500Data } from '../src/utils/cms1500Data';

console.log('Testing Diagnosis Pointer Logic\n');
console.log('============================================================\n');

const testCases = 10;

for (let i = 0; i < testCases; i++) {
  console.log(`\n📋 Test Case ${i + 1}`);
  console.log('------------------------------------------------------------');
  
  const data = generateCMS1500Data();
  
  console.log(`Patient: ${data.patient.name}\n`);
  
  // Display diagnoses with their pointers
  console.log('Diagnosis Codes:');
  const diagnosisMap: Record<string, string> = {};
  data.claim.diagnosisCodes.forEach((code, index) => {
    const pointer = ['A', 'B', 'C', 'D'][index];
    diagnosisMap[pointer] = code;
    console.log(`  ${pointer}. ${code}`);
  });
  
  console.log('\nService Lines and Clinical Correlation:');
  data.claim.serviceLines.forEach((service, idx) => {
    console.log(`\n  ${idx + 1}. CPT ${service.procedureCode} - Pointer: ${service.diagnosisPointer}`);
    
    // Parse the pointers
    const pointers = service.diagnosisPointer.split(',').map(p => p.trim());
    
    // Show which diagnoses are linked
    const linkedDiagnoses = pointers.map(p => diagnosisMap[p]).filter(Boolean);
    console.log(`     Linked to: ${linkedDiagnoses.join(', ')}`);
    
    // Clinical sense check
    let clinicalNote = '';
    
    // Check for specific procedure-diagnosis correlations
    if (service.procedureCode === '99285') {
      // Emergency visit - should link to acute/critical conditions
      const hasCritical = linkedDiagnoses.some(d => 
        d.startsWith('I21') || // MI
        d.startsWith('I63') || d === 'I64' || // Stroke
        d.startsWith('J96') || d === 'J80' || d === 'J81.0' || // Respiratory failure
        d === 'A41.9' || // Sepsis
        d.startsWith('N17') || // Acute kidney failure
        d === 'J44.1' || d === 'I50.23' // Acute exacerbations
      );
      clinicalNote = hasCritical ? '✅ Appropriate for ER' : '⚠️  No acute diagnosis for ER visit';
    }
    
    if (service.procedureCode === '83036') {
      // HbA1c test - should link to diabetes
      const hasDiabetes = linkedDiagnoses.some(d => d.startsWith('E10') || d.startsWith('E11'));
      clinicalNote = hasDiabetes ? '✅ Appropriate for diabetes' : '⚠️  No diabetes diagnosis for HbA1c';
    }
    
    if (service.procedureCode === '93000') {
      // ECG - should link to cardiac conditions
      const hasCardiac = linkedDiagnoses.some(d => 
        d.startsWith('I') && !d.startsWith('I63') && d !== 'I64'
      );
      clinicalNote = hasCardiac ? '✅ Appropriate for cardiac issue' : '⚠️  No cardiac diagnosis for ECG';
    }
    
    if (service.procedureCode === '94060') {
      // Spirometry - should link to respiratory conditions
      const hasRespiratory = linkedDiagnoses.some(d => d.startsWith('J'));
      clinicalNote = hasRespiratory ? '✅ Appropriate for respiratory' : '⚠️  No respiratory diagnosis';
    }
    
    if (service.procedureCode === '90834') {
      // Psychotherapy - should link to mental health
      const hasMentalHealth = linkedDiagnoses.some(d => d.startsWith('F'));
      clinicalNote = hasMentalHealth ? '✅ Appropriate for mental health' : '⚠️  No mental health diagnosis';
    }
    
    if (service.procedureCode === '80053') {
      // Metabolic panel - used for many conditions, usually OK
      clinicalNote = '✅ General diagnostic test';
    }
    
    if (service.procedureCode === '71045') {
      // Chest x-ray - should link to cardiac or respiratory
      const hasChestRelated = linkedDiagnoses.some(d => 
        d.startsWith('I') || d.startsWith('J') || d === 'U07.1'
      );
      clinicalNote = hasChestRelated ? '✅ Appropriate chest imaging' : '⚠️  Questionable indication';
    }
    
    if (clinicalNote) {
      console.log(`     ${clinicalNote}`);
    }
  });
}

console.log('\n\n' + '='.repeat(60));
console.log('Analysis complete!');
console.log('='.repeat(60));

// Summary analysis
console.log('\n📊 Clinical Correlation Summary:\n');

let totalServices = 0;
let appropriateLinks = 0;
let questionableLinks = 0;

for (let i = 0; i < 100; i++) {
  const data = generateCMS1500Data();
  
  const diagnosisMap: Record<string, string> = {};
  data.claim.diagnosisCodes.forEach((code, index) => {
    const pointer = ['A', 'B', 'C', 'D'][index];
    diagnosisMap[pointer] = code;
  });
  
  data.claim.serviceLines.forEach(service => {
    totalServices++;
    const pointers = service.diagnosisPointer.split(',').map(p => p.trim());
    const linkedDiagnoses = pointers.map(p => diagnosisMap[p]).filter(Boolean);
    
    let appropriate = true;
    
    // Check specific correlations
    if (service.procedureCode === '83036') {
      appropriate = linkedDiagnoses.some(d => d.startsWith('E10') || d.startsWith('E11'));
    } else if (service.procedureCode === '93000') {
      appropriate = linkedDiagnoses.some(d => d.startsWith('I'));
    } else if (service.procedureCode === '94060') {
      appropriate = linkedDiagnoses.some(d => d.startsWith('J'));
    } else if (service.procedureCode === '90834') {
      appropriate = linkedDiagnoses.some(d => d.startsWith('F'));
    } else if (service.procedureCode === '71045') {
      appropriate = linkedDiagnoses.some(d => d.startsWith('I') || d.startsWith('J') || d === 'U07.1');
    } else if (service.procedureCode === '70450') {
      appropriate = linkedDiagnoses.some(d => d.startsWith('I63') || d === 'I64' || d.startsWith('G'));
    } else if (service.procedureCode === '82947') {
      appropriate = linkedDiagnoses.some(d => d.startsWith('E1'));
    } else if (service.procedureCode === '84153') {
      appropriate = linkedDiagnoses.some(d => d === 'C61');
    } else if (service.procedureCode === '77065') {
      appropriate = linkedDiagnoses.some(d => d.startsWith('C50'));
    } else if (service.procedureCode === '45378') {
      appropriate = linkedDiagnoses.some(d => d.startsWith('C18'));
    }
    
    if (appropriate) {
      appropriateLinks++;
    } else {
      questionableLinks++;
    }
  });
}

const appropriatePercentage = ((appropriateLinks / totalServices) * 100).toFixed(1);
const questionablePercentage = ((questionableLinks / totalServices) * 100).toFixed(1);

console.log(`Total services analyzed: ${totalServices}`);
console.log(`Clinically appropriate links: ${appropriateLinks} (${appropriatePercentage}%)`);
console.log(`Questionable links: ${questionableLinks} (${questionablePercentage}%)`);

if (questionableLinks > totalServices * 0.1) {
  console.log('\n⚠️  More than 10% of services have questionable diagnosis links!');
  console.log('Consider reviewing the diagnosis pointer assignment logic.');
} else {
  console.log('\n✅ Most services have clinically appropriate diagnosis links!');
}
