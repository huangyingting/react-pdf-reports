import React from 'react';
import DocumentCard from './DocumentCard';
import './ExportPdfStep.css';

const ExportPdfStep = ({
  medicalData,
  exportFormat,
  setExportFormat,
  qualityLevel,
  setQualityLevel,
  fontFamily,
  setFontFamily,
  fontFamilies,
  watermarkEnabled,
  setWatermarkEnabled,
  watermarkText,
  setWatermarkText,
  watermarkOpacity,
  setWatermarkOpacity,
  watermarkPosition,
  setWatermarkPosition,
  watermarkRotation,
  setWatermarkRotation,
  watermarkColor,
  setWatermarkColor,
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
                    setQualityLevel(value.replace('canvas-', ''));
                  } else {
                    setExportFormat(value);
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
              <label>Add Watermark</label>
              <label className="watermark-toggle">
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={(e) => setWatermarkEnabled(e.target.checked)}
                />
                <span>Enable watermark on documents</span>
              </label>
              <p className="setting-note">
                Applies preset watermark configuration to all generated documents
              </p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-select-all">Select All</button>
            <button className="btn-deselect-all">Deselect All</button>
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
              onPreview={onPreview}
              onGenerate={() => onExport('medical', 'medical-records-report')}
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