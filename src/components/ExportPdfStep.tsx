import React from 'react';
import DocumentCard from './DocumentCard';
import './ExportPdfStep.css';
import { MedicalRecord } from '../utils/dataGenerator';

type ExportFormat = 'pdf' | 'canvas';
type QualityLevel = 'poor' | 'standard' | 'high';
type ReportType = 'medical' | 'cms1500';

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
        <div className="step-header">
          <div>
            <h2>Generate Documents</h2>
            <p>Your medical records are ready! Configure export settings and generate your documents.</p>
          </div>
        </div>

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
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={enableWatermark}
                  onChange={(e) => setEnableWatermark(e.target.checked)}
                  className="setting-checkbox"
                />
                <span>Add Watermark</span>
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3>Medical Reports</h3>
            </div>

            <DocumentCard
              title="Complete Medical Records Report"
              description="Comprehensive medical records including patient demographics, medical history, medications, lab results, and visit notes"
              onPreview={() => onPreview('medical')}
              onGenerate={() => onExport('medical', 'medical-records-report')}
              isLoading={isLoading}
            />
          </div>

          <div className="document-category">
            <div className="category-header">
              <div className="category-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>Insurance Forms</h3>
            </div>

            <DocumentCard
              title="CMS-1500 Health Insurance Claim Form"
              description="Standard health insurance claim form (HCFA-1500) with patient information, diagnosis codes, and service line items"
              onPreview={() => onPreview('cms1500')}
              onGenerate={() => onExport('cms1500', 'cms-1500-claim-form')}
              isLoading={isLoading}
            />
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
