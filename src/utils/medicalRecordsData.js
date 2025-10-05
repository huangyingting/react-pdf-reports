// Sample medical records data for testing multi-page PDF export
export const sampleMedicalRecordsData = {
  patient: {
    id: "MR-2024-001",
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1985-03-15",
    age: 39,
    gender: "Male",
    ssn: "***-**-4567",
    address: {
      street: "123 Main Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      country: "USA"
    },
    contact: {
      phone: "(555) 123-4567",
      email: "john.smith@email.com",
      emergencyContact: "Jane Smith (Wife) - (555) 987-6543"
    },
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BC123456789",
      groupNumber: "GRP001",
      effectiveDate: "2024-01-01"
    }
  },

  medicalHistory: {
    allergies: [
      {
        allergen: "Penicillin",
        reaction: "Severe rash and difficulty breathing",
        severity: "High",
        dateIdentified: "2010-05-12"
      },
      {
        allergen: "Shellfish",
        reaction: "Hives and swelling",
        severity: "Moderate",
        dateIdentified: "2015-08-20"
      }
    ],
    chronicConditions: [
      {
        condition: "Hypertension",
        diagnosedDate: "2020-01-15",
        status: "Active",
        notes: "Well controlled with medication"
      },
      {
        condition: "Type 2 Diabetes",
        diagnosedDate: "2022-03-10",
        status: "Active",
        notes: "Diet and exercise controlled, HbA1c 6.8%"
      }
    ],
    surgicalHistory: [
      {
        procedure: "Appendectomy",
        date: "2018-06-15",
        hospital: "Springfield General Hospital",
        surgeon: "Dr. Robert Johnson",
        complications: "None"
      },
      {
        procedure: "Arthroscopic Knee Surgery",
        date: "2021-09-22",
        hospital: "Orthopedic Center",
        surgeon: "Dr. Maria Rodriguez",
        complications: "Minor swelling, resolved"
      }
    ],
    familyHistory: [
      {
        relation: "Father",
        conditions: ["Hypertension", "Heart Disease"],
        ageAtDeath: "72",
        causeOfDeath: "Myocardial Infarction"
      },
      {
        relation: "Mother",
        conditions: ["Diabetes Type 2", "Osteoporosis"],
        ageAtDeath: "Still living",
        causeOfDeath: "N/A"
      },
      {
        relation: "Maternal Grandmother",
        conditions: ["Breast Cancer"],
        ageAtDeath: "68",
        causeOfDeath: "Cancer"
      }
    ]
  },

  medications: {
    current: [
      {
        name: "Lisinopril",
        strength: "10mg",
        dosage: "Once daily",
        prescribedBy: "Dr. Sarah Williams",
        startDate: "2020-01-15",
        purpose: "Blood pressure control",
        instructions: "Take with food, monitor blood pressure weekly"
      },
      {
        name: "Metformin",
        strength: "500mg",
        dosage: "Twice daily",
        prescribedBy: "Dr. Michael Chen",
        startDate: "2022-03-10",
        purpose: "Diabetes management",
        instructions: "Take with meals to reduce GI upset"
      },
      {
        name: "Atorvastatin",
        strength: "20mg",
        dosage: "Once daily at bedtime",
        prescribedBy: "Dr. Sarah Williams",
        startDate: "2023-01-05",
        purpose: "Cholesterol management",
        instructions: "Avoid grapefruit juice"
      }
    ],
    discontinued: [
      {
        name: "Hydrochlorothiazide",
        strength: "25mg",
        reason: "Switched to ACE inhibitor",
        discontinuedDate: "2020-01-15",
        prescribedBy: "Dr. John Martinez"
      }
    ]
  },

  labResults: [
    {
      testDate: "2024-09-15",
      testName: "Complete Blood Count (CBC)",
      results: [
        { parameter: "White Blood Cells", value: "7.2", unit: "K/uL", referenceRange: "4.0-11.0", status: "Normal" },
        { parameter: "Red Blood Cells", value: "4.8", unit: "M/uL", referenceRange: "4.2-5.4", status: "Normal" },
        { parameter: "Hemoglobin", value: "14.5", unit: "g/dL", referenceRange: "12.0-16.0", status: "Normal" },
        { parameter: "Hematocrit", value: "43.2", unit: "%", referenceRange: "36.0-46.0", status: "Normal" },
        { parameter: "Platelets", value: "285", unit: "K/uL", referenceRange: "150-450", status: "Normal" }
      ],
      orderingPhysician: "Dr. Sarah Williams"
    },
    {
      testDate: "2024-09-15",
      testName: "Comprehensive Metabolic Panel",
      results: [
        { parameter: "Glucose", value: "125", unit: "mg/dL", referenceRange: "70-100", status: "High" },
        { parameter: "BUN", value: "18", unit: "mg/dL", referenceRange: "7-20", status: "Normal" },
        { parameter: "Creatinine", value: "1.0", unit: "mg/dL", referenceRange: "0.7-1.3", status: "Normal" },
        { parameter: "Sodium", value: "140", unit: "mEq/L", referenceRange: "136-145", status: "Normal" },
        { parameter: "Potassium", value: "4.2", unit: "mEq/L", referenceRange: "3.5-5.1", status: "Normal" },
        { parameter: "Chloride", value: "102", unit: "mEq/L", referenceRange: "98-107", status: "Normal" }
      ],
      orderingPhysician: "Dr. Sarah Williams"
    },
    {
      testDate: "2024-08-20",
      testName: "Lipid Panel",
      results: [
        { parameter: "Total Cholesterol", value: "195", unit: "mg/dL", referenceRange: "<200", status: "Normal" },
        { parameter: "HDL Cholesterol", value: "45", unit: "mg/dL", referenceRange: ">40", status: "Normal" },
        { parameter: "LDL Cholesterol", value: "125", unit: "mg/dL", referenceRange: "<100", status: "High" },
        { parameter: "Triglycerides", value: "150", unit: "mg/dL", referenceRange: "<150", status: "Borderline" }
      ],
      orderingPhysician: "Dr. Sarah Williams"
    }
  ],

  vitalSigns: [
    {
      date: "2024-09-15",
      time: "10:30 AM",
      bloodPressure: "128/82",
      heartRate: "72",
      temperature: "98.6",
      weight: "185",
      height: "5'10\"",
      bmi: "26.5",
      oxygenSaturation: "98%",
      respiratoryRate: "16"
    },
    {
      date: "2024-06-10",
      time: "2:15 PM",
      bloodPressure: "135/88",
      heartRate: "78",
      temperature: "98.4",
      weight: "188",
      height: "5'10\"",
      bmi: "26.9",
      oxygenSaturation: "97%",
      respiratoryRate: "18"
    }
  ],

  visitNotes: [
    {
      date: "2024-09-15",
      provider: "Dr. Sarah Williams",
      type: "Annual Physical Examination",
      chiefComplaint: "Annual check-up, blood pressure monitoring",
      historyOfPresentIllness: "Patient reports feeling well overall. Compliance with medications good. Some occasional fatigue but attributes to work stress. No chest pain, shortness of breath, or palpitations.",
      vitals: {
        bloodPressure: "128/82",
        heartRate: 78,
        temperature: 98.4,
        weight: 185,
        height: '70"',
        oxygenSaturation: 98
      },
      physicalExam: {
        general: "Well-appearing male in no acute distress",
        vitals: "See vital signs section",
        cardiovascular: "Regular rate and rhythm, no murmurs, gallops, or rubs",
        pulmonary: "Clear to auscultation bilaterally",
        abdomen: "Soft, non-tender, non-distended, normal bowel sounds",
        extremities: "No clubbing, cyanosis, or edema",
        neurological: "Alert and oriented x3, cranial nerves intact"
      },
      assessment: [
        "Hypertension - well controlled",
        "Type 2 Diabetes Mellitus - fair control, elevated fasting glucose",
        "Dyslipidemia - LDL slightly elevated"
      ],
      plan: [
        "Continue current Lisinopril 10mg daily",
        "Increase Metformin to 1000mg twice daily",
        "Continue Atorvastatin 20mg daily",
        "Dietary consultation for diabetes management",
        "Follow-up in 3 months",
        "Home blood pressure monitoring",
        "HbA1c in 3 months"
      ],
      followUp: "3 months"
    },
    {
      date: "2024-06-10",
      provider: "Dr. Sarah Williams",
      type: "Follow-up Visit",
      chiefComplaint: "Blood pressure check, medication review",
      historyOfPresentIllness: "Patient returns for routine follow-up. Reports good adherence to medications. Occasional dizziness in morning, possibly related to medications.",
      vitals: {
        bloodPressure: "135/88",
        heartRate: 78,
        temperature: 98.4,
        weight: 183,
        height: '70"',
        oxygenSaturation: 97
      },
      physicalExam: {
        general: "Well-appearing, no acute distress",
        vitals: "BP 135/88, HR 78, temp 98.4°F",
        cardiovascular: "RRR, no murmurs"
      },
      assessment: [
        "Hypertension - suboptimal control",
        "Type 2 Diabetes Mellitus - stable"
      ],
      plan: [
        "Increase Lisinopril to 10mg daily",
        "Continue Metformin",
        "Blood pressure log for 2 weeks",
        "Return in 6 weeks"
      ],
      followUp: "6 weeks"
    }
  ]
};