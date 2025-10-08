import { useState } from 'react';
import './App.css';

// Import components
import GenerateDataStep from './components/GenerateDataStep';
import EditDataStep from './components/EditDataStep';
import ExportPdfStep from './components/ExportPdfStep';
import ProgressIndicator from './components/ProgressIndicator';
import MedicalRecordsReport from './reports/medicalRecords/MedicalRecordsReport';
import CMS1500Form from './reports/cms1500/CMS1500Form';
import InsurancePolicyDocument from './reports/insurancePolicy/InsurancePolicyDocument';
import VisitReportDocument from './reports/visitReport/VisitReportDocument';
import MedicationHistoryDocument from './reports/medicationHistory/MedicationHistoryDocument';
import LaboratoryReportDocument from './reports/laboratoryReport/LaboratoryReportDocument';
import { generateCMS1500Data } from './utils/cms1500Generator';
import { generateInsurancePolicyData } from './utils/insurancePolicyGenerator';
import { generateVisitReportData } from './utils/visitReportGenerator';
import { generateMedicalHistoryData } from './utils/medicalHistoryGenerator';
import { generateLaboratoryReportData } from './utils/laboratoryReportGenerator';
import { BasicData, CMS1500Data, InsurancePolicyData, VisitReportData, MedicalHistoryData, LaboratoryReportData, LabTestType } from './utils/types';

// Import utilities
import { 
  exportToPDF, 
  exportToPDFAsImage,
} from './utils/pdfExport';

interface FontFamily {
  value: string;
  label: string;
  css: string;
}

type QualityLevel = 'poor' | 'standard' | 'high';
type ExportFormat = 'pdf' | 'canvas';
type ReportType = 'medical' | 'cms1500' | 'insurancePolicy' | 'visitReport' | 'medicationHistory' | LabTestType;

