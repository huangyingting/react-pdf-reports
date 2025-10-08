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
  generatePatientDataWithAI,
  generateProviderDataWithAI,
  generateInsuranceDataWithAI,
  generateCMS1500DataWithAI,
  generateInsurancePolicyDataWithAI,
  generateVisitReportDataWithAI,
  generateMedicalHistoryDataWithAI,
  generateLaboratoryReportDataWithAI
} from './src/utils/aiDataGenerator';
import { AzureOpenAIConfig } from './src/utils/azureOpenAI';
import { PatientData, ProviderData, InsuranceData } from './src/utils/types';

/**
 * Test Modular Data Generation (New Approach)
 * 
 * Generates patient, provider, and insurance data separately.
 * This demonstrates the new modular approach for more flexibility.
 */
async function testModularDataGeneration(config: AzureOpenAIConfig): Promise<{
  patientData: PatientData;
  providerData: ProviderData;
  insuranceData: InsuranceData;
}> {
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
  console.log(`  Name: ${patientData.patient.name}`);
  console.log(`  Age: ${patientData.patient.age} years`);
  console.log(`  Gender: ${patientData.patient.gender}`);
  console.log(`  DOB: ${patientData.patient.dateOfBirth}`);
  console.log(`  MRN: ${patientData.patient.medicalRecordNumber}`);
  console.log(`  SSN: ${patientData.patient.ssn}`);
  console.log(`  Address: ${patientData.patient.address.street}, ${patientData.patient.address.city}, ${patientData.patient.address.state} ${patientData.patient.address.zipCode}`);
  console.log(`  Phone: ${patientData.patient.contact.phone}`);
  console.log(`  Email: ${patientData.patient.contact.email}`);
  
  // Insurance Information
  console.log('\n🏥 PRIMARY INSURANCE:');
  console.log(`  Provider: ${insuranceData.insurance.primaryInsurance.provider}`);
  console.log(`  Policy Number: ${insuranceData.insurance.primaryInsurance.policyNumber}`);
  console.log(`  Group Number: ${insuranceData.insurance.primaryInsurance.groupNumber || 'N/A'}`);
  console.log(`  Member ID: ${insuranceData.insurance.primaryInsurance.memberId || 'N/A'}`);
  console.log(`  Effective Date: ${insuranceData.insurance.primaryInsurance.effectiveDate}`);
  console.log(`  Copay: ${insuranceData.insurance.primaryInsurance.copay || 'N/A'}`);
  console.log(`  Deductible: ${insuranceData.insurance.primaryInsurance.deductible || 'N/A'}`);
  
  if (insuranceData.insurance.secondaryInsured) {
    console.log('\n🏥 SECONDARY INSURANCE:');
    console.log(`  Insured: ${insuranceData.insurance.secondaryInsured.name}`);
    console.log(`  Policy: ${insuranceData.insurance.secondaryInsured.policyNumber}`);
    console.log(`  Plan: ${insuranceData.insurance.secondaryInsured.planName}`);
  }
  
  // Provider Information
  console.log('\n👨‍⚕️ PROVIDER:');
  console.log(`  Name: ${providerData.provider.name}`);
  console.log(`  NPI: ${providerData.provider.npi}`);
  console.log(`  Specialty: ${providerData.provider.specialty}`);
  console.log(`  Facility: ${providerData.provider.facilityName}`);
  console.log(`  Facility NPI: ${providerData.provider.facilityNPI}`);
  console.log(`  Address: ${providerData.provider.address.street}, ${providerData.provider.address.city}, ${providerData.provider.address.state} ${providerData.provider.address.zipCode}`);
  console.log(`  Phone: ${providerData.provider.phone}`);
  
  // Metadata
  console.log('\n📊 METADATA:');
  console.log(`  Patient Generated At: ${patientData.generatedAt}`);
  console.log(`  Provider Generated At: ${providerData.generatedAt}`);
  console.log(`  Insurance Generated At: ${insuranceData.generatedAt}`);
  
  // Full JSON Output
  console.log('\n' + '='.repeat(70));
  console.log('\n📝 Full JSON Outputs:\n');
  console.log('Patient Data:');
  console.log(JSON.stringify(patientData, null, 2));
  console.log('\nProvider Data:');
  console.log(JSON.stringify(providerData, null, 2));
  console.log('\nInsurance Data:');
  console.log(JSON.stringify(insuranceData, null, 2));
  
  return { patientData, providerData, insuranceData };
}

