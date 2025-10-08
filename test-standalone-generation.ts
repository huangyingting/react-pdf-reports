/**
 * Test Standalone Data Generation
 * Demonstrates the new modular generation functions
 */

import { 
  generatePatientDataWithAI, 
  generateProviderDataWithAI,
  generateInsuranceDataWithAI 
} from './src/utils/aiDataGenerator';
import { AzureOpenAIConfig } from './src/utils/azureOpenAI';
import { loadAzureConfig } from './src/utils/azureConfigStorage';

/**
 * Test Patient Data Generation
 */
async function testPatientGeneration(config: AzureOpenAIConfig): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('🧑 Testing Standalone Patient Data Generation\n');
  
  const startTime = Date.now();
  
  // Test 1: Basic patient generation
  console.log('Test 1: Generating basic patient data...');
  const patient1 = await generatePatientDataWithAI(config);
  console.log(`✅ Generated: ${patient1.firstName} ${patient1.lastName}, Age: ${patient1.age}`);
  
  // Test 2: Patient with specific age range
  console.log('\nTest 2: Generating senior patient (age 65-85)...');
  const patient2 = await generatePatientDataWithAI(config, {
    ageRange: { min: 65, max: 85 }
  });
  console.log(`✅ Generated: ${patient2.firstName} ${patient2.lastName}, Age: ${patient2.age}`);
  
  // Test 3: Patient with specific gender
  console.log('\nTest 3: Generating female patient...');
  const patient3 = await generatePatientDataWithAI(config, {
    gender: 'Female'
  });
  console.log(`✅ Generated: ${patient3.firstName} ${patient3.lastName}, Gender: ${patient3.gender}`);
  
  const duration = Date.now() - startTime;
  console.log(`\n⏱️  Total time: ${duration}ms`);
  console.log('='.repeat(70));
}

/**
 * Test Provider Data Generation
 */
async function testProviderGeneration(config: AzureOpenAIConfig): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('👨‍⚕️ Testing Standalone Provider Data Generation\n');
  
  const startTime = Date.now();
  
  // Test 1: Basic provider generation
  console.log('Test 1: Generating basic provider...');
  const provider1 = await generateProviderDataWithAI(config);
  console.log(`✅ Generated: ${provider1.name}, Specialty: ${provider1.specialty}`);
  console.log(`   Facility: ${provider1.facilityName}`);
  
  // Test 2: Cardiologist
  console.log('\nTest 2: Generating cardiologist...');
  const provider2 = await generateProviderDataWithAI(config, {
    specialty: 'Cardiology'
  });
  console.log(`✅ Generated: ${provider2.name}, Specialty: ${provider2.specialty}`);
  
  // Test 3: Pediatrician with specific facility type
  console.log('\nTest 3: Generating pediatrician at Children\'s Hospital...');
  const provider3 = await generateProviderDataWithAI(config, {
    specialty: 'Pediatrics',
    facilityType: 'Children\'s Hospital'
  });
  console.log(`✅ Generated: ${provider3.name}, Specialty: ${provider3.specialty}`);
  console.log(`   Facility: ${provider3.facilityName}`);
  
  const duration = Date.now() - startTime;
  console.log(`\n⏱️  Total time: ${duration}ms`);
  console.log('='.repeat(70));
}

/**
 * Test Insurance Data Generation
 */
async function testInsuranceGeneration(config: AzureOpenAIConfig): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('🏥 Testing Standalone Insurance Data Generation\n');
  
  const startTime = Date.now();
  
  // Test 1: Basic insurance (primary only)
  console.log('Test 1: Generating primary insurance only...');
  const insurance1 = await generateInsuranceDataWithAI(config);
  console.log(`✅ Generated: ${insurance1.primaryInsurance.provider}`);
  console.log(`   Policy: ${insurance1.primaryInsurance.policyNumber}`);
  console.log(`   Secondary: ${insurance1.secondaryInsurance ? 'Yes' : 'No'}`);
  
  // Test 2: Insurance with secondary
  console.log('\nTest 2: Generating with secondary insurance...');
  const insurance2 = await generateInsuranceDataWithAI(config, {
    includeSecondary: true
  });
  console.log(`✅ Primary: ${insurance2.primaryInsurance.provider}`);
  console.log(`   Secondary: ${insurance2.secondaryInsurance?.provider || 'None'}`);
  
  // Test 3: Insurance with different subscriber
  console.log('\nTest 3: Generating with different subscriber...');
  const insurance3 = await generateInsuranceDataWithAI(config, {
    subscriberSameAsPatient: false
  });
  console.log(`✅ Generated: ${insurance3.primaryInsurance.provider}`);
  console.log(`   Subscriber: ${insurance3.subscriberName}`);
  
  const duration = Date.now() - startTime;
  console.log(`\n⏱️  Total time: ${duration}ms`);
  console.log('='.repeat(70));
}

/**
 * Test Combined Usage
 */
async function testCombinedUsage(config: AzureOpenAIConfig): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('🔗 Testing Combined Usage - Modular Assembly\n');
  
  const startTime = Date.now();
  
  // Generate components separately
  console.log('Generating patient data...');
  const patient = await generatePatientDataWithAI(config, {
    ageRange: { min: 40, max: 60 },
    gender: 'Male'
  });
  console.log(`✅ Patient: ${patient.firstName} ${patient.lastName}, Age: ${patient.age}`);
  
  console.log('\nGenerating provider data...');
  const provider = await generateProviderDataWithAI(config, {
    specialty: 'Internal Medicine'
  });
  console.log(`✅ Provider: ${provider.name}, ${provider.specialty}`);
  
  console.log('\nGenerating insurance data...');
  const insurance = await generateInsuranceDataWithAI(config, {
    includeSecondary: true
  });
  console.log(`✅ Insurance: ${insurance.primaryInsurance.provider}`);
  
  // Assemble into a complete record
  console.log('\n📋 Assembled Complete Medical Record:');
  console.log(`   Patient: ${patient.firstName} ${patient.lastName}`);
  console.log(`   Provider: ${provider.name} (${provider.specialty})`);
  console.log(`   Facility: ${provider.facilityName}`);
  console.log(`   Insurance: ${insurance.primaryInsurance.provider}`);
  if (insurance.secondaryInsurance) {
    console.log(`   Secondary: ${insurance.secondaryInsurance.provider}`);
  }
  
  const duration = Date.now() - startTime;
  console.log(`\n⏱️  Total time: ${duration}ms`);
  console.log('='.repeat(70));
}

/**
 * Main test runner
 */
async function main(): Promise<void> {
  console.log('🚀 Standalone Data Generation Test Suite');
  console.log('Testing new modular generation functions\n');
  
  // Load Azure config
  const config = loadAzureConfig();
  if (!config) {
    console.error('❌ No Azure OpenAI configuration found!');
    console.error('Please configure Azure OpenAI settings first.');
    process.exit(1);
  }
  
  console.log('✅ Azure OpenAI configuration loaded');
  console.log(`   Endpoint: ${config.endpoint}`);
  console.log(`   Deployment: ${config.deploymentName}`);
  
  try {
    // Run all tests
    await testPatientGeneration(config);
    await testProviderGeneration(config);
    await testInsuranceGeneration(config);
    await testCombinedUsage(config);
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n' + '='.repeat(70));
    console.error('❌ Test failed:', error);
    console.error('='.repeat(70));
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main };
