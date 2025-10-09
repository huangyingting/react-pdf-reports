/**
 * Test suite for AI Data Generator Functions
 * Tests all AI-powered medical data generation functions
 * 
 * Prerequisites:
 * - Azure OpenAI credentials configured in .env file
 * - Valid deployment with sufficient quota
 * 
 * Run with: npm run test:ai
 */

// Load environment variables from .env file
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import {
  generatePatientWithAI,
  generateProviderWithAI,
  generateInsuranceInfoWithAI,
  generateCMS1500WithAI,
  generateLabReportsWithAI,
  generateVisitReportWithAI,
  generateMedicalHistoryWithAI,
} from '../src/utils/aiDataGenerator';
import { AzureOpenAIConfig } from '../src/utils/azureOpenAI';
import { Patient, Provider, Complexity } from '../src/utils/zodSchemas';
import { CacheConfig } from '../src/utils/cache';

// ============================================================================
// Test Configuration
// ============================================================================

// Load Azure OpenAI configuration from environment variables
const config: AzureOpenAIConfig = {
  endpoint: process.env.VITE_AZURE_OPENAI_ENDPOINT || '',
  apiKey: process.env.VITE_AZURE_OPENAI_API_KEY || '',
  deploymentName: process.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || '',
  apiVersion: process.env.VITE_AZURE_OPENAI_API_VERSION || '2025-04-01-preview',
};

// Cache configuration for tests (enable caching to speed up repeated runs)
const cacheConfig: CacheConfig = {
  enabled: true,
  directory: '.cache/ai-data-tests',
  ttl: 3600000, // 1 hour
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate that Azure OpenAI is configured
 */
function validateConfiguration(): boolean {
  if (!config.endpoint || !config.apiKey || !config.deploymentName) {
    console.error('❌ Azure OpenAI configuration is missing!');
    console.error('Please configure the following environment variables:');
    console.error('  - VITE_AZURE_OPENAI_ENDPOINT');
    console.error('  - VITE_AZURE_OPENAI_API_KEY');
    console.error('  - VITE_AZURE_OPENAI_DEPLOYMENT_NAME');
    console.error('\nCopy .env.example to .env and fill in your credentials.');
    return false;
  }
  return true;
}

/**
 * Print test section header
 */
function printHeader(title: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`  ${title}`);
  console.log('='.repeat(80) + '\n');
}

/**
 * Print test result
 */
