#!/usr/bin/env tsx

/**
 * Test chronological date logic in CMS-1500 data generation
 */

import { generateCMS1500Data } from '../src/utils/cms1500Data';
import { generateCompleteMedicalRecord } from '../src/utils/dataGenerator';

console.log('Testing CMS-1500 Chronological Date Logic\n');
console.log('='.repeat(70));

// Test multiple generations to verify date ordering
for (let i = 1; i <= 3; i++) {
  console.log(`\n📋 Test ${i}: Generate CMS-1500 and verify date chronology`);
  console.log('-'.repeat(70));
  
  const medicalRecord = generateCompleteMedicalRecord({ complexity: 'medium' });
  const cms1500 = generateCMS1500Data(medicalRecord);
  
  // Parse dates for comparison
  const parseDate = (dateStr: string) => dateStr ? new Date(dateStr) : null;
  
  const dateOfIllness = parseDate(cms1500.claim.dateOfIllness);
  const serviceDate = parseDate(cms1500.claim.serviceLines[0]?.dateFrom);
  const providerSigDate = parseDate(cms1500.claim.providerSignatureDate);
  const patientSigDate = parseDate(cms1500.claim.signatureDate);
  const hospFrom = parseDate(cms1500.claim.hospitalizationFrom);
  const hospTo = parseDate(cms1500.claim.hospitalizationTo);
  const workFrom = parseDate(cms1500.claim.unableToWorkFrom);
  const workTo = parseDate(cms1500.claim.unableToWorkTo);
  
  console.log('📅 Date Timeline:');
  console.log(`  1. Date of Illness:        ${cms1500.claim.dateOfIllness}`);
  
  if (hospFrom && hospTo) {
    console.log(`  2. Hospitalization:        ${cms1500.claim.hospitalizationFrom} to ${cms1500.claim.hospitalizationTo}`);
  }
  
  if (workFrom && workTo) {
    console.log(`  3. Unable to Work:         ${cms1500.claim.unableToWorkFrom} to ${cms1500.claim.unableToWorkTo}`);
  }
  
  console.log(`  4. Service Date:           ${cms1500.claim.serviceLines[0]?.dateFrom}`);
  console.log(`  5. Provider Signature:     ${cms1500.claim.providerSignatureDate}`);
  console.log(`  6. Patient Signature:      ${cms1500.claim.signatureDate}`);
  
  // Verify chronological order
  console.log('\n✅ Chronological Validation:');
  
  const checks = [];
  
  // Check 1: Service date should be >= illness date
  if (dateOfIllness && serviceDate) {
    const check1 = serviceDate >= dateOfIllness;
    checks.push(check1);
    console.log(`  ${check1 ? '✅' : '❌'} Service date (${cms1500.claim.serviceLines[0]?.dateFrom}) >= Illness date (${cms1500.claim.dateOfIllness})`);
  }
  
  // Check 2: Provider signature should be >= service date
  if (serviceDate && providerSigDate) {
    const check2 = providerSigDate >= serviceDate;
    checks.push(check2);
    console.log(`  ${check2 ? '✅' : '❌'} Provider signature >= Service date`);
  }
  
  // Check 3: Patient signature should be >= provider signature
  if (providerSigDate && patientSigDate) {
    const check3 = patientSigDate >= providerSigDate;
    checks.push(check3);
    console.log(`  ${check3 ? '✅' : '❌'} Patient signature >= Provider signature`);
  }
  
  // Check 4: Hospitalization dates (if present)
  if (hospFrom && hospTo && dateOfIllness) {
    const check4a = hospFrom >= dateOfIllness;
    const check4b = hospTo >= hospFrom;
    checks.push(check4a, check4b);
    console.log(`  ${check4a ? '✅' : '❌'} Hospitalization start >= Illness date`);
    console.log(`  ${check4b ? '✅' : '❌'} Hospitalization end >= Hospitalization start`);
  }
  
  // Check 5: Unable to work dates (if present)
  if (workFrom && workTo && dateOfIllness) {
    const check5a = workFrom >= dateOfIllness;
    const check5b = workTo >= workFrom;
    checks.push(check5a, check5b);
    console.log(`  ${check5a ? '✅' : '❌'} Unable to work start >= Illness date`);
    console.log(`  ${check5b ? '✅' : '❌'} Unable to work end >= Unable to work start`);
  }
  
  const allValid = checks.every(c => c === true);
  console.log(`\n${allValid ? '✅✅✅' : '❌❌❌'} ${allValid ? 'All dates are chronologically correct!' : 'Some dates are out of order!'}`);
  
  // Show total charges calculation
  console.log(`\n💰 Financial Summary:`);
  console.log(`  Number of Services: ${cms1500.claim.serviceLines.length}`);
  console.log(`  Total Charges: $${cms1500.claim.totalCharges}`);
  console.log(`  Amount Paid: $${cms1500.claim.amountPaid}`);
}

console.log('\n' + '='.repeat(70));
console.log('✅ All chronological date tests completed!');
