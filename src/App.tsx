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
import { generateCMS1500Data } from './utils/cms1500Generator';
import { generateInsurancePolicyData } from './utils/insurancePolicyGenerator';
import { MedicalRecord, CMS1500Data, InsurancePolicyData } from './utils/types';

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
type ReportType = 'medical' | 'cms1500' | 'insurancePolicy';

function App() {
  // Workflow state management
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [medicalData, setMedicalData] = useState<MedicalRecord | null>(null);
  const [cms1500Data, setCms1500Data] = useState<CMS1500Data | null>(null);
  const [insurancePolicyData, setInsurancePolicyData] = useState<InsurancePolicyData | null>(null);
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
  const handleDataGenerated = (data: MedicalRecord) => {
    setMedicalData(data);
    setCms1500Data(generateCMS1500Data(data));
    setInsurancePolicyData(generateInsurancePolicyData(data));
  };

  const handleDataUpdated = (newData: MedicalRecord) => {
    setMedicalData(newData);
    setCms1500Data(generateCMS1500Data(newData));
    setInsurancePolicyData(generateInsurancePolicyData(newData));
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
    if (!medicalData) {
      alert('Please generate medical data first.');
      return;
    }

    setIsLoading(true);
    try {
      const elementId = reportType === 'cms1500' ? 'cms1500-report' 
        : reportType === 'insurancePolicy' ? 'insurance-policy-report'
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
    if (!medicalData) {
      alert('Please generate medical data first.');
      return;
    }
    setActiveReportType(reportType);
    setShowPreview(true);
  };

  const renderActiveReport = () => {
    if (!medicalData) {
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
    
    return (
      <MedicalRecordsReport 
        data={medicalData} 
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
            medicalData={medicalData}
            onDataUpdated={handleDataUpdated}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        );
      case 3:
        return (
          <ExportPdfStep
            medicalData={medicalData}
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

      <main className="main-content">
        <ProgressIndicator currentStep={currentStep} />
        {renderCurrentStep()}
      </main>

      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <div className="preview-header">
              <h3>Preview - {activeReportType === 'cms1500' ? 'CMS-1500 Form' : activeReportType === 'insurancePolicy' ? 'Insurance Policy Document' : 'Medical Records Report'}</h3>
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
          {medicalData && (
            <MedicalRecordsReport 
              data={medicalData} 
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
      </div>
    </div>
  );
}

export default App;