/**
 * Test Basic Data Generation (Legacy - Deprecated)
 * 
 * @deprecated This function uses the deprecated generateBasicDataWithAI.
 * Use testModularDataGeneration instead for the new modular approach.
 */
async function testBasicDataGeneration_Legacy(config: AzureOpenAIConfig): Promise<{
  console.log('\n' + '='.repeat(70));
  console.log('🔄 Generating Basic Medical Data (Low Complexity)...\n');

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
  
  return basicData;
}

/**
 * Test CMS-1500 Form Generation
 */
async function testCMS1500Generation(config: AzureOpenAIConfig, basicData: BasicData): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 Testing CMS-1500 Data Generation...\n');
  
  const startTime = Date.now();
  const cms1500Data: any = await generateCMS1500DataWithAI(config, basicData);
  const duration = Date.now() - startTime;

  console.log(`✅ CMS-1500 data generated in ${duration}ms\n`);
  console.log('📋 CMS-1500 CLAIM SUMMARY:');
  console.log(`  Patient Control Number: ${cms1500Data.patientControlNumber || 'N/A'}`);
  console.log(`  Service Lines: ${cms1500Data.serviceLines?.length || 0}`);
  
  if (cms1500Data.serviceLines && cms1500Data.serviceLines.length > 0) {
    console.log('\n  Service Details:');
    cms1500Data.serviceLines.forEach((line: any, idx: number) => {
      console.log(`    ${idx + 1}. Date: ${line.dateOfService}`);
      console.log(`       Procedure: ${line.procedureCode} - ${line.description || 'N/A'}`);
      console.log(`       Charge: $${line.charges}`);
      console.log(`       Diagnosis Pointers: ${line.diagnosisPointers?.join(', ') || 'N/A'}`);
    });
  }
  
  console.log('\n📝 Full CMS-1500 JSON:\n');
  console.log(JSON.stringify(cms1500Data, null, 2));
}

/**
 * Test Insurance Policy Generation
 */
async function testInsurancePolicyGeneration(config: AzureOpenAIConfig, basicData: BasicData): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 Testing Insurance Policy Data Generation...\n');
  
  const startTime = Date.now();
  const policyData: any = await generateInsurancePolicyDataWithAI(config, basicData);
  const duration = Date.now() - startTime;

  console.log(`✅ Insurance Policy data generated in ${duration}ms\n`);
  console.log('🏥 INSURANCE POLICY SUMMARY:');
  
  // Patient information
  console.log('\n📋 PATIENT:');
  console.log(`  Name: ${policyData.patient.name}`);
  console.log(`  DOB: ${policyData.patient.dateOfBirth}`);
  console.log(`  MRN: ${policyData.patient.medicalRecordNumber}`);
  
  // Insurance information
  console.log('\n💳 PRIMARY INSURANCE:');
  console.log(`  Provider: ${policyData.insurance.primaryInsurance.provider}`);
  console.log(`  Policy Number: ${policyData.insurance.primaryInsurance.policyNumber}`);
  console.log(`  Group Number: ${policyData.insurance.primaryInsurance.groupNumber || 'N/A'}`);
  console.log(`  Member ID: ${policyData.insurance.primaryInsurance.memberId || 'N/A'}`);
  console.log(`  Effective Date: ${policyData.insurance.primaryInsurance.effectiveDate}`);
  console.log(`  Copay: ${policyData.insurance.primaryInsurance.copay || 'N/A'}`);
  console.log(`  Deductible: ${policyData.insurance.primaryInsurance.deductible || 'N/A'}`);
  
  if (policyData.insurance.secondaryInsurance) {
    console.log('\n💳 SECONDARY INSURANCE:');
    console.log(`  Provider: ${policyData.insurance.secondaryInsurance.provider}`);
    console.log(`  Policy Number: ${policyData.insurance.secondaryInsurance.policyNumber}`);
    console.log(`  Group Number: ${policyData.insurance.secondaryInsurance.groupNumber || 'N/A'}`);
  }
  
  if (policyData.insurance.subscriberName && policyData.insurance.subscriberName !== policyData.patient.name) {
    console.log('\n👤 SUBSCRIBER (if different from patient):');
    console.log(`  Name: ${policyData.insurance.subscriberName}`);
    console.log(`  DOB: ${policyData.insurance.subscriberDOB || 'N/A'}`);
    console.log(`  Gender: ${policyData.insurance.subscriberGender || 'N/A'}`);
  }
  
  console.log('\n📝 Full Insurance Policy JSON:\n');
  console.log(JSON.stringify(policyData, null, 2));
}

/**
 * Test Visit Report Generation
 */
