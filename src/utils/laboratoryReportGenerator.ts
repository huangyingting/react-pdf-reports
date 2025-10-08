import { faker } from '@faker-js/faker';
import { 
  PatientDemographics, 
  Provider,
  BasicData,
  LaboratoryReportData,
  LabTestType,
  LabTestResult,
  MEDICAL_SPECIALTIES,
  FACILITY_NAMES,
  INSURANCE_COMPANIES,
} from './types';

// Lab test panel definitions with realistic reference ranges
const LAB_TEST_PANELS = {
  CBC: {
    name: 'Complete Blood Count (CBC) with Differential',
    specimenType: 'Whole Blood (EDTA)',
    tests: [
      { parameter: 'White Blood Cell Count (WBC)', unit: '×10³/µL', range: '4.5-11.0', normalRange: [4.5, 11.0] },
      { parameter: 'Red Blood Cell Count (RBC)', unit: '×10⁶/µL', range: '4.20-5.80 (M), 3.90-5.20 (F)', normalRange: [3.9, 5.8] },
      { parameter: 'Hemoglobin (Hgb)', unit: 'g/dL', range: '13.5-17.5 (M), 12.0-16.0 (F)', normalRange: [12.0, 17.5] },
      { parameter: 'Hematocrit (Hct)', unit: '%', range: '40-52 (M), 36-46 (F)', normalRange: [36, 52] },
      { parameter: 'Mean Corpuscular Volume (MCV)', unit: 'fL', range: '80-100', normalRange: [80, 100] },
      { parameter: 'Mean Corpuscular Hemoglobin (MCH)', unit: 'pg', range: '27-33', normalRange: [27, 33] },
      { parameter: 'Mean Corpuscular Hemoglobin Concentration (MCHC)', unit: 'g/dL', range: '32-36', normalRange: [32, 36] },
      { parameter: 'Red Cell Distribution Width (RDW)', unit: '%', range: '11.5-14.5', normalRange: [11.5, 14.5] },
      { parameter: 'Platelet Count', unit: '×10³/µL', range: '150-400', normalRange: [150, 400] },
      { parameter: 'Mean Platelet Volume (MPV)', unit: 'fL', range: '7.5-11.5', normalRange: [7.5, 11.5] },
      { parameter: 'Neutrophils', unit: '%', range: '40-70', normalRange: [40, 70] },
      { parameter: 'Lymphocytes', unit: '%', range: '20-45', normalRange: [20, 45] },
      { parameter: 'Monocytes', unit: '%', range: '2-10', normalRange: [2, 10] },
      { parameter: 'Eosinophils', unit: '%', range: '1-6', normalRange: [1, 6] },
      { parameter: 'Basophils', unit: '%', range: '0-2', normalRange: [0, 2] }
    ]
  },
  BMP: {
    name: 'Basic Metabolic Panel (BMP)',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Glucose', unit: 'mg/dL', range: '70-100 (fasting)', normalRange: [70, 100] },
      { parameter: 'Calcium', unit: 'mg/dL', range: '8.5-10.5', normalRange: [8.5, 10.5] },
      { parameter: 'Sodium', unit: 'mEq/L', range: '136-145', normalRange: [136, 145] },
      { parameter: 'Potassium', unit: 'mEq/L', range: '3.5-5.0', normalRange: [3.5, 5.0] },
      { parameter: 'Chloride', unit: 'mEq/L', range: '98-107', normalRange: [98, 107] },
      { parameter: 'Carbon Dioxide (CO2)', unit: 'mEq/L', range: '23-29', normalRange: [23, 29] },
      { parameter: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', range: '7-20', normalRange: [7, 20] },
      { parameter: 'Creatinine', unit: 'mg/dL', range: '0.7-1.3 (M), 0.6-1.1 (F)', normalRange: [0.6, 1.3] }
    ]
  },
  CMP: {
    name: 'Comprehensive Metabolic Panel (CMP)',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Glucose', unit: 'mg/dL', range: '70-100 (fasting)', normalRange: [70, 100] },
      { parameter: 'Calcium', unit: 'mg/dL', range: '8.5-10.5', normalRange: [8.5, 10.5] },
      { parameter: 'Sodium', unit: 'mEq/L', range: '136-145', normalRange: [136, 145] },
      { parameter: 'Potassium', unit: 'mEq/L', range: '3.5-5.0', normalRange: [3.5, 5.0] },
      { parameter: 'Chloride', unit: 'mEq/L', range: '98-107', normalRange: [98, 107] },
      { parameter: 'Carbon Dioxide (CO2)', unit: 'mEq/L', range: '23-29', normalRange: [23, 29] },
      { parameter: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', range: '7-20', normalRange: [7, 20] },
      { parameter: 'Creatinine', unit: 'mg/dL', range: '0.7-1.3 (M), 0.6-1.1 (F)', normalRange: [0.6, 1.3] },
      { parameter: 'Albumin', unit: 'g/dL', range: '3.5-5.5', normalRange: [3.5, 5.5] },
      { parameter: 'Total Protein', unit: 'g/dL', range: '6.0-8.3', normalRange: [6.0, 8.3] },
      { parameter: 'Alkaline Phosphatase (ALP)', unit: 'U/L', range: '30-120', normalRange: [30, 120] },
      { parameter: 'Alanine Aminotransferase (ALT)', unit: 'U/L', range: '7-56', normalRange: [7, 56] },
      { parameter: 'Aspartate Aminotransferase (AST)', unit: 'U/L', range: '10-40', normalRange: [10, 40] },
      { parameter: 'Total Bilirubin', unit: 'mg/dL', range: '0.1-1.2', normalRange: [0.1, 1.2] }
    ]
  },
  Urinalysis: {
    name: 'Urinalysis, Complete',
    specimenType: 'Random Urine',
    tests: [
      { parameter: 'Color', unit: '', range: 'Yellow', normalRange: [0, 0], categorical: ['Yellow', 'Pale Yellow', 'Amber'] },
      { parameter: 'Appearance', unit: '', range: 'Clear', normalRange: [0, 0], categorical: ['Clear', 'Slightly Cloudy', 'Cloudy'] },
      { parameter: 'Specific Gravity', unit: '', range: '1.005-1.030', normalRange: [1.005, 1.030] },
      { parameter: 'pH', unit: '', range: '4.5-8.0', normalRange: [4.5, 8.0] },
      { parameter: 'Glucose', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'Protein', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'Ketones', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'Blood', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'Bilirubin', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Positive'] },
      { parameter: 'Urobilinogen', unit: 'EU/dL', range: '0.1-1.0', normalRange: [0.1, 1.0] },
      { parameter: 'Nitrite', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Positive'] },
      { parameter: 'Leukocyte Esterase', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'WBC', unit: '/HPF', range: '0-5', normalRange: [0, 5] },
      { parameter: 'RBC', unit: '/HPF', range: '0-2', normalRange: [0, 2] },
      { parameter: 'Epithelial Cells', unit: '/HPF', range: 'Few', normalRange: [0, 0], categorical: ['Few', 'Moderate', 'Many'] },
      { parameter: 'Bacteria', unit: '', range: 'None', normalRange: [0, 0], categorical: ['None', 'Few', 'Moderate', 'Many'] }
    ]
  },
  Lipid: {
    name: 'Lipid Panel (Fasting)',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Total Cholesterol', unit: 'mg/dL', range: '<200 Desirable', normalRange: [120, 200] },
      { parameter: 'Triglycerides', unit: 'mg/dL', range: '<150 Desirable', normalRange: [50, 150] },
      { parameter: 'HDL Cholesterol', unit: 'mg/dL', range: '>40 (M), >50 (F)', normalRange: [40, 80] },
      { parameter: 'LDL Cholesterol (calculated)', unit: 'mg/dL', range: '<100 Optimal', normalRange: [50, 100] },
      { parameter: 'VLDL Cholesterol', unit: 'mg/dL', range: '5-40', normalRange: [5, 40] },
      { parameter: 'Total/HDL Cholesterol Ratio', unit: '', range: '<5.0', normalRange: [2.0, 5.0] },
      { parameter: 'Non-HDL Cholesterol', unit: 'mg/dL', range: '<130', normalRange: [70, 130] }
    ]
  },
  LFT: {
    name: 'Liver Function Panel',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Total Protein', unit: 'g/dL', range: '6.0-8.3', normalRange: [6.0, 8.3] },
      { parameter: 'Albumin', unit: 'g/dL', range: '3.5-5.5', normalRange: [3.5, 5.5] },
      { parameter: 'Globulin', unit: 'g/dL', range: '2.0-3.5', normalRange: [2.0, 3.5] },
      { parameter: 'Albumin/Globulin Ratio', unit: '', range: '1.0-2.5', normalRange: [1.0, 2.5] },
      { parameter: 'Total Bilirubin', unit: 'mg/dL', range: '0.1-1.2', normalRange: [0.1, 1.2] },
      { parameter: 'Direct Bilirubin', unit: 'mg/dL', range: '0.0-0.3', normalRange: [0.0, 0.3] },
      { parameter: 'Indirect Bilirubin', unit: 'mg/dL', range: '0.1-1.0', normalRange: [0.1, 1.0] },
      { parameter: 'Alkaline Phosphatase (ALP)', unit: 'U/L', range: '30-120', normalRange: [30, 120] },
      { parameter: 'Alanine Aminotransferase (ALT)', unit: 'U/L', range: '7-56', normalRange: [7, 56] },
      { parameter: 'Aspartate Aminotransferase (AST)', unit: 'U/L', range: '10-40', normalRange: [10, 40] },
      { parameter: 'Gamma-Glutamyl Transferase (GGT)', unit: 'U/L', range: '9-48', normalRange: [9, 48] }
    ]
  },
  Thyroid: {
    name: 'Thyroid Function Panel',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Thyroid Stimulating Hormone (TSH)', unit: 'µIU/mL', range: '0.4-4.0', normalRange: [0.4, 4.0] },
      { parameter: 'Free Thyroxine (Free T4)', unit: 'ng/dL', range: '0.8-1.8', normalRange: [0.8, 1.8] },
      { parameter: 'Free Triiodothyronine (Free T3)', unit: 'pg/mL', range: '2.3-4.2', normalRange: [2.3, 4.2] },
      { parameter: 'Total T4', unit: 'µg/dL', range: '4.5-12.0', normalRange: [4.5, 12.0] },
      { parameter: 'Total T3', unit: 'ng/dL', range: '80-200', normalRange: [80, 200] },
      { parameter: 'Thyroid Peroxidase Antibody (TPO)', unit: 'IU/mL', range: '<35', normalRange: [0, 35] }
    ]
  },
  HbA1c: {
    name: 'Hemoglobin A1c (Glycated Hemoglobin)',
    specimenType: 'Whole Blood (EDTA)',
    tests: [
      { parameter: 'Hemoglobin A1c', unit: '%', range: '<5.7 Normal, 5.7-6.4 Prediabetes, ≥6.5 Diabetes', normalRange: [4.0, 5.7] },
      { parameter: 'Estimated Average Glucose (eAG)', unit: 'mg/dL', range: '97 (corresponds to 5% A1c)', normalRange: [70, 126] }
    ]
  },
  Coagulation: {
    name: 'Coagulation Panel',
    specimenType: 'Citrated Plasma',
    tests: [
      { parameter: 'Prothrombin Time (PT)', unit: 'seconds', range: '11.0-13.5', normalRange: [11.0, 13.5] },
      { parameter: 'International Normalized Ratio (INR)', unit: '', range: '0.8-1.2', normalRange: [0.8, 1.2] },
      { parameter: 'Activated Partial Thromboplastin Time (aPTT)', unit: 'seconds', range: '25-35', normalRange: [25, 35] },
      { parameter: 'Fibrinogen', unit: 'mg/dL', range: '200-400', normalRange: [200, 400] },
      { parameter: 'D-Dimer', unit: 'µg/mL FEU', range: '<0.50', normalRange: [0, 0.5] },
      { parameter: 'Platelet Count', unit: '×10³/µL', range: '150-400', normalRange: [150, 400] }
    ]
  },
  Microbiology: {
    name: 'Microbiology Culture and Sensitivity',
    specimenType: 'Various (Blood, Urine, Wound, Throat)',
    tests: [
      { parameter: 'Culture Source', unit: '', range: 'Various', normalRange: [0, 0], categorical: ['Blood', 'Urine', 'Wound', 'Throat', 'Sputum'] },
      { parameter: 'Gram Stain', unit: '', range: 'Various', normalRange: [0, 0], categorical: ['No organisms seen', 'Gram positive cocci', 'Gram negative rods', 'Mixed flora'] },
      { parameter: 'Culture Result', unit: '', range: 'Various', normalRange: [0, 0], categorical: ['No growth', 'Normal flora', 'E. coli', 'S. aureus', 'Streptococcus', 'Enterococcus'] },
      { parameter: 'Colony Count', unit: 'CFU/mL', range: 'Variable', normalRange: [0, 100000] }
    ]
  },
  Pathology: {
    name: 'Surgical Pathology Report',
    specimenType: 'Tissue Biopsy',
    tests: [
      { parameter: 'Specimen Type', unit: '', range: 'Various', normalRange: [0, 0], categorical: ['Skin biopsy', 'Colon polyp', 'Breast biopsy', 'Lymph node'] },
      { parameter: 'Gross Description', unit: '', range: 'Descriptive', normalRange: [0, 0] },
      { parameter: 'Microscopic Description', unit: '', range: 'Descriptive', normalRange: [0, 0] },
      { parameter: 'Diagnosis', unit: '', range: 'Various', normalRange: [0, 0] }
    ]
  },
  Hormone: {
    name: 'Hormone Panel',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Testosterone, Total', unit: 'ng/dL', range: '300-1000 (M), 15-70 (F)', normalRange: [15, 1000] },
      { parameter: 'Estradiol', unit: 'pg/mL', range: '10-40 (M), 30-400 (F)', normalRange: [10, 400] },
      { parameter: 'Follicle Stimulating Hormone (FSH)', unit: 'mIU/mL', range: '1.5-12.4 (M), 3.5-12.5 (F)', normalRange: [1.5, 12.5] },
      { parameter: 'Luteinizing Hormone (LH)', unit: 'mIU/mL', range: '1.7-8.6 (M), 2.4-12.6 (F)', normalRange: [1.7, 12.6] },
      { parameter: 'Prolactin', unit: 'ng/mL', range: '4-15 (M), 4-23 (F)', normalRange: [4, 23] },
      { parameter: 'Cortisol (AM)', unit: 'µg/dL', range: '6-23', normalRange: [6, 23] },
      { parameter: 'DHEA-Sulfate', unit: 'µg/dL', range: '80-560 (M), 35-430 (F)', normalRange: [35, 560] }
    ]
  },
  Infectious: {
    name: 'Infectious Disease Panel',
    specimenType: 'Serum',
    tests: [
      { parameter: 'HIV-1/HIV-2 Antibody', unit: '', range: 'Non-Reactive', normalRange: [0, 0], categorical: ['Non-Reactive', 'Reactive'] },
      { parameter: 'Hepatitis B Surface Antigen', unit: '', range: 'Non-Reactive', normalRange: [0, 0], categorical: ['Non-Reactive', 'Reactive'] },
      { parameter: 'Hepatitis B Surface Antibody', unit: 'mIU/mL', range: '≥10 Immune', normalRange: [10, 1000] },
      { parameter: 'Hepatitis C Antibody', unit: '', range: 'Non-Reactive', normalRange: [0, 0], categorical: ['Non-Reactive', 'Reactive'] },
      { parameter: 'RPR (Syphilis)', unit: '', range: 'Non-Reactive', normalRange: [0, 0], categorical: ['Non-Reactive', 'Reactive'] },
      { parameter: 'COVID-19 Antibody (IgG)', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Positive'] }
    ]
  }
};

export const generateLaboratoryReportData = (
  testType: LabTestType,
  data?: BasicData
): LaboratoryReportData => {
  // Generate fallback patient data
  const fallbackFirstName = faker.person.firstName();
  const fallbackLastName = faker.person.lastName();
  const fallbackMiddleInitial = faker.string.alpha({ length: 1, casing: 'upper' });
  const fallbackDOB = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  const fallbackGender = faker.person.sex();
  const fallbackPatientId = `PAT-${faker.string.numeric(6)}`;
  const fallbackMRN = `MRN-${faker.string.numeric(8)}`;
  
  const today = new Date();
  let fallbackAge = today.getFullYear() - fallbackDOB.getFullYear();
  const monthDiff = today.getMonth() - fallbackDOB.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fallbackDOB.getDate())) {
    fallbackAge--;
  }
  
  const patient: PatientDemographics = {
    id: data?.patient?.id || fallbackPatientId,
    name: data?.patient?.name || `${fallbackLastName}, ${fallbackFirstName} ${fallbackMiddleInitial}`,
    firstName: data?.patient?.firstName || fallbackFirstName,
    lastName: data?.patient?.lastName || fallbackLastName,
    middleInitial: data?.patient?.middleInitial || fallbackMiddleInitial,
    dateOfBirth: data?.patient?.dateOfBirth || fallbackDOB.toLocaleDateString('en-US'),
    age: data?.patient?.age || fallbackAge,
    gender: data?.patient?.gender || (fallbackGender.charAt(0).toUpperCase() + fallbackGender.slice(1)),
    address: {
      street: data?.patient?.address?.street || faker.location.streetAddress(),
      city: data?.patient?.address?.city || faker.location.city(),
      state: data?.patient?.address?.state || faker.location.state({ abbreviated: true }),
      zipCode: data?.patient?.address?.zipCode || faker.location.zipCode('#####'),
      country: data?.patient?.address?.country || 'USA'
    },
    contact: {
      phone: data?.patient?.contact?.phone || faker.phone.number(),
      email: data?.patient?.contact?.email || faker.internet.email({ firstName: fallbackFirstName.toLowerCase(), lastName: fallbackLastName.toLowerCase() }),
      emergencyContact: data?.patient?.contact?.emergencyContact || `${faker.person.fullName()} (${faker.helpers.arrayElement(['Spouse', 'Child', 'Parent'])}) - ${faker.phone.number()}`
    },
    medicalRecordNumber: data?.patient?.medicalRecordNumber || fallbackMRN,
    ssn: data?.patient?.ssn || faker.helpers.replaceSymbols('###-##-####'),
    accountNumber: data?.patient?.accountNumber || fallbackPatientId,
    pharmacy: data?.patient?.pharmacy || {
      name: faker.company.name() + ' Pharmacy',
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state({ abbreviated: true })} ${faker.location.zipCode('#####')}`,
      phone: faker.phone.number()
    }
  };

  // Generate provider
  const providerName = data?.provider?.name || `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`;
  const provider: Provider = data?.provider || {
    name: providerName,
    npi: faker.string.numeric(10),
    specialty: faker.helpers.arrayElement(MEDICAL_SPECIALTIES),
    phone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
      country: 'USA'
    },
    taxId: faker.helpers.replaceSymbols('##-#######'),
    taxIdType: 'EIN',
    facilityName: faker.helpers.arrayElement(FACILITY_NAMES),
    facilityNPI: faker.string.numeric(10)
  };

  // Generate test panel data
  const panel = LAB_TEST_PANELS[testType];
  
  // Generate realistic lab results
  const generateResult = (test: any): LabTestResult => {
    let value: string;
    let flag: 'Normal' | 'High' | 'Low' | 'Critical' | 'Abnormal' | '' = '';
    
    if (test.categorical) {
      // Categorical values (90% normal, 10% abnormal)
      const isNormal = faker.datatype.boolean(0.9);
      value = isNormal ? test.categorical[0] : faker.helpers.arrayElement(test.categorical.slice(1));
      if (!isNormal && test.range !== value) {
        flag = 'Abnormal';
      }
    } else {
      // Numeric values with some abnormalities
      const isNormal = faker.datatype.boolean(0.85);
      const [min, max] = test.normalRange;
      
      if (isNormal) {
        value = faker.number.float({ min, max, fractionDigits: test.unit.includes('µ') || test.unit === '%' ? 1 : 2 }).toFixed(test.unit.includes('seconds') ? 1 : 2);
      } else {
        // Generate abnormal value
        const isHigh = faker.datatype.boolean();
        if (isHigh) {
          const numValue = faker.number.float({ min: max, max: max * 1.3, fractionDigits: 2 });
          value = numValue.toFixed(test.unit.includes('seconds') ? 1 : 2);
          flag = numValue > max * 1.2 ? 'Critical' : 'High';
        } else {
          const numValue = faker.number.float({ min: min * 0.7, max: min, fractionDigits: 2 });
          value = numValue.toFixed(test.unit.includes('seconds') ? 1 : 2);
          flag = numValue < min * 0.8 ? 'Critical' : 'Low';
        }
      }
    }
    
    return {
      parameter: test.parameter,
      value,
      unit: test.unit,
      referenceRange: test.range,
      flag
    };
  };

  const results: LabTestResult[] = panel.tests.map(generateResult);
  
  // Generate dates and times
  const collectionDate = faker.date.recent({ days: 7 });
  const receivedDate = new Date(collectionDate.getTime() + faker.number.int({ min: 1, max: 6 }) * 3600000);
  const reportDate = new Date(receivedDate.getTime() + faker.number.int({ min: 12, max: 48 }) * 3600000);
  
  // Generate performing lab info
  const performingLab = {
    name: `${faker.helpers.arrayElement(['Regional', 'Central', 'Metropolitan', 'University', 'City'])} Laboratory Services`,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
      country: 'USA'
    },
    phone: faker.phone.number(),
    cliaNumber: faker.helpers.replaceSymbols('##D#######'),
    director: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}, MD, PhD`
  };

  // Generate interpretation for certain test types
  let interpretation: string | undefined;
  const hasAbnormal = results.some(r => r.flag && r.flag !== 'Normal');
  
  if (testType === 'Lipid' && hasAbnormal) {
    interpretation = 'Results indicate elevated lipid levels. Recommend lifestyle modifications including diet and exercise. Consider statin therapy if cardiovascular risk is elevated.';
  } else if (testType === 'Thyroid' && hasAbnormal) {
    interpretation = 'Thyroid function tests show abnormalities. Recommend clinical correlation and possible endocrinology referral.';
  } else if (testType === 'HbA1c') {
    const a1cValue = parseFloat(results[0].value);
    if (a1cValue < 5.7) {
      interpretation = 'Normal glucose metabolism. No evidence of diabetes.';
    } else if (a1cValue >= 5.7 && a1cValue < 6.5) {
      interpretation = 'Prediabetes range. Recommend lifestyle modifications and regular monitoring.';
    } else {
      interpretation = 'Diagnostic of diabetes mellitus. Recommend diabetes management program and endocrinology consultation.';
    }
  }

  // Get critical values if any
  const criticalValues = results
    .filter(r => r.flag === 'Critical')
    .map(r => `${r.parameter}: ${r.value} ${r.unit}`);

  return {
    patient,
    provider,
    testType,
    testName: panel.name,
    specimenType: panel.specimenType,
    specimenCollectionDate: collectionDate.toLocaleDateString('en-US'),
    specimenCollectionTime: collectionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    specimenReceivedDate: receivedDate.toLocaleDateString('en-US'),
    reportDate: reportDate.toLocaleDateString('en-US'),
    reportTime: reportDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    orderingPhysician: providerName,
    performingLab,
    results,
    interpretation,
    comments: hasAbnormal ? 'Abnormal results noted. Clinical correlation recommended.' : undefined,
    criticalValues: criticalValues.length > 0 ? criticalValues : undefined,
    technologist: `${faker.person.firstName()} ${faker.person.lastName()}, MT(ASCP)`,
    pathologist: testType === 'Pathology' ? `Dr. ${faker.person.firstName()} ${faker.person.lastName()}, MD` : undefined
  };
};
