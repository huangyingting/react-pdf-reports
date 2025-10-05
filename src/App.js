import React, { useState } from 'react';
import './App.css';

// Import components
import GenerateDataStep from './components/GenerateDataStep';
import EditDataStep from './components/EditDataStep';
import ExportPdfStep from './components/ExportPdfStep';
import MedicalRecordsReport from './reports/medicalRecords/MedicalRecordsReport';
import CMS1500Form from './reports/cms1500/CMS1500Form';
import { generateCMS1500Data } from './utils/cms1500Data';

// Import utilities
import { 
  exportToPDF, 
  exportToPDFAsImage,
} from './utils/pdfExport';

function App() {
  // Workflow state management
  const [currentStep, setCurrentStep] = useState(1);
  const [medicalData, setMedicalData] = useState(null);
  const [cms1500Data, setCms1500Data] = useState(null);
  const [activeReportType, setActiveReportType] = useState('medical');
  
  // Export settings
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' or 'canvas'
  const [qualityLevel, setQualityLevel] = useState('standard'); // 'poor', 'standard', 'high'
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [showPreview, setShowPreview] = useState(false);
  const [enableWatermark, setEnableWatermark] = useState(false);

  // Available font families for the report
  const fontFamilies = [
    { value: 'Times New Roman', label: 'Times New Roman', css: "'Times New Roman', serif" },
    { value: 'Arial', label: 'Arial', css: "'Arial', sans-serif" },
    { value: 'Helvetica', label: 'Helvetica', css: "'Helvetica', 'Arial', sans-serif" },
    { value: 'Georgia', label: 'Georgia', css: "'Georgia', serif" },
    { value: 'Verdana', label: 'Verdana', css: "'Verdana', sans-serif" },
    { value: 'Calibri', label: 'Calibri', css: "'Calibri', sans-serif" }
  ];

  // Step navigation handlers
  const handleDataGenerated = (data) => {
    setMedicalData(data);
    setCms1500Data(generateCMS1500Data(data));
  };

  const handleDataUpdated = (newData) => {
    setMedicalData(newData);
    setCms1500Data(generateCMS1500Data(newData));
  };  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExportPDF = async (reportType, filename) => {
    if (!medicalData) {
      alert('Please generate medical data first.');
      return;
    }

    setIsLoading(true);
    try {
      const elementId = reportType === 'cms1500' ? 'cms1500-report' : 'medical-records-report';
      
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

  const handlePreview = (reportType = 'medical') => {
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
        {renderCurrentStep()}
      </main>

      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <div className="preview-header">
              <h3>Preview - {activeReportType === 'cms1500' ? 'CMS-1500 Form' : 'Medical Records Report'}</h3>
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
      </div>
    </div>
  );
}

export default App;
