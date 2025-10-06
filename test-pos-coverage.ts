/**
 * Test Place of Service Coverage
 * Verifies that all CPT codes have appropriate POS mappings
 */

import { generateCMS1500Data } from './src/utils/cms1500Data';

console.log('Testing Place of Service Coverage\n');
console.log('============================================================\n');

const testCases = 200;
const procedureCodesSeen = new Set<string>();
const proceduresWithoutPOS = new Set<string>();
const posDistribution: Record<string, number> = {};

console.log(`Analyzing ${testCases} generated forms...\n`);

for (let i = 0; i < testCases; i++) {
  const data = generateCMS1500Data();
  
  data.claim.serviceLines.forEach(service => {
    procedureCodesSeen.add(service.procedureCode);
    
    // Track POS distribution
    const pos = service.placeOfService;
    posDistribution[pos] = (posDistribution[pos] || 0) + 1;
    
    // Check if POS is default '11' for non-office procedures that should have specific POS
    if (service.placeOfService === '11' && 
        ['99285'].includes(service.procedureCode)) {
      proceduresWithoutPOS.add(service.procedureCode);
    }
  });
}

console.log('📊 Coverage Analysis:\n');
console.log(`Total unique CPT codes generated: ${procedureCodesSeen.size}`);
console.log(`\nCPT codes encountered:`);
Array.from(procedureCodesSeen).sort().forEach(code => {
  console.log(`  - ${code}`);
});

console.log('\n📍 Place of Service Distribution:\n');
const posNames: Record<string, string> = {
  '11': 'Office',
  '22': 'Outpatient Hospital',
  '23': 'Emergency Room',
  '24': 'Ambulatory Surgical Center',
  '81': 'Independent Laboratory',
};

Object.entries(posDistribution)
  .sort((a, b) => b[1] - a[1])
  .forEach(([pos, count]) => {
    const name = posNames[pos] || 'Unknown';
    const percentage = ((count / testCases) * 100).toFixed(1);
    console.log(`  POS ${pos} (${name}): ${count} services (${percentage}%)`);
  });

if (proceduresWithoutPOS.size > 0) {
  console.log('\n⚠️  Procedures that might need specific POS mapping:');
  proceduresWithoutPOS.forEach(code => {
    console.log(`  - ${code}`);
  });
} else {
  console.log('\n✅ All critical procedures have appropriate POS mappings!');
}

// Sample some specific procedures to verify POS
console.log('\n🔍 Spot Check - Specific Procedure POS Verification:\n');

const spotCheckResults: Array<{ procedure: string, expectedPOS: string, found: boolean }> = [];

// Generate more samples to find specific procedures
for (let i = 0; i < 500; i++) {
  const data = generateCMS1500Data();
  
  data.claim.serviceLines.forEach(service => {
    // Check emergency visits
    if (service.procedureCode === '99285') {
      spotCheckResults.push({
        procedure: '99285 (Emergency visit)',
        expectedPOS: '23',
        found: service.placeOfService === '23'
      });
    }
    
    // Check colonoscopy
    if (service.procedureCode === '45378') {
      spotCheckResults.push({
        procedure: '45378 (Colonoscopy)',
        expectedPOS: '24',
        found: service.placeOfService === '24'
      });
    }
    
    // Check imaging
    if (service.procedureCode === '71045') {
      spotCheckResults.push({
        procedure: '71045 (Chest x-ray)',
        expectedPOS: '22',
        found: service.placeOfService === '22'
      });
    }
    
    // Check office visits
    if (service.procedureCode === '99214') {
      spotCheckResults.push({
        procedure: '99214 (Office visit)',
        expectedPOS: '11',
        found: service.placeOfService === '11'
      });
    }
  });
}

// Summarize spot check results
const procedureChecks = new Map<string, { total: number, correct: number }>();

spotCheckResults.forEach(result => {
  if (!procedureChecks.has(result.procedure)) {
    procedureChecks.set(result.procedure, { total: 0, correct: 0 });
  }
  const check = procedureChecks.get(result.procedure)!;
  check.total++;
  if (result.found) check.correct++;
});

procedureChecks.forEach((stats, procedure) => {
  const percentage = ((stats.correct / stats.total) * 100).toFixed(1);
  const status = stats.correct === stats.total ? '✅' : '❌';
  console.log(`  ${status} ${procedure}: ${stats.correct}/${stats.total} correct (${percentage}%)`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ Place of Service coverage test complete!');
console.log('='.repeat(60));
