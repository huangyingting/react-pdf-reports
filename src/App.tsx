import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import theme from './theme';
import styles from './App.module.css';

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
import LaboratoryReportDocument from './reports/labReport/LabReportDocument';
import { 
  InsurancePolicy,
  VisitReport,
  LabReport,
  LabTestType,
  GenerationOptions,
  GeneratedData
} from './utils/zodSchemas';

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
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [generationOptions, setGenerationOptions] = useState<Required<GenerationOptions>>({
    complexity: 'medium',
    numberOfVisits: 3,
    numberOfLabTests: 5,
    includeSecondaryInsurance: true
  });
  
  // Keep generationOptions for future use (e.g., regenerating data)
  console.log('Current generation options:', generationOptions);
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
    data: GeneratedData,
    options: Required<GenerationOptions>
  ) => {
    setGeneratedData(data);
    setGenerationOptions(options);
  };

  const handleDataUpdated = (updatedData: GeneratedData) => {
    setGeneratedData(updatedData);
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
    if (!generatedData) {
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
    if (!generatedData) {
      alert('Please generate medical data first.');
      return;
    }
    setActiveReportType(reportType);
    setShowPreview(true);
  };

  const renderActiveReport = () => {
    if (!generatedData) {
      return <div>No medical data available. Please generate data first.</div>;
    }

    const selectedFont = fontFamilies.find(font => font.value === fontFamily);
    const fontFamilyStyle = selectedFont ? selectedFont.css : "'Arial', sans-serif";
    
    if (activeReportType === 'cms1500') {
      return (
        <CMS1500Form 
          data={generatedData.cms1500} 
          fontFamily={fontFamilyStyle}
        />
      );
    }
    
    if (activeReportType === 'insurancePolicy') {
      const insurancePolicy: InsurancePolicy = {
        patient: generatedData.patient,
        insuranceInfo: generatedData.insuranceInfo
      };
      return (
        <InsurancePolicyDocument 
          data={insurancePolicy}
          fontFamily={fontFamilyStyle}
        />
      );
    }
    
    if (activeReportType === 'visitReport') {
      return generatedData.visitReports.length > 0 ? (
        <VisitReportDocument 
          patient={generatedData.patient}
          provider={generatedData.provider}
          visitReport={generatedData.visitReports[0]}
          fontFamily={fontFamilyStyle}
        />
      ) : null;
    }
    
    if (activeReportType === 'medicationHistory') {
      return (
        <MedicationHistoryDocument 
          patient={generatedData.patient}
          provider={generatedData.provider}
          medicalHistory={generatedData.medicalHistory}
          fontFamily={fontFamilyStyle}
        />
      );
    }
    
    // Check if it's a laboratory report type
    const labTestTypes: LabTestType[] = ['CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 'Pathology', 'Hormone', 'Infectious'];
    if (labTestTypes.includes(activeReportType as LabTestType)) {
      const labData = generatedData.labReports.find(report => report.testType === activeReportType);
      return labData ? (
        <LaboratoryReportDocument 
          patient={generatedData.patient}
          labReport={labData}
          fontFamily={fontFamilyStyle}
        />
      ) : null;
    }
    
    return (
      <MedicalRecordsReport 
        patient={generatedData.patient}
        provider={generatedData.provider}
        insuranceInfo={generatedData.insuranceInfo}
        labReports={generatedData.labReports}
        visitReports={generatedData.visitReports}
        medicalHistory={generatedData.medicalHistory}
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
            generatedData={generatedData}
            onDataUpdated={handleDataUpdated}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        );
      case 3:
        return (
          <ExportPdfStep
            generatedData={generatedData}
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ gap: 2, py: 1.5 }}>
            <Box 
              sx={{ 
                color: 'primary.main',
                bgcolor: 'rgba(241, 248, 233, 1)',
                p: 1.5,
                borderRadius: 1.25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h1" sx={{ m: 0, fontSize: '1.35rem' }}>
                  HealthCare Document Generator
                </Typography>
                <Chip label="Educational Use Only" size="small" />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <ProgressIndicator currentStep={currentStep} />

        <Box component="main" sx={{ width: '100%', minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', p: 0 }}>
          {renderCurrentStep()}
        </Box>

        {showPreview && (
          <div className={styles.previewModal}>
            <div className={styles.previewContent}>
              <div className={styles.previewHeader}>
                <h3>Preview - {getReportTitle(activeReportType)}</h3>
                <button 
                  className={styles.closePreview}
                  onClick={() => setShowPreview(false)}
                >
                  ×
                </button>
              </div>
              <div className={`${styles.previewBody}${enableWatermark ? ` ${styles.withWatermark}` : ''}`}>
                {enableWatermark && (
                  <div className={styles.previewWatermarkOverlay}>
                    <div className={styles.previewWatermarkText}>Educational Use Only</div>
                    <div className={styles.previewWatermarkText}>Educational Use Only</div>
                    <div className={styles.previewWatermarkText}>Educational Use Only</div>
                    <div className={styles.previewWatermarkText}>Educational Use Only</div>
                    <div className={styles.previewWatermarkText}>Educational Use Only</div>
                  </div>
                )}
                {renderActiveReport()}
              </div>
            </div>
          </div>
        )}

        {/* Hidden reports for PDF export */}
        <div className={styles.reportDisplay}>
            {generatedData && (
              <>
                <MedicalRecordsReport 
                  patient={generatedData.patient}
                  provider={generatedData.provider}
                  insuranceInfo={generatedData.insuranceInfo}
                  labReports={generatedData.labReports}
                  visitReports={generatedData.visitReports}
                  medicalHistory={generatedData.medicalHistory}
                  fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
                />
                <CMS1500Form 
                  data={generatedData.cms1500} 
                  fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
                />
                <InsurancePolicyDocument 
                  data={{
                    patient: generatedData.patient,
                    insuranceInfo: generatedData.insuranceInfo
                  }}
                  fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
                />
                {generatedData.visitReports.map((visitData: VisitReport, index: number) => (
                  <VisitReportDocument 
                    key={index}
                    patient={generatedData.patient}
                    provider={generatedData.provider}
                    visitReport={visitData}
                    fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
                  />
                ))}
                <MedicationHistoryDocument 
                  patient={generatedData.patient}
                  provider={generatedData.provider}
                  medicalHistory={generatedData.medicalHistory}
                  fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
                />
                {/* Laboratory Reports */}
                {generatedData.labReports.map((labReport: LabReport) => (
                  <LaboratoryReportDocument 
                    key={labReport.testType}
                    patient={generatedData.patient}
                    labReport={labReport}
                    fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
                  />
                ))}
              </>
            )}
        </div>
      </Box>
    </ThemeProvider>
  );
}

export default App;