async function testVisitReportGeneration(config: AzureOpenAIConfig, basicData: BasicData): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 Testing Visit Report Data Generation (3 visits)...\n');
  
  const startTime = Date.now();
  const visitReports: any[] = await generateVisitReportDataWithAI(config, basicData, 3);
  const duration = Date.now() - startTime;

  console.log(`✅ ${visitReports.length} Visit Report(s) generated in ${duration}ms\n`);
  
  visitReports.forEach((visit: any, idx: number) => {
    console.log(`\n📋 VISIT ${idx + 1}:`);
    console.log(`  Date: ${visit.visit.date}`);
    console.log(`  Chief Complaint: ${visit.visit.chiefComplaint}`);
    console.log(`  Provider: ${visit.visit.provider || basicData.provider.name}`);
    
    if (visit.vitalSigns) {
      console.log(`  Vital Signs:`);
      console.log(`    BP: ${visit.vitalSigns.bloodPressure || 'N/A'}`);
      console.log(`    HR: ${visit.vitalSigns.heartRate || 'N/A'} bpm`);
      console.log(`    Temp: ${visit.vitalSigns.temperature || 'N/A'}°F`);
      console.log(`    SpO2: ${visit.vitalSigns.oxygenSaturation || 'N/A'}%`);
    }
    
    if (visit.assessment && visit.assessment.length > 0) {
      console.log(`  Assessment: ${visit.assessment.length} diagnosis(es)`);
      visit.assessment.forEach((dx: any, i: number) => {
        console.log(`    ${i + 1}. ${dx.diagnosis || dx} (${dx.icd10Code || 'N/A'})`);
      });
    }
    
    console.log('\n  Full Visit JSON (truncated):');
    console.log(JSON.stringify(visit, null, 2).substring(0, 500) + '...');
  });
}

/**
 * Test Medical History Generation
 */
async function testMedicalHistoryGeneration(config: AzureOpenAIConfig, basicData: BasicData): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 Testing Medical History Data Generation (Medium Complexity)...\n');
  
  const startTime = Date.now();
  const medicalHistory: any = await generateMedicalHistoryDataWithAI(config, basicData, 'medium');
  const duration = Date.now() - startTime;

  console.log(`✅ Medical History data generated in ${duration}ms\n`);
  console.log('📜 MEDICAL HISTORY SUMMARY:');
  
  if (medicalHistory.allergies && medicalHistory.allergies.length > 0) {
    console.log(`\n  Allergies: ${medicalHistory.allergies.length}`);
    medicalHistory.allergies.forEach((allergy: any) => {
      console.log(`    - ${allergy.allergen || allergy.medication}: ${allergy.reaction} (${allergy.severity})`);
    });
  }
  
  if (medicalHistory.conditions && medicalHistory.conditions.length > 0) {
    console.log(`\n  Medical Conditions: ${medicalHistory.conditions.length}`);
    medicalHistory.conditions.slice(0, 5).forEach((condition: any) => {
      console.log(`    - ${condition.condition || condition.name} (${condition.icd10Code || 'N/A'}) - ${condition.status}`);
    });
  }
  
  if (medicalHistory.medications && medicalHistory.medications.length > 0) {
    console.log(`\n  Medications: ${medicalHistory.medications.length}`);
    medicalHistory.medications.slice(0, 5).forEach((med: any) => {
      console.log(`    - ${med.medication || med.name}: ${med.dosage} ${med.frequency}`);
    });
  }
  
  if (medicalHistory.surgicalHistory && medicalHistory.surgicalHistory.length > 0) {
    console.log(`\n  Surgical History: ${medicalHistory.surgicalHistory.length}`);
    medicalHistory.surgicalHistory.forEach((surgery: any) => {
      console.log(`    - ${surgery.procedure} (${surgery.date})`);
    });
  }
  
  if (medicalHistory.familyHistory && medicalHistory.familyHistory.length > 0) {
    console.log(`\n  Family History: ${medicalHistory.familyHistory.length} entries`);
    medicalHistory.familyHistory.slice(0, 3).forEach((family: any) => {
      console.log(`    - ${family.relationship}: ${family.condition}`);
    });
  }
  
  if (medicalHistory.socialHistory) {
    console.log(`\n  Social History:`);
    console.log(`    Smoking: ${medicalHistory.socialHistory.smoking || 'N/A'}`);
    console.log(`    Alcohol: ${medicalHistory.socialHistory.alcohol || 'N/A'}`);
    console.log(`    Exercise: ${medicalHistory.socialHistory.exercise || 'N/A'}`);
  }
  
  console.log('\n📝 Full Medical History JSON:\n');
  console.log(JSON.stringify(medicalHistory, null, 2));
}

