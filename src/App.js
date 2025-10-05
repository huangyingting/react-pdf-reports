import React, { useState } from 'react';
import './App.css';

// Import report components
import MedicalRecordsReport from './components/MedicalRecordsReport';

// Import utilities
import { 
  exportToPDF, 
  exportMultipleReportsToPDF, 
  previewPDF,
  exportToPDFAsImage,
  exportMultipleElementsToPDFAsImages,
  previewPDFAsImage
} from './utils/pdfExport';
import { sampleMedicalRecordsData } from './utils/medicalRecordsData';

function App() {
  const [activeReport, setActiveReport] = useState('medical');
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' or 'image'

  const handleExportPDF = async (reportType, filename) => {
    setIsLoading(true);
    try {
      const elementId = reportType === 'medical' ? 'medical-records-report' : `${reportType}-report`;
      
      if (exportFormat === 'image') {
        await exportToPDFAsImage(elementId, `${filename}-image`);
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

  const handlePreviewPDF = async (reportType) => {
    setIsLoading(true);
    try {
      const elementId = reportType === 'medical' ? 'medical-records-report' : `${reportType}-report`;
      
      if (exportFormat === 'image') {
        await previewPDFAsImage(elementId);
      } else {
        await previewPDF(elementId);
      }
    } catch (error) {
      console.error('Preview failed:', error);
      alert('Failed to preview PDF. Please try again.');
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
    return <MedicalRecordsReport data={sampleMedicalRecordsData} />;
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
        </div>
        
        <div className="control-group">
          <h3>Report Actions</h3>
          <div className="button-group">
            <button 
              onClick={() => handlePreviewPDF(activeReport)}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              {isLoading ? 'Processing...' : `Preview ${exportFormat === 'image' ? '(Image)' : '(PDF)'}`}
            </button>
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
