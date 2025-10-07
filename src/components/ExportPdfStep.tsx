import React from 'react';
import DocumentCard from './DocumentCard';
import './ExportPdfStep.css';
import { MedicalRecord, LabTestType } from '../utils/types';

type ExportFormat = 'pdf' | 'canvas';
type QualityLevel = 'poor' | 'standard' | 'high';
type ReportType = 'medical' | 'cms1500' | 'insurancePolicy' | 'visitReport' | 'medicationHistory' | LabTestType;

interface FontFamily {
  value: string;
  label: string;
  css: string;
}

interface ExportPdfStepProps {
  medicalData: MedicalRecord | null;
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
  medicalData,
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
  if (!medicalData) {
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

  return (
    <div className="export-pdf-step">
      <div className="step-content">


        <div className="export-settings">
          <h3>Export Settings</h3>
          <p>Configure how all reports will be generated</p>

          <div className="settings-grid">
            <div className="setting-group">
              <label>Export Format</label>
              <select
                value={exportFormat === 'canvas' ? `canvas-${qualityLevel}` : exportFormat}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('canvas-')) {
                    setExportFormat('canvas');
                    setQualityLevel(value.replace('canvas-', '') as QualityLevel);
                  } else {
                    setExportFormat(value as ExportFormat);
                  }
                }}
                className="setting-select"
              >
                <option value="pdf">Vector PDF (Selectable Text)</option>
                <option value="canvas-poor">Canvas Poor Quality (Fast, Small File)</option>
                <option value="canvas-standard">Canvas Standard Quality (Balanced)</option>
                <option value="canvas-high">Canvas High Quality (Best, Large File)</option>
              </select>
              <p className="setting-note">
                {exportFormat === 'pdf' && 'Vector-based PDF with selectable text and smaller file size'}
                {exportFormat === 'canvas' && qualityLevel === 'poor' && 'Scale: 1x, Quality: 50% - Fastest generation, smallest file'}
                {exportFormat === 'canvas' && qualityLevel === 'standard' && 'Scale: 2x, Quality: 85% - Good balance of quality and size'}
                {exportFormat === 'canvas' && qualityLevel === 'high' && 'Scale: 4x, Quality: 95% - Best quality, largest file size'}
              </p>
            </div>

            <div className="setting-group">
              <label>Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="setting-select"
              >
                {fontFamilies.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
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
                onGenerate={() => onExport('cms1500', 'cms-1500-claim-form')}
                isLoading={isLoading}
                iconType="insurance"
              />

              <DocumentCard
                title="Insurance Policy Certificate"
                description="Professional insurance policy certificate document with coverage details, subscriber information, and benefits summary"
                onPreview={() => onPreview('insurancePolicy')}
                onGenerate={() => onExport('insurancePolicy', 'insurance-policy-certificate')}
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
                onGenerate={() => onExport('medical', 'medical-records-report')}
                isLoading={isLoading}
                iconType="medical"
              />

              <DocumentCard
                title="Visit Report"
                description="Clinical visit summary with vital signs, chief complaint, assessment, and treatment plan - optimized for printed clinical records"
                onPreview={() => onPreview('visitReport')}
                onGenerate={() => onExport('visitReport', 'visit-report')}
                isLoading={isLoading}
                iconType="visit"
              />

              <DocumentCard
                title="Medication History"
                description="Comprehensive medication history report with current medications, discontinued medications, and allergy information"
                onPreview={() => onPreview('medicationHistory')}
                onGenerate={() => onExport('medicationHistory', 'medication-history')}
                isLoading={isLoading}
                iconType="medication"
              />
            </div>
          </div>

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
              <DocumentCard
                title="CBC"
                description="Complete blood cell analysis with differential count"
                onPreview={() => onPreview('CBC')}
                onGenerate={() => onExport('CBC', 'cbc-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="BMP"
                description="Basic metabolic panel with glucose and electrolytes"
                onPreview={() => onPreview('BMP')}
                onGenerate={() => onExport('BMP', 'bmp-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="CMP"
                description="Comprehensive metabolic panel with liver function"
                onPreview={() => onPreview('CMP')}
                onGenerate={() => onExport('CMP', 'cmp-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="Urinalysis"
                description="Complete urine analysis with microscopic exam"
                onPreview={() => onPreview('Urinalysis')}
                onGenerate={() => onExport('Urinalysis', 'urinalysis-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="Lipid Profile"
                description="Cardiovascular risk assessment panel"
                onPreview={() => onPreview('Lipid')}
                onGenerate={() => onExport('Lipid', 'lipid-profile-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="Liver Function"
                description="Comprehensive liver health assessment"
                onPreview={() => onPreview('LFT')}
                onGenerate={() => onExport('LFT', 'lft-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="Thyroid Panel"
                description="Complete thyroid function assessment"
                onPreview={() => onPreview('Thyroid')}
                onGenerate={() => onExport('Thyroid', 'thyroid-function-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="HbA1c"
                description="Diabetes monitoring and glucose control"
                onPreview={() => onPreview('HbA1c')}
                onGenerate={() => onExport('HbA1c', 'hba1c-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="Coagulation"
                description="Blood clotting function panel"
                onPreview={() => onPreview('Coagulation')}
                onGenerate={() => onExport('Coagulation', 'coagulation-panel-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="Microbiology"
                description="Culture and sensitivity testing"
                onPreview={() => onPreview('Microbiology')}
                onGenerate={() => onExport('Microbiology', 'microbiology-culture-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="Pathology"
                description="Tissue specimen analysis report"
                onPreview={() => onPreview('Pathology')}
                onGenerate={() => onExport('Pathology', 'pathology-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="Hormone Panel"
                description="Endocrine function testing"
                onPreview={() => onPreview('Hormone')}
                onGenerate={() => onExport('Hormone', 'hormone-panel-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />

              <DocumentCard
                title="Infectious Disease"
                description="Serological testing panel"
                onPreview={() => onPreview('Infectious')}
                onGenerate={() => onExport('Infectious', 'infectious-disease-panel-report')}
                isLoading={isLoading}
                compact
                iconType="lab"
              />
            </div>
          </div>
        </div>

        <div className="step-navigation">
          <button className="btn btn-outline" onClick={onBack}>
            ← Back to Edit Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPdfStep;
