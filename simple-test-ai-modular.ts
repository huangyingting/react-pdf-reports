/**
 * Simple Test Script for AI Data Generator (Modular Approach)
 * 
 * Tests the new modular AI data generation functions with Azure OpenAI
 * 
 * Usage:
 *   npx tsx simple-test-ai-modular.ts
 */

import 'dotenv/config';
import { 
  generatePatientDataWithAI,
  generateProviderDataWithAI,
  generateInsuranceDataWithAI,
} from './src/utils/aiDataGenerator';
import { AzureOpenAIConfig } from './src/utils/azureOpenAI';
import { PatientDemographics, Provider, InsuranceInfo } from './src/utils/types';

/**
 * Test Modular Data Generation (New Approach)
 * 
 * Generates patient, provider, and insurance data separately.
 * This demonstrates the new modular approach for more flexibility.
 */
async function testModularDataGeneration(config: AzureOpenAIConfig): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 Generating Medical Data (Modular Approach)...\n');

  // Generate patient data
  console.log('👤 Generating patient data...');
  const patientStartTime = Date.now();
  const patientData = await generatePatientDataWithAI(config, {
    ageRange: { min: 25, max: 65 },
    gender: 'any'
  });
  const patientDuration = Date.now() - patientStartTime;
  console.log(`✅ Patient data generated in ${patientDuration}ms`);

  // Generate provider data
  console.log('\n👨‍⚕️ Generating provider data...');
  const providerStartTime = Date.now();
  const providerData = await generateProviderDataWithAI(config, {
    specialty: 'any'
  });
  const providerDuration = Date.now() - providerStartTime;
  console.log(`✅ Provider data generated in ${providerDuration}ms`);

  // Generate insurance data
  console.log('\n🏥 Generating insurance data...');
  const insuranceStartTime = Date.now();
  const insuranceData = await generateInsuranceDataWithAI(config, {
    includeSecondary: false
  });
  const insuranceDuration = Date.now() - insuranceStartTime;
  console.log(`✅ Insurance data generated in ${insuranceDuration}ms`);

  const totalDuration = patientDuration + providerDuration + insuranceDuration;
  console.log(`\n✅ Total generation time: ${totalDuration}ms\n`);
  console.log('='.repeat(70));
  console.log('\n📄 Generated Medical Record (Modular):\n');
  
  // Patient Information
  console.log('👤 PATIENT:');
  console.log(`  Name: ${patientData.name}`);
  console.log(`  Age: ${patientData.age} years`);
  console.log(`  Gender: ${patientData.gender}`);
  console.log(`  DOB: ${patientData.dateOfBirth}`);
  console.log(`  MRN: ${patientData.medicalRecordNumber}`);
  console.log(`  SSN: ${patientData.ssn}`);
  console.log(`  Address: ${patientData.address.street}, ${patientData.address.city}, ${patientData.address.state} ${patientData.address.zipCode}`);
  console.log(`  Phone: ${patientData.contact.phone}`);
  console.log(`  Email: ${patientData.contact.email}`);
  
  // Insurance Information
  console.log('\n🏥 PRIMARY INSURANCE:');
  console.log(`  Provider: ${insuranceData.primaryInsurance.provider}`);
  console.log(`  Policy Number: ${insuranceData.primaryInsurance.policyNumber}`);
  console.log(`  Group Number: ${insuranceData.primaryInsurance.groupNumber || 'N/A'}`);
  console.log(`  Member ID: ${insuranceData.primaryInsurance.memberId || 'N/A'}`);
  console.log(`  Effective Date: ${insuranceData.primaryInsurance.effectiveDate}`);
  console.log(`  Copay: ${insuranceData.primaryInsurance.copay || 'N/A'}`);
  console.log(`  Deductible: ${insuranceData.primaryInsurance.deductible || 'N/A'}`);
  
  if (insuranceData.secondaryInsured) {
    console.log('\n🏥 SECONDARY INSURANCE:');
    console.log(`  Insured: ${insuranceData.secondaryInsured.name}`);
    console.log(`  Policy: ${insuranceData.secondaryInsured.policyNumber}`);
    console.log(`  Plan: ${insuranceData.secondaryInsured.planName}`);
  }
  
  // Provider Information
  console.log('\n👨‍⚕️ PROVIDER:');
  console.log(`  Name: ${providerData.name}`);
  console.log(`  NPI: ${providerData.npi}`);
  console.log(`  Specialty: ${providerData.specialty}`);
  console.log(`  Facility: ${providerData.facilityName}`);
  console.log(`  Facility NPI: ${providerData.facilityNPI}`);
  console.log(`  Address: ${providerData.address.street}, ${providerData.address.city}, ${providerData.address.state} ${providerData.address.zipCode}`);
  console.log(`  Phone: ${providerData.phone}`);
  
  // Metadata
  console.log('\n📊 METADATA:');
  console.log(`  Data generated independently using modular functions`);
  console.log(`  Patient MRN: ${patientData.medicalRecordNumber}`);
  console.log(`  Provider NPI: ${providerData.npi}`);
  console.log(`  Insurance Policy: ${insuranceData.primaryInsurance.policyNumber}`);
  
  // Full JSON Output
  console.log('\n' + '='.repeat(70));
  console.log('\n📝 Full JSON Outputs:\n');
  console.log('Patient Data:');
  console.log(JSON.stringify(patientData, null, 2));
  console.log('\nProvider Data:');
  console.log(JSON.stringify(providerData, null, 2));
  console.log('\nInsurance Data:');
  console.log(JSON.stringify(insuranceData, null, 2));
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Azure OpenAI Configuration
    const config: AzureOpenAIConfig = {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
      apiKey: process.env.AZURE_OPENAI_API_KEY || '',
      deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '',
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview'
    };

    // Validate configuration
    if (!config.endpoint || !config.apiKey || !config.deploymentName) {
      throw new Error('Missing required Azure OpenAI configuration. Please check your .env file.');
    }

    console.log('\n🚀 Starting AI Data Generation Tests (Modular Approach)...');
    console.log(`📍 Endpoint: ${config.endpoint}`);
    console.log(`📦 Deployment: ${config.deploymentName}`);
    console.log(`📅 API Version: ${config.apiVersion}\n`);

    // Test modular data generation
    await testModularDataGeneration(config);

    console.log('\n' + '='.repeat(70));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error during test execution:');
    console.error(error);
    process.exit(1);
  }
}

// Run the tests
main();