/**
 * Test Laboratory Report Generation
 */
async function testLaboratoryReportGeneration(config: AzureOpenAIConfig, basicData: BasicData): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 Testing Laboratory Report Data Generation (one by one)...\n');
  
  const testTypes = ['CBC', 'BMP', 'Lipid Panel'];
  const startTime = Date.now();
  
  // Generate with progress callback
  const labReports: Map<string, any> = await generateLaboratoryReportDataWithAI(
    config, 
    basicData, 
    testTypes,
    undefined, // use default cache config
    (testType, report, current, total) => {
      if (report) {
        console.log(`  ✅ Progress: ${testType} generated (${current}/${total})`);
      } else {
        console.log(`  ❌ Progress: ${testType} failed (${current}/${total})`);
      }
    }
  );
  
  const duration = Date.now() - startTime;

  console.log(`✅ ${labReports.size} Laboratory Report(s) generated in ${duration}ms\n`);
  
  labReports.forEach((report: any, testType: string) => {
    console.log(`\n🔬 ${testType.toUpperCase()}:`);
    console.log(`  Test Name: ${report.testName || testType}`);
    console.log(`  Specimen: ${report.specimenType || 'N/A'}`);
    console.log(`  Collection Date: ${report.collectionDate}`);
    console.log(`  Report Date: ${report.reportDate}`);
    
    if (report.results && report.results.length > 0) {
      console.log(`  Results: ${report.results.length} parameters`);
      report.results.slice(0, 5).forEach((result: any) => {
        const flag = result.flag ? ` [${result.flag}]` : '';
        console.log(`    - ${result.parameter}: ${result.value} ${result.unit} (Ref: ${result.referenceRange})${flag}`);
      });
      if (report.results.length > 5) {
        console.log(`    ... and ${report.results.length - 5} more`);
      }
    }
    
    if (report.criticalValues && report.criticalValues.length > 0) {
      console.log(`  ⚠️  Critical Values: ${report.criticalValues.length}`);
      report.criticalValues.forEach((critical: any) => {
        console.log(`    - ${critical}`);
      });
    }
    
    console.log('\n  Full Report JSON (truncated):');
    console.log(JSON.stringify(report, null, 2).substring(0, 500) + '...');
  });
}

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

  // Run tests sequentially
  let basicData: BasicData;
  
  try {
    // Test 1: Basic Data Generation
    basicData = await testBasicDataGeneration(config);
    console.log('\n' + '='.repeat(70));
    console.log('✅ Basic Data test completed successfully!');
    console.log('='.repeat(70) + '\n');
  } catch (error) {
    console.error('\n❌ Error in Basic Data Generation test:');
    console.error(error);
    process.exit(1);
  }

  // Test 2: CMS-1500 Generation
  try {
    await testCMS1500Generation(config, basicData);
  } catch (error) {
    console.error('\n❌ Error in CMS-1500 Generation test:');
    console.error(error);
  }

  // Test 3: Insurance Policy Generation
  try {
    await testInsurancePolicyGeneration(config, basicData);
  } catch (error) {
    console.error('\n❌ Error in Insurance Policy Generation test:');
    console.error(error);
  }

  // Test 4: Visit Report Generation
  try {
    await testVisitReportGeneration(config, basicData);
  } catch (error) {
    console.error('\n❌ Error in Visit Report Generation test:');
    console.error(error);
  }

  // Test 5: Medical History Generation
  try {
    await testMedicalHistoryGeneration(config, basicData);
  } catch (error) {
    console.error('\n❌ Error in Medical History Generation test:');
    console.error(error);
  }

  // Test 6: Laboratory Report Generation
  try {
    await testLaboratoryReportGeneration(config, basicData);
  } catch (error) {
    console.error('\n❌ Error in Laboratory Report Generation test:');
    console.error(error);
  }

  // // Final summary
  // console.log('\n' + '='.repeat(70));
  // console.log('✅ All tests completed!');
  // console.log('='.repeat(70));
  // console.log('\n📊 Test Summary:');
  // console.log('  ✅ Basic Data Generation');
  // console.log('  ✅ CMS-1500 Form Generation');
  // console.log('  ✅ Insurance Policy Generation');
  // console.log('  ✅ Visit Report Generation');
  // console.log('  ✅ Medical History Generation');
  // console.log('  ✅ Laboratory Report Generation');
  // console.log('\n' + '='.repeat(70) + '\n');
}

main();
