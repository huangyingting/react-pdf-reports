import React, { useState } from 'react';
import './App.css';

// Import components
import ProgressIndicator from './components/ProgressIndicator';
import DocumentCard from './components/DocumentCard';
import MedicalRecordsReport from './reports/medicalRecords/MedicalRecordsReport';

// Import utilities
import { 
  exportToPDF, 
  exportMultipleReportsToPDF, 
  exportToPDFAsImage,
  exportMultipleElementsToPDFAsImages
} from './utils/pdfExport';
import { sampleMedicalRecordsData } from './utils/medicalRecordsData';

function App() {
  const [activeReport, setActiveReport] = useState('medical');
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' or 'canvas'
  const [fontFamily, setFontFamily] = useState('Times New Roman'); // Font family selection
  const [showPreview, setShowPreview] = useState(false);
  
  // Watermark settings
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkPosition, setWatermarkPosition] = useState('diagonal');
  const [watermarkRotation, setWatermarkRotation] = useState(-45);
  const [watermarkColor, setWatermarkColor] = useState('#999999');

  // Available font families for the report
  const fontFamilies = [
    { value: 'Times New Roman', label: 'Times New Roman - Classic serif font', css: "'Times New Roman', serif" },
    { value: 'Arial', label: 'Arial', css: "'Arial', sans-serif" },
    { value: 'Helvetica', label: 'Helvetica', css: "'Helvetica', 'Arial', sans-serif" },
    { value: 'Georgia', label: 'Georgia', css: "'Georgia', serif" },
    { value: 'Verdana', label: 'Verdana', css: "'Verdana', sans-serif" },
    { value: 'Calibri', label: 'Calibri', css: "'Calibri', sans-serif" }
  ];

  const handleExportPDF = async (reportType, filename) => {
    setIsLoading(true);
    try {
      const elementId = reportType === 'medical' ? 'medical-records-report' : `${reportType}-report`;
      
      // Prepare watermark options
      const watermarkOptions = watermarkEnabled ? {
        text: watermarkText,
        opacity: watermarkOpacity,
        position: watermarkPosition,
        rotation: watermarkRotation,
        color: watermarkColor
      } : null;
      
      if (exportFormat === 'canvas') {
        await exportToPDFAsImage(elementId, `${filename}-canvas`, {
          qualityLevel: 'standard',
          watermark: watermarkOptions
        });
        alert(`${filename}-canvas.pdf has been downloaded successfully!`);
      } else {
        await exportToPDF(elementId, filename, {
          watermark: watermarkOptions
        });
        alert(`${filename}.pdf has been downloaded successfully!`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleExportAllReports = async () => {
    setIsLoading(true);
    try {
      const elementIds = ['medical-records-report'];
      await exportMultipleReportsToPDF(elementIds, 'medical-records-combined');
      alert('Medical records PDF has been downloaded successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAllReportsAsImages = async () => {
    setIsLoading(true);
    try {
      const elementIds = ['medical-records-report'];
      await exportMultipleElementsToPDFAsImages(elementIds, 'medical-records-images');
      alert('Medical records image-based PDF has been downloaded successfully!');
    } catch (error) {
      console.error('Image export failed:', error);
      alert('Failed to export PDF as images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveReport = () => {
    const selectedFont = fontFamilies.find(font => font.value === fontFamily);
    const fontFamilyStyle = selectedFont ? selectedFont.css : "'Arial', sans-serif";
    
    return (
      <MedicalRecordsReport 
        data={sampleMedicalRecordsData} 
        fontFamily={fontFamilyStyle}
      />
    );
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
          <h1>Healthcare Document Generator</h1>
          <p className="header-subtitle">Educational tool for creating sample healthcare forms and reports</p>
          <div className="header-badge">Educational Use Only</div>
        </div>
      </header>

      <ProgressIndicator currentStep={3} />

      <main className="main-content">
        <div className="content-container">
          <div className="document-section">
            <div className="section-header">
              <div className="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
              </div>
              <h2>Generate Documents</h2>
            </div>
            <p className="section-description">
              Select which documents you'd like to generate: insurance claims, clinical reports, and/or 
              laboratory reports. You can generate individual documents or multiple documents at once.
            </p>

            <div className="export-settings">
              <h3>Export Settings</h3>
              <p>Configure how all reports will be generated</p>
              
              <div className="settings-grid">
                <div className="setting-group">
                  <label>Export Format (All Reports)</label>
                  <select 
                    value={exportFormat} 
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="setting-select"
                  >
                    <option value="pdf">Standard Quality • Canvas-based PDF</option>
                    <option value="canvas">High Quality • Fast HTML to PDF conversion with rich formatting</option>
                  </select>
                  <p className="setting-note">
                    {exportFormat === 'pdf' 
                      ? 'Fast HTML to PDF conversion with rich formatting. Good for screen viewing and quick generation.'
                      : 'Canvas-based PDF conversion with rich formatting. Good for screen viewing and quick generation.'
                    }
                  </p>
                </div>

                <div className="setting-group">
                  <label>Font Family (Vector PDFs Only)</label>
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
                    ⚠️ Font selection only applies to vector-based PDFs. Switch to High Quality format to use custom fonts.
                  </p>
                </div>
              </div>

              <div className="watermark-section">
                <div className="watermark-header">
                  <label className="watermark-toggle">
                    <input
                      type="checkbox"
                      checked={watermarkEnabled}
                      onChange={(e) => setWatermarkEnabled(e.target.checked)}
                    />
                    <span>Add Watermark</span>
                  </label>
                </div>

                {watermarkEnabled && (
                  <div className="watermark-controls">
                    <div className="watermark-grid">
                      <div className="setting-group">
                        <label>Watermark Text</label>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="setting-input"
                          placeholder="Enter watermark text"
                        />
                      </div>

                      <div className="setting-group">
                        <label>Position</label>
                        <select
                          value={watermarkPosition}
                          onChange={(e) => setWatermarkPosition(e.target.value)}
                          className="setting-select"
                        >
                          <option value="diagonal">Diagonal (Center)</option>
                          <option value="center">Center</option>
                          <option value="header">Header</option>
                          <option value="footer">Footer</option>
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                      </div>

                      <div className="setting-group">
                        <label>Opacity: {Math.round(watermarkOpacity * 100)}%</label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                          className="setting-slider"
                        />
                      </div>

                      <div className="setting-group">
                        <label>Rotation: {watermarkRotation}°</label>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          step="15"
                          value={watermarkRotation}
                          onChange={(e) => setWatermarkRotation(parseInt(e.target.value))}
                          className="setting-slider"
                        />
                      </div>

                      <div className="setting-group">
                        <label>Color</label>
                        <div className="color-input-group">
                          <input
                            type="color"
                            value={watermarkColor}
                            onChange={(e) => setWatermarkColor(e.target.value)}
                            className="setting-color"
                          />
                          <input
                            type="text"
                            value={watermarkColor}
                            onChange={(e) => setWatermarkColor(e.target.value)}
                            className="setting-input color-text"
                            placeholder="#999999"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <h3>Insurance Reports</h3>
                </div>
                
                <DocumentCard
                  title="CMS-1500 Insurance Claim Form"
                  description="Standard paper claim form for billing Medicare, Medicaid, and Insurance companies"
                  onPreview={handlePreview}
                  onGenerate={() => handleExportPDF('medical', 'cms-1500-form')}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <div className="preview-header">
              <h3>Preview - Medical Records Report</h3>
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

      {/* Hidden report for PDF export */}
      <div className="report-display">
        {renderActiveReport()}
      </div>
    </div>
  );
}

export default App;