function App() {
  // Workflow state management
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [basicData, setBasicData] = useState<BasicData | null>(null);
  const [generationOptions, setGenerationOptions] = useState<{ 
    complexity: 'low' | 'medium' | 'high';
    numberOfVisits: number;
    numberOfLabTests: number;
    includeSecondaryInsurance: boolean;
  }>({
    complexity: 'medium',
    numberOfVisits: 3,
    numberOfLabTests: 5,
    includeSecondaryInsurance: true
  });
  const [cms1500Data, setCms1500Data] = useState<CMS1500Data | null>(null);
  const [insurancePolicyData, setInsurancePolicyData] = useState<InsurancePolicyData | null>(null);
  const [visitReportsData, setVisitReportsData] = useState<VisitReportData[]>([]);
  const [medicalHistoryData, setMedicalHistoryData] = useState<MedicalHistoryData | null>(null);
  const [laboratoryReports, setLaboratoryReports] = useState<Map<LabTestType, LaboratoryReportData>>(new Map());
  const [activeReportType, setActiveReportType] = useState<ReportType>('medical');
  
  // Export settings
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('standard');
  const [fontFamily, setFontFamily] = useState<string>('Times New Roman');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [enableWatermark, setEnableWatermark] = useState<boolean>(false);

  // Available font families for the report
  const fontFamilies: FontFamily[] = [
    { value: 'Times New Roman', label: 'Times New Roman', css: "'Times New Roman', serif" },
    { value: 'Arial', label: 'Arial', css: "'Arial', sans-serif" },
    { value: 'Helvetica', label: 'Helvetica', css: "'Helvetica', 'Arial', sans-serif" },
    { value: 'Georgia', label: 'Georgia', css: "'Georgia', serif" },
    { value: 'Verdana', label: 'Verdana', css: "'Verdana', sans-serif" },
    { value: 'Calibri', label: 'Calibri', css: "'Calibri', sans-serif" },
    { value: 'Courier New', label: 'Courier New', css: "'Courier New', monospace" },
    { value: 'Trebuchet MS', label: 'Trebuchet MS', css: "'Trebuchet MS', sans-serif" },
    { value: 'Palatino', label: 'Palatino', css: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
    { value: 'Garamond', label: 'Garamond', css: "'Garamond', serif" },
    { value: 'Bookman', label: 'Bookman', css: "'Bookman Old Style', serif" },
    { value: 'Comic Sans MS', label: 'Comic Sans MS', css: "'Comic Sans MS', cursive" },
    { value: 'Candara', label: 'Candara', css: "'Candara', sans-serif" },
    { value: 'Tahoma', label: 'Tahoma', css: "'Tahoma', sans-serif" },
    { value: 'Cambria', label: 'Cambria', css: "'Cambria', serif" },
    { value: 'Consolas', label: 'Consolas', css: "'Consolas', monospace" },
    { value: 'Lucida Sans', label: 'Lucida Sans', css: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif" },
    { value: 'Century Gothic', label: 'Century Gothic', css: "'Century Gothic', sans-serif" }
  ];

  // Step navigation handlers
  const handleDataGenerated = (
    data: BasicData,
    options: { 
      complexity: 'low' | 'medium' | 'high';
      numberOfVisits: number;
      numberOfLabTests: number;
      includeSecondaryInsurance: boolean;
    },
    preGeneratedMedicalHistory?: MedicalHistoryData | null,
    preGeneratedVisitReports?: VisitReportData[] | null,
    preGeneratedLabReports?: Map<LabTestType, LaboratoryReportData> | null
  ) => {
    setBasicData(data);
    setGenerationOptions(options);
    setCms1500Data(generateCMS1500Data(data));
    setInsurancePolicyData(generateInsurancePolicyData(data));
    
    // Use pre-generated visit reports if provided, otherwise generate with Faker using passed options
    if (preGeneratedVisitReports && preGeneratedVisitReports.length > 0) {
      setVisitReportsData(preGeneratedVisitReports);
    } else {
      setVisitReportsData(generateVisitReportData(data, options.numberOfVisits));
    }
    
    // Use pre-generated medical history if provided, otherwise generate with Faker using passed options
    if (preGeneratedMedicalHistory) {
      setMedicalHistoryData(preGeneratedMedicalHistory);
    } else {
      setMedicalHistoryData(generateMedicalHistoryData(data, options.complexity));
    }
    
    // Use pre-generated lab reports if provided, otherwise generate with Faker
    if (preGeneratedLabReports && preGeneratedLabReports.size > 0) {
      setLaboratoryReports(preGeneratedLabReports);
    } else {
      const allLabTypes: LabTestType[] = ['CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 'Pathology', 'Hormone', 'Infectious'];
      const labReportsMap = new Map<LabTestType, LaboratoryReportData>();
      allLabTypes.forEach(testType => {
        labReportsMap.set(testType, generateLaboratoryReportData(testType, data));
      });
      setLaboratoryReports(labReportsMap);
    }
  };

  const handleDataUpdated = (newData: BasicData, labReportsMap?: Map<LabTestType, LaboratoryReportData>, visitDataArray?: VisitReportData[]) => {
    setBasicData(newData);
    setCms1500Data(generateCMS1500Data(newData));
    setInsurancePolicyData(generateInsurancePolicyData(newData));
    
    // Update visit reports data if provided, otherwise regenerate using stored options
    if (visitDataArray && visitDataArray.length > 0) {
      setVisitReportsData(visitDataArray);
    } else {
      setVisitReportsData(generateVisitReportData(newData, generationOptions.numberOfVisits));
    }
    
    // Generate medical history with complexity parameter from stored options
    setMedicalHistoryData(generateMedicalHistoryData(newData, generationOptions.complexity));
    
    // Update laboratory reports - use provided map if available, otherwise regenerate
    if (labReportsMap && labReportsMap.size > 0) {
      setLaboratoryReports(labReportsMap);
    } else {
      // Regenerate all laboratory reports
      const allLabTypes: LabTestType[] = ['CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 'Pathology', 'Hormone', 'Infectious'];
      const newLabReportsMap = new Map<LabTestType, LaboratoryReportData>();
      allLabTypes.forEach(testType => {
        newLabReportsMap.set(testType, generateLaboratoryReportData(testType, newData));
      });
      setLaboratoryReports(newLabReportsMap);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExportPDF = async (reportType: ReportType, filename: string) => {
    if (!basicData) {
      alert('Please generate medical data first.');
      return;
    }

    setIsLoading(true);
    try {
      // Check if it's a lab test type
      const labTestTypes: LabTestType[] = ['CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 'Pathology', 'Hormone', 'Infectious'];
      const isLabTest = labTestTypes.includes(reportType as LabTestType);
      
      const elementId = reportType === 'cms1500' ? 'cms1500-report' 
        : reportType === 'insurancePolicy' ? 'insurance-policy-report'
        : reportType === 'visitReport' ? 'visit-report-document'
        : reportType === 'medicationHistory' ? 'medication-history-document'
        : isLabTest ? `laboratory-report-${(reportType as string).toLowerCase()}`
        : 'medical-records-report';
      
      if (exportFormat === 'canvas') {
        await exportToPDFAsImage(elementId, `${filename}-canvas`, {
          qualityLevel: qualityLevel
        }, enableWatermark);
        alert(`${filename}-canvas.pdf has been downloaded successfully!`);
      } else {
        await exportToPDF(elementId, filename, {}, enableWatermark);
        alert(`${filename}.pdf has been downloaded successfully!`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (reportType: ReportType = 'medical') => {
    if (!basicData) {
      alert('Please generate medical data first.');
      return;
    }
    setActiveReportType(reportType);
    setShowPreview(true);
  };

  const renderActiveReport = () => {
    if (!basicData) {
      return <div>No medical data available. Please generate data first.</div>;
    }

    const selectedFont = fontFamilies.find(font => font.value === fontFamily);
    const fontFamilyStyle = selectedFont ? selectedFont.css : "'Arial', sans-serif";
    
    if (activeReportType === 'cms1500') {
      if (!cms1500Data) {
        return <div>CMS-1500 data not available.</div>;
      }
      return (
        <CMS1500Form 
          data={cms1500Data} 
          fontFamily={fontFamilyStyle}
        />
      );
    }
    
    if (activeReportType === 'insurancePolicy') {
      return insurancePolicyData ? (
        <InsurancePolicyDocument 
          data={insurancePolicyData}
          fontFamily={fontFamilyStyle}
        />
      ) : null;
    }
    
    if (activeReportType === 'visitReport') {
      return visitReportsData.length > 0 ? (
        <VisitReportDocument 
          data={visitReportsData[0]}
          fontFamily={fontFamilyStyle}
        />
      ) : null;
    }
    
    if (activeReportType === 'medicationHistory') {
      return medicalHistoryData ? (
        <MedicationHistoryDocument 
          data={medicalHistoryData}
          fontFamily={fontFamilyStyle}
        />
      ) : null;
    }
    
    // Check if it's a laboratory report type
    const labTestTypes: LabTestType[] = ['CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 'Pathology', 'Hormone', 'Infectious'];
    if (labTestTypes.includes(activeReportType as LabTestType)) {
      const labData = laboratoryReports.get(activeReportType as LabTestType);
      return labData ? (
        <LaboratoryReportDocument 
          data={labData}
          fontFamily={fontFamilyStyle}
        />
      ) : null;
    }
    
    return (
      <MedicalRecordsReport 
        data={basicData} 
        laboratoryReportData={Array.from(laboratoryReports.values())}
        visitReportData={visitReportsData.length > 0 ? visitReportsData[0] : undefined}
        medicalHistoryData={medicalHistoryData || undefined}
        fontFamily={fontFamilyStyle}
      />
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenerateDataStep
            onDataGenerated={handleDataGenerated}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <EditDataStep
            medicalData={basicData}
            laboratoryReportsMap={laboratoryReports}
            visitReportsData={visitReportsData}
            medicalHistoryData={medicalHistoryData}
            onDataUpdated={handleDataUpdated}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        );
      case 3:
        return (
          <ExportPdfStep
            medicalData={basicData}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            qualityLevel={qualityLevel}
            setQualityLevel={setQualityLevel}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontFamilies={fontFamilies}
            enableWatermark={enableWatermark}
            setEnableWatermark={setEnableWatermark}
            onPreview={handlePreview}
            onExport={handleExportPDF}
            onBack={handlePreviousStep}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  // Helper function to get report titles
  const getReportTitle = (reportType: ReportType): string => {
    const labTitles: Record<string, string> = {
      'CBC': 'Complete Blood Count (CBC)',
      'BMP': 'Basic Metabolic Panel',
      'CMP': 'Comprehensive Metabolic Panel',
      'Urinalysis': 'Urinalysis',
      'Lipid': 'Lipid Profile',
      'LFT': 'Liver Function Tests',
      'Thyroid': 'Thyroid Function Panel',
      'HbA1c': 'Hemoglobin A1c',
      'Coagulation': 'Coagulation Panel',
      'Microbiology': 'Microbiology Culture',
      'Pathology': 'Pathology Report',
      'Hormone': 'Hormone Panel',
      'Infectious': 'Infectious Disease Panel'
    };
    
    if (reportType === 'cms1500') return 'CMS-1500 Form';
    if (reportType === 'insurancePolicy') return 'Insurance Policy Document';
    if (reportType === 'visitReport') return 'Visit Report';
    if (reportType === 'medicationHistory') return 'Medication History';
    if (labTitles[reportType]) return labTitles[reportType];
    return 'Medical Records Report';
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        <div className="header-content">
          <div className="header-title-row">
            <h1>HealthCare Document Generator</h1>
            <div className="header-badge">Educational Use Only</div>
          </div>
        </div>
      </header>

      <ProgressIndicator currentStep={currentStep} />

      <main className="main-content">
        {renderCurrentStep()}
      </main>

      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <div className="preview-header">
              <h3>Preview - {getReportTitle(activeReportType)}</h3>
              <button 
                className="close-preview"
                onClick={() => setShowPreview(false)}
              >
                ×
              </button>
            </div>
            <div className="preview-body">
              {renderActiveReport()}
            </div>
          </div>
        </div>
      )}

      {/* Hidden reports for PDF export */}
      <div className="report-display">
          {basicData && (
            <MedicalRecordsReport 
              data={basicData}
              laboratoryReportData={Array.from(laboratoryReports.values())}
              visitReportData={visitReportsData.length > 0 ? visitReportsData[0] : undefined}
              medicalHistoryData={medicalHistoryData || undefined}
              fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
            />
          )}
          {cms1500Data && (
            <CMS1500Form 
              data={cms1500Data} 
              fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
            />
          )}
          {insurancePolicyData && (
            <InsurancePolicyDocument 
              data={insurancePolicyData}
              fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
            />
          )}
          {visitReportsData.length > 0 && visitReportsData.map((visitData, index) => (
            <VisitReportDocument 
              key={index}
              data={visitData}
              fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
            />
          ))}
          {medicalHistoryData && (
            <MedicationHistoryDocument 
              data={medicalHistoryData}
              fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
            />
          )}
          {/* Laboratory Reports */}
          {Array.from(laboratoryReports.entries()).map(([testType, data]) => (
            <LaboratoryReportDocument 
              key={testType}
              data={data}
              fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
