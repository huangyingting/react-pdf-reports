import React, { useState } from 'react';
import './App.css';

// Import report components
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
  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' or 'image'
  const [imageQuality, setImageQuality] = useState('standard'); // 'poor', 'standard', 'high'
  const [fontFamily, setFontFamily] = useState('Arial'); // Font family selection

  // Available font families for the report
  const fontFamilies = [
    { value: 'Arial', label: 'Arial', css: "'Arial', sans-serif" },
    { value: 'Times New Roman', label: 'Times New Roman', css: "'Times New Roman', serif" },
    { value: 'Helvetica', label: 'Helvetica', css: "'Helvetica', 'Arial', sans-serif" },
    { value: 'Georgia', label: 'Georgia', css: "'Georgia', serif" },
    { value: 'Verdana', label: 'Verdana', css: "'Verdana', sans-serif" },
    { value: 'Calibri', label: 'Calibri', css: "'Calibri', sans-serif" },
    { value: 'Tahoma', label: 'Tahoma', css: "'Tahoma', sans-serif" },
    { value: 'Trebuchet MS', label: 'Trebuchet MS', css: "'Trebuchet MS', sans-serif" }
  ];

  const handleExportPDF = async (reportType, filename) => {
    setIsLoading(true);
    try {
      const elementId = reportType === 'medical' ? 'medical-records-report' : `${reportType}-report`;
      
      if (exportFormat === 'image') {
        await exportToPDFAsImage(elementId, `${filename}-image`, {
          qualityLevel: imageQuality
        });
        alert(`${filename}-image.pdf has been downloaded successfully!`);
      } else {
        await exportToPDF(elementId, filename);
        alert(`${filename}.pdf has been downloaded successfully!`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        <h1>Medical Records PDF Generator</h1>
        <p>Generate professional medical record PDFs using jsPDF's .html() method</p>
      </header>

      <nav className="report-nav">
        <div className="nav-buttons">
          <button 
            className="active"
            disabled
          >
            Medical Records Report
          </button>
        </div>
      </nav>

      <div className="controls-panel">
        <div className="control-group">
          <h3>Export Settings</h3>
          <div className="export-format-selector">
            <label htmlFor="export-format">Export Format:</label>
            <select 
              id="export-format"
              value={exportFormat} 
              onChange={(e) => setExportFormat(e.target.value)}
              className="format-dropdown"
            >
              <option value="pdf">PDF (Text-based)</option>
              <option value="image">PDF (Image-based)</option>
            </select>
          </div>

          <div className="export-format-selector">
            <label htmlFor="font-family">Font Family:</label>
            <select 
              id="font-family"
              value={fontFamily} 
              onChange={(e) => setFontFamily(e.target.value)}
              className="format-dropdown"
            >
              {fontFamilies.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
          
          {exportFormat === 'image' && (
            <div className="export-quality-selector">
              <label htmlFor="image-quality">Image Quality:</label>
              <select 
                id="image-quality"
                value={imageQuality} 
                onChange={(e) => setImageQuality(e.target.value)}
                className="quality-dropdown"
              >
                <option value="poor">Poor Quality (Fast, Small File)</option>
                <option value="standard">Standard Quality (Recommended)</option>
                <option value="high">High Quality (Slow, Large File)</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="control-group">
          <h3>Report Actions</h3>
          <div className="button-group">
            <button 
              onClick={() => handleExportPDF(activeReport, `medical-records-report`)}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Generating...' : `Download ${exportFormat === 'image' ? '(Image)' : '(PDF)'}`}
            </button>
          </div>
        </div>
      </div>

      <main className="report-container">
        <div className="report-display">
          {renderActiveReport()}
        </div>
      </main>



      <footer className="app-footer">
        <p>
          Built with React.js and jsPDF. 
          Demonstrates HTML-to-PDF conversion using jsPDF's .html() method.
        </p>
        <div className="tech-stack">
          <span>React</span>
          <span>jsPDF</span>
          <span>HTML2Canvas</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
