/**
 * Simple Test Script for AI Data Generator
 * 
 * Tests all AI data generation functions with Azure OpenAI
 * 
 * Usage:
 *   npx tsx simple-test-ai.ts
 */

import 'dotenv/config';
import { 
  generateBasicDataWithAI,
  generateCMS1500DataWithAI,
  generateInsurancePolicyDataWithAI,
  generateVisitReportDataWithAI,
  generateMedicalHistoryDataWithAI,
  generateLaboratoryReportDataWithAI
} from './src/utils/aiDataGenerator';
import { AzureOpenAIConfig } from './src/utils/azureOpenAI';
import { BasicData } from './src/utils/types';

async function main() {
  console.log('🧪 Testing AI Data Generator\n');
  console.log('='.repeat(70));
  
  // Check environment variables
  const endpoint = process.env.VITE_AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.VITE_AZURE_OPENAI_API_KEY;
  const deploymentName = process.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME;
  const apiVersion = process.env.VITE_AZURE_OPENAI_API_VERSION || '2024-08-01-preview';

  console.log('\n📋 Configuration:');
  console.log(`  Endpoint: ${endpoint ? '✅ Set' : '❌ Missing'}`);
  console.log(`  API Key: ${apiKey ? `✅ Set (${apiKey.substring(0, 10)}...)` : '❌ Missing'}`);
  console.log(`  Deployment: ${deploymentName || '❌ Missing'}`);
  console.log(`  API Version: ${apiVersion}`);

  if (!endpoint || !apiKey || !deploymentName) {
    console.error('\n❌ Error: Missing required environment variables!');
    console.error('Please configure your .env file. See .env.example for reference.\n');
    process.exit(1);
  }

  const config: AzureOpenAIConfig = {
    endpoint,
    apiKey,
    deploymentName,
    apiVersion
  };

  console.log('\n' + '='.repeat(70));
  console.log('🔄 Generating Basic Medical Data (Low Complexity)...\n');

  try {
    const startTime = Date.now();
    const basicData = await generateBasicDataWithAI(config, 'low');
    const duration = Date.now() - startTime;

    console.log(`✅ Success! Generated in ${duration}ms\n`);
    console.log('='.repeat(70));
    console.log('\n📄 Generated Medical Record:\n');
    
    // Patient Information
    console.log('👤 PATIENT:');
    console.log(`  Name: ${basicData.patient.name}`);
    console.log(`  Age: ${basicData.patient.age} years`);
    console.log(`  Gender: ${basicData.patient.gender}`);
    console.log(`  DOB: ${basicData.patient.dateOfBirth}`);
    console.log(`  MRN: ${basicData.patient.medicalRecordNumber}`);
    console.log(`  SSN: ${basicData.patient.ssn}`);
    console.log(`  Address: ${basicData.patient.address.street}, ${basicData.patient.address.city}, ${basicData.patient.address.state} ${basicData.patient.address.zipCode}`);
    console.log(`  Phone: ${basicData.patient.contact.phone}`);
    console.log(`  Email: ${basicData.patient.contact.email}`);
    
    // Insurance Information
    console.log('\n🏥 PRIMARY INSURANCE:');
    console.log(`  Provider: ${basicData.insurance.primaryInsurance.provider}`);
    console.log(`  Policy Number: ${basicData.insurance.primaryInsurance.policyNumber}`);
    console.log(`  Group Number: ${basicData.insurance.primaryInsurance.groupNumber || 'N/A'}`);
    console.log(`  Member ID: ${basicData.insurance.primaryInsurance.memberId || 'N/A'}`);
    console.log(`  Effective Date: ${basicData.insurance.primaryInsurance.effectiveDate}`);
    console.log(`  Copay: ${basicData.insurance.primaryInsurance.copay || 'N/A'}`);
    console.log(`  Deductible: ${basicData.insurance.primaryInsurance.deductible || 'N/A'}`);
    
    if (basicData.insurance.secondaryInsured) {
      console.log('\n🏥 SECONDARY INSURANCE:');
      console.log(`  Insured: ${basicData.insurance.secondaryInsured.name}`);
      console.log(`  Policy: ${basicData.insurance.secondaryInsured.policyNumber}`);
      console.log(`  Plan: ${basicData.insurance.secondaryInsured.planName}`);
    }
    
    // Provider Information
    console.log('\n👨‍⚕️ PROVIDER:');
    console.log(`  Name: ${basicData.provider.name}`);
    console.log(`  NPI: ${basicData.provider.npi}`);
    console.log(`  Specialty: ${basicData.provider.specialty}`);
    console.log(`  Facility: ${basicData.provider.facilityName}`);
    console.log(`  Facility NPI: ${basicData.provider.facilityNPI}`);
    console.log(`  Address: ${basicData.provider.address.street}, ${basicData.provider.address.city}, ${basicData.provider.address.state} ${basicData.provider.address.zipCode}`);
    console.log(`  Phone: ${basicData.provider.phone}`);
    
    // Metadata
    console.log('\n📊 METADATA:');
    console.log(`  Generated At: ${basicData.generatedAt}`);
    
    // Full JSON Output
    console.log('\n' + '='.repeat(70));
    console.log('\n📝 Full JSON Output:\n');
    console.log(JSON.stringify(basicData, null, 2));
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Test completed successfully!');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error generating data:');
    console.error(error);
    process.exit(1);
  }
}

main();