function printResult(testName: string, success: boolean, data?: any, error?: any) {
  if (success) {
    console.log(`✅ ${testName}`);
    if (data) {
      console.log(`   Data preview:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
    }
  } else {
    console.log(`❌ ${testName}`);
    if (error) {
      console.log(`   Error: ${error.message || error}`);
    }
  }
}

/**
 * Run a test with error handling
 */
async function runTest<T>(
  testName: string,
  testFn: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: any }> {
  try {
    const data = await testFn();
    printResult(testName, true, data);
    return { success: true, data };
  } catch (error) {
    printResult(testName, false, undefined, error);
    return { success: false, error };
  }
}

// ============================================================================
// Test Functions
// ============================================================================

/**
 * Test 1: Generate Patient
 */
async function testGeneratePatient() {
  printHeader('Test 1: Generate Patient');

  // Test 1a: Basic patient generation
  const result1 = await runTest('Generate basic patient', async () => {
    return await generatePatientWithAI(config, undefined, cacheConfig);
  });

  // Test 1b: Patient with age range
  const result2 = await runTest('Generate patient with age range (65-85)', async () => {
    return await generatePatientWithAI(
      config,
      { ageRange: { min: 65, max: 85 } },
      cacheConfig
    );
  });

  // Test 1c: Patient with specific gender
  const result3 = await runTest('Generate male patient', async () => {
    return await generatePatientWithAI(
      config,
      { gender: 'Male' },
      cacheConfig
    );
  });

  return {
    passed: result1.success && result2.success && result3.success,
    patient: result1.data, // Return for use in subsequent tests
  };
}

/**
 * Test 2: Generate Provider
 */
async function testGenerateProvider() {
  printHeader('Test 2: Generate Provider');

  // Test 2a: Basic provider generation
  const result1 = await runTest('Generate basic provider', async () => {
    return await generateProviderWithAI(config, undefined, cacheConfig);
  });

  // Test 2b: Provider with specialty
  const result2 = await runTest('Generate cardiologist', async () => {
    return await generateProviderWithAI(
      config,
      { specialty: 'Cardiology' },
      cacheConfig
    );
  });

  // Test 2c: Provider with facility type
  const result3 = await runTest('Generate provider with hospital', async () => {
    return await generateProviderWithAI(
      config,
      { facilityType: 'Hospital' },
      cacheConfig
    );
  });

  return {
    passed: result1.success && result2.success && result3.success,
    provider: result1.data, // Return for use in subsequent tests
  };
}

/**
 * Test 3: Generate Insurance Information
 */
async function testGenerateInsurance(patient: Patient) {
  printHeader('Test 3: Generate Insurance Information');

  if (!patient) {
    console.log('❌ Skipping insurance test - no patient data available');
    return { passed: false };
  }

  // Test 3a: Primary insurance only
  const result1 = await runTest('Generate primary insurance only', async () => {
    return await generateInsuranceInfoWithAI(config, patient, false, cacheConfig);
  });

  // Test 3b: Primary and secondary insurance
  const result2 = await runTest('Generate primary and secondary insurance', async () => {
    return await generateInsuranceInfoWithAI(config, patient, true, cacheConfig);
  });

  return {
    passed: result1.success && result2.success,
    insurance: result1.data, // Return for use in subsequent tests
  };
}

/**
 * Test 4: Generate CMS-1500 Form
 */
async function testGenerateCMS1500(
  patient: Patient,
  insurance: any,
  provider: Provider
) {
  printHeader('Test 4: Generate CMS-1500 Form');

  if (!patient || !insurance || !provider) {
    console.log('❌ Skipping CMS-1500 test - missing prerequisite data');
    return { passed: false };
  }

  const result = await runTest('Generate CMS-1500 claim form', async () => {
    return await generateCMS1500WithAI(
      config,
      patient,
      insurance,
      provider,
      cacheConfig
    );
  });

  return { passed: result.success };
}

/**
 * Test 5: Generate Laboratory Reports
 */
async function testGenerateLabReports(patient: Patient, provider: Provider) {
  printHeader('Test 5: Generate Laboratory Reports');

  if (!patient || !provider) {
    console.log('❌ Skipping lab reports test - missing prerequisite data');
    return { passed: false };
  }

  // Test 5a: Generate single lab report (CBC)
  const result1 = await runTest('Generate single lab report (CBC)', async () => {
    return await generateLabReportsWithAI(
      config,
      patient,
      provider,
      ['CBC'],
      (testType, report, current, total) => {
        console.log(`   Progress: ${current}/${total} - ${testType}`);
      },
      cacheConfig
    );
  });

  // Test 5b: Generate multiple lab reports
  const result2 = await runTest('Generate multiple lab reports (CBC, BMP, Lipid)', async () => {
    return await generateLabReportsWithAI(
      config,
      patient,
      provider,
      ['CBC', 'BMP', 'Lipid'],
      (testType, report, current, total) => {
        console.log(`   Progress: ${current}/${total} - ${testType}`);
      },
      cacheConfig
    );
  });

  // Test 5c: Generate comprehensive panel
  const result3 = await runTest('Generate comprehensive panel', async () => {
    return await generateLabReportsWithAI(
      config,
      patient,
      provider,
      ['CBC', 'CMP', 'Lipid', 'Thyroid', 'HbA1c'],
      (testType, report, current, total) => {
        console.log(`   Progress: ${current}/${total} - ${testType}`);
      },
      cacheConfig
    );
  });

  return {
    passed: result1.success && result2.success && result3.success,
  };
}

/**
 * Test 6: Generate Visit Report
 */
async function testGenerateVisitReport(patient: Patient, provider: Provider) {
  printHeader('Test 6: Generate Visit Report');

  if (!patient || !provider) {
    console.log('❌ Skipping visit report test - missing prerequisite data');
    return { passed: false };
  }

  // Test 6a: Single visit report
  const result1 = await runTest('Generate single visit report', async () => {
    return await generateVisitReportWithAI(
      config,
      patient,
      provider,
      1,
      cacheConfig
    );
  });

  // Test 6b: Multiple visits (returns first)
  const result2 = await runTest('Generate visit report (3 visits)', async () => {
    return await generateVisitReportWithAI(
      config,
      patient,
      provider,
      3,
      cacheConfig
    );
  });

  return { passed: result1.success && result2.success };
}

/**
 * Test 7: Generate Medical History
 */
async function testGenerateMedicalHistory(patient: Patient) {
  printHeader('Test 7: Generate Medical History');

  if (!patient) {
    console.log('❌ Skipping medical history test - no patient data available');
    return { passed: false };
  }

  // Test 7a: Low complexity
  const result1 = await runTest('Generate medical history (low complexity)', async () => {
    return await generateMedicalHistoryWithAI(
      config,
      patient,
      'low' as Complexity,
      cacheConfig
    );
  });

  // Test 7b: Medium complexity
  const result2 = await runTest('Generate medical history (medium complexity)', async () => {
    return await generateMedicalHistoryWithAI(
      config,
      patient,
      'medium' as Complexity,
      cacheConfig
    );
  });

  // Test 7c: High complexity
  const result3 = await runTest('Generate medical history (high complexity)', async () => {
    return await generateMedicalHistoryWithAI(
      config,
      patient,
      'high' as Complexity,
      cacheConfig
    );
  });

  return {
    passed: result1.success && result2.success && result3.success,
  };
}

/**
 * Test 8: Integration Test - Complete Medical Record
 */
async function testCompleteIntegration() {
  printHeader('Test 8: Integration Test - Complete Medical Record Generation');

  console.log('Generating a complete medical record with all components...\n');

  try {
    // Step 1: Generate Patient
    console.log('Step 1/7: Generating patient...');
    const patient = await generatePatientWithAI(config, undefined, cacheConfig);
    console.log(`✅ Patient: ${patient.name}`);

    // Step 2: Generate Provider
    console.log('\nStep 2/7: Generating provider...');
    const provider = await generateProviderWithAI(config, undefined, cacheConfig);
    console.log(`✅ Provider: ${provider.name}`);

    // Step 3: Generate Insurance
    console.log('\nStep 3/7: Generating insurance...');
    const insurance = await generateInsuranceInfoWithAI(config, patient, true, cacheConfig);
    console.log(`✅ Insurance: ${insurance.primaryInsurance.provider}`);

    // Step 4: Generate Medical History
    console.log('\nStep 4/7: Generating medical history...');
    const medicalHistory = await generateMedicalHistoryWithAI(config, patient, 'medium', cacheConfig);
    console.log(`✅ Medical History: ${medicalHistory.medications.current.length} medications, ${medicalHistory.chronicConditions.length} conditions`);

    // Step 5: Generate Visit Report
    console.log('\nStep 5/7: Generating visit report...');
    const visitReport = await generateVisitReportWithAI(config, patient, provider, 1, cacheConfig);
    console.log(`✅ Visit Report: ${visitReport.visit.chiefComplaint}`);

    // Step 6: Generate Lab Reports
    console.log('\nStep 6/7: Generating lab reports...');
    const labReports = await generateLabReportsWithAI(
      config,
      patient,
      provider,
      ['CBC', 'BMP'],
      (testType, report, current, total) => {
        console.log(`   Generating ${testType}... (${current}/${total})`);
      },
      cacheConfig
    );
    console.log(`✅ Lab Reports: Generated ${labReports.length} reports`);

    // Step 7: Generate CMS-1500
    console.log('\nStep 7/7: Generating CMS-1500...');
    const cms1500 = await generateCMS1500WithAI(config, patient, insurance, provider, cacheConfig);
    console.log(`✅ CMS-1500: ${cms1500.claimInfo.serviceLines.length} service lines`);

    console.log('\n' + '='.repeat(80));
    console.log('✅ Complete medical record generated successfully!');
    console.log('='.repeat(80));

    return { passed: true };
  } catch (error) {
    console.error('\n❌ Integration test failed:', error);
    return { passed: false };
  }
}

// ============================================================================
// Main Test Runner
// ============================================================================

async function runAllTests() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                     AI Data Generator Test Suite                              ║');
  console.log('║                  Testing Azure OpenAI Integration                             ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');

  // Validate configuration
  if (!validateConfiguration()) {
    process.exit(1);
  }

  console.log('\n✅ Azure OpenAI configuration validated');
  console.log(`   Endpoint: ${config.endpoint}`);
  console.log(`   Deployment: ${config.deploymentName}`);
  console.log(`   API Version: ${config.apiVersion}`);
  console.log(`   Cache: ${cacheConfig.enabled ? 'Enabled' : 'Disabled'}`);

  const startTime = Date.now();
  const results: { [key: string]: boolean } = {};

  // Run tests sequentially to reuse generated data
  let patient: Patient | undefined;
  let provider: Provider | undefined;
  let insurance: any;

  // Test 1: Patient Generation
  const test1 = await testGeneratePatient();
  results['Patient Generation'] = test1.passed;
  patient = test1.patient;

  // Test 2: Provider Generation
  const test2 = await testGenerateProvider();
  results['Provider Generation'] = test2.passed;
  provider = test2.provider;

  // Test 3: Insurance Information (requires patient)
  if (patient) {
    const test3 = await testGenerateInsurance(patient);
    results['Insurance Information'] = test3.passed;
    insurance = test3.insurance;
  }

  // Test 4: CMS-1500 Form (requires patient, insurance, provider)
  if (patient && insurance && provider) {
    const test4 = await testGenerateCMS1500(patient, insurance, provider);
    results['CMS-1500 Form'] = test4.passed;
  }

  // Test 5: Laboratory Reports (requires patient, provider)
  if (patient && provider) {
    const test5 = await testGenerateLabReports(patient, provider);
    results['Laboratory Reports'] = test5.passed;
  }

  // Test 6: Visit Report (requires patient, provider)
  if (patient && provider) {
    const test6 = await testGenerateVisitReport(patient, provider);
    results['Visit Report'] = test6.passed;
  }

  // Test 7: Medical History (requires patient)
  if (patient) {
    const test7 = await testGenerateMedicalHistory(patient);
    results['Medical History'] = test7.passed;
  }

  // Test 8: Complete Integration Test
  const test8 = await testCompleteIntegration();
  results['Complete Integration'] = test8.passed;

  // Print summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  printHeader('Test Summary');

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  console.log('Test Results:');
  Object.entries(results).forEach(([name, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${name}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`Total: ${passed}/${total} tests passed`);
  console.log(`Duration: ${duration}s`);
  console.log('='.repeat(80) + '\n');

  // Exit with appropriate code
  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// ============================================================================
// Execute Tests
// ============================================================================

// Run all tests
runAllTests().catch((error) => {
  console.error('\n💥 Fatal error running tests:', error);
  process.exit(1);
});
