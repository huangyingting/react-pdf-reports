import React from 'react';
import DocumentCard from './DocumentCard';
import CustomSelect from './CustomSelect';
import './ExportPdfStep.css';
import { GeneratedData, LabTestType } from '../utils/zodSchemas';

type ExportFormat = 'pdf' | 'canvas';
type QualityLevel = 'poor' | 'standard' | 'high';
type ReportType = 'medical' | 'cms1500' | 'insurancePolicy' | 'visitReport' | 'medicationHistory' | LabTestType;

interface FontFamily {
  value: string;
  label: string;
  css: string;
}

interface ExportPdfStepProps {
  generatedData: GeneratedData | null;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  qualityLevel: QualityLevel;
  setQualityLevel: (level: QualityLevel) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontFamilies: FontFamily[];
  enableWatermark: boolean;
  setEnableWatermark: (enabled: boolean) => void;
  onPreview: (reportType: ReportType) => void;
  onExport: (reportType: ReportType, filename: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const ExportPdfStep: React.FC<ExportPdfStepProps> = ({
  generatedData,
  exportFormat,
  setExportFormat,
  qualityLevel,
  setQualityLevel,
  fontFamily,
  setFontFamily,
  fontFamilies,
  enableWatermark,
  setEnableWatermark,
  onPreview,
  onExport,
  onBack,
  isLoading
}) => {
  if (!generatedData) {
    return (
      <div className="edit-data-step">
        <div className="step-content">
          <div className="no-data-message">
            <h2>No Data Available</h2>
            <p>Please go back and generate medical data first.</p>
            <button className="btn btn-primary" onClick={onBack}>
              ← Go Back to Generate Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get the list of generated lab report types
  const generatedLabTypes = new Set(
    generatedData.labReports?.map(report => report.testType) || []
  );

  // Define all available lab tests with their metadata
  const allLabTests: Array<{
    type: LabTestType;
    title: string;
    description: string;
    filename: string;
  }> = [
      { type: 'CBC', title: 'CBC', description: 'Complete blood cell analysis with differential count', filename: 'cbc-report' },
      { type: 'BMP', title: 'BMP', description: 'Basic metabolic panel with glucose and electrolytes', filename: 'bmp-report' },
      { type: 'CMP', title: 'CMP', description: 'Comprehensive metabolic panel with liver function', filename: 'cmp-report' },
      { type: 'Urinalysis', title: 'Urinalysis', description: 'Complete urine analysis with microscopic exam', filename: 'urinalysis-report' },
      { type: 'Lipid', title: 'Lipid Profile', description: 'Cardiovascular risk assessment panel', filename: 'lipid-profile-report' },
      { type: 'LFT', title: 'Liver Function', description: 'Comprehensive liver health assessment', filename: 'lft-report' },
      { type: 'Thyroid', title: 'Thyroid Panel', description: 'Complete thyroid function assessment', filename: 'thyroid-function-report' },
      { type: 'HbA1c', title: 'HbA1c', description: 'Diabetes monitoring and glucose control', filename: 'hba1c-report' },
      { type: 'Coagulation', title: 'Coagulation', description: 'Blood clotting function panel', filename: 'coagulation-panel-report' },
      { type: 'Microbiology', title: 'Microbiology', description: 'Culture and sensitivity testing', filename: 'microbiology-culture-report' },
      { type: 'Pathology', title: 'Pathology', description: 'Tissue specimen analysis report', filename: 'pathology-report' },
      { type: 'Hormone', title: 'Hormone Panel', description: 'Endocrine function testing', filename: 'hormone-panel-report' },
      { type: 'Infectious', title: 'Infectious Disease', description: 'Serological testing panel', filename: 'infectious-disease-panel-report' }
    ];

  // Filter to only show generated lab tests
  const availableLabTests = allLabTests.filter(test => generatedLabTypes.has(test.type));

  // Generate filename suffix based on export format and quality level
  const getFilenameSuffix = (): string => {
    if (exportFormat === 'pdf') {
      return '_v';
    } else {
      // canvas format
      const qualityMap = {
        'poor': 'p',
        'standard': 's',
        'high': 'h'
      };
      return `_c${qualityMap[qualityLevel]}`;
    }
  };

  return (
    <div className="step">
      <div className="step-content">


        <div className="section">
          <h3>Export Settings</h3>
          <p>Configure how all reports will be generated</p>

          <div className="settings-grid">
            <div className="setting-group">
              <label>Export Format</label>
              <CustomSelect
                value={exportFormat === 'canvas' ? `canvas-${qualityLevel}` : exportFormat}
                onChange={(value) => {
                  const val = value as string;
                  if (val.startsWith('canvas-')) {
                    setExportFormat('canvas');
                    setQualityLevel(val.replace('canvas-', '') as QualityLevel);
                  } else {
                    setExportFormat(val as ExportFormat);
                  }
                }}
                options={[
                  { value: 'pdf', label: 'Vector PDF (Selectable Text)' },
                  { value: 'canvas-poor', label: 'Canvas Poor Quality (Fast, Small File)' },
                  { value: 'canvas-standard', label: 'Canvas Standard Quality (Balanced)' },
                  { value: 'canvas-high', label: 'Canvas High Quality (Best, Large File)' }
                ]}
              />
              <p className="setting-note">
                {exportFormat === 'pdf' && 'Vector-based PDF with selectable text and smaller file size'}
                {exportFormat === 'canvas' && qualityLevel === 'poor' && 'Scale: 1x, Quality: 50% - Fastest generation, smallest file'}
                {exportFormat === 'canvas' && qualityLevel === 'standard' && 'Scale: 2x, Quality: 85% - Good balance of quality and size'}
                {exportFormat === 'canvas' && qualityLevel === 'high' && 'Scale: 4x, Quality: 95% - Best quality, largest file size'}
              </p>
            </div>

            <div className="setting-group">
              <label>Font Family</label>
              <CustomSelect
                value={fontFamily}
                onChange={(value) => setFontFamily(value as string)}
                options={fontFamilies.map(font => ({
                  value: font.value,
                  label: font.label
                }))}
              />
              <p className="setting-note">
                Choose font family for all document text
              </p>
            </div>

            <div className="setting-group">
              <label>Watermark</label>

              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={enableWatermark}
                  onChange={(e) => setEnableWatermark(e.target.checked)}
                  className="setting-checkbox"
                />
                <span>Enabled</span>
              </label>
              <p className="setting-note">
                {enableWatermark ? 'Adds repeating "Educational Use Only" watermarks to every page' : 'No watermark will be added'}
              </p>
            </div>
          </div>
        </div>

        <div className="document-grid">
          <div className="document-category">
            <div className="category-header">
              <div className="category-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>Insurance Forms</h3>
            </div>

            <div className="document-cards-row">
              <DocumentCard
                title="CMS-1500 Health Insurance Claim Form"
                description="Standard health insurance claim form (HCFA-1500) with patient information, diagnosis codes, and service line items"
                onPreview={() => onPreview('cms1500')}
                onGenerate={() => onExport('cms1500', `${generatedData?.patient?.id || 'patient'}_cms1500${getFilenameSuffix()}`)}
                isLoading={isLoading}
                iconType="insurance"
              />

              <DocumentCard
                title="Insurance Policy Certificate"
                description="Professional insurance policy certificate document with coverage details, subscriber information, and benefits summary"
                onPreview={() => onPreview('insurancePolicy')}
                onGenerate={() => onExport('insurancePolicy', `${generatedData?.patient?.id || 'patient'}_insurance_policy_certificate${getFilenameSuffix()}`)}
                isLoading={isLoading}
                iconType="insurance"
              />
            </div>
          </div>

          <div className="document-category">
            <div className="category-header">
              <div className="category-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3>Clinical Reports</h3>
            </div>

            <div className="document-cards-row">
              <DocumentCard
                title="Complete Medical Records Report"
                description="Comprehensive medical records including patient demographics, medical history, medications, lab results, and visit notes"
                onPreview={() => onPreview('medical')}
                onGenerate={() => onExport('medical', `${generatedData?.patient?.id || 'patient'}_medical_records_report${getFilenameSuffix()}`)}
                isLoading={isLoading}
                iconType="medical"
              />

              <DocumentCard
                title="Visit Report"
                description="Clinical visit summary with vital signs, chief complaint, assessment, and treatment plan - optimized for printed clinical records"
                onPreview={() => onPreview('visitReport')}
                onGenerate={() => onExport('visitReport', `${generatedData?.patient?.id || 'patient'}_visit_report${getFilenameSuffix()}`)}
                isLoading={isLoading}
                iconType="visit"
              />

              <DocumentCard
                title="Medication History"
                description="Comprehensive medication history report with current medications, discontinued medications, and allergy information"
                onPreview={() => onPreview('medicationHistory')}
                onGenerate={() => onExport('medicationHistory', `${generatedData?.patient?.id || 'patient'}_medication_history${getFilenameSuffix()}`)}
                isLoading={isLoading}
                iconType="medication"
              />
            </div>
          </div>

          {availableLabTests.length > 0 && (
            <div className="document-category">
              <div className="category-header">
                <div className="category-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 2v1m6-1v1M4 8h16M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    <path d="M9 11h.01M9 14h.01M12 11h.01M12 14h.01M15 11h.01M15 14h.01" />
                  </svg>
                </div>
                <h3>Laboratory Reports</h3>
              </div>

              <div className="laboratory-cards-grid">
                {availableLabTests.map((test) => (
                  <DocumentCard
                    key={test.type}
                    title={test.title}
                    description={test.description}
                    onPreview={() => onPreview(test.type)}
                    onGenerate={() => onExport(test.type, `${generatedData?.patient?.id || 'patient'}_${test.filename}${getFilenameSuffix()}`)}
                    isLoading={isLoading}
                    compact
                    iconType="lab"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="step-actions">
          <div className="action-buttons-group">
            <button className="btn btn-outline" onClick={onBack}>
              ← Back to Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPdfStep;
