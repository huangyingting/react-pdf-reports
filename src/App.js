import React, { useState } from 'react';
import './App.css';

// Import report components
import SalesReport from './components/SalesReport';
import InventoryReport from './components/InventoryReport';
import FinancialReport from './components/FinancialReport';
import MedicalRecordsReport from './components/MedicalRecordsReport';

// Import utilities
import { 
  exportToPDF, 
  exportMultipleReportsToPDF, 
  previewPDF 
} from './utils/pdfExport';
import { 
  sampleSalesData, 
  sampleInventoryData, 
  sampleFinancialData 
} from './utils/sampleData';
import { sampleMedicalRecordsData } from './utils/medicalRecordsData';

function App() {
  const [activeReport, setActiveReport] = useState('sales');
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPDF = async (reportType, filename) => {
    setIsLoading(true);
    try {
      const elementId = reportType === 'medical' ? 'medical-records-report' : `${reportType}-report`;
      await exportToPDF(elementId, filename);
      alert(`${filename}.pdf has been downloaded successfully!`);
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
      await previewPDF(elementId);
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
      const elementIds = ['sales-report', 'inventory-report', 'financial-report', 'medical-records-report'];
      await exportMultipleReportsToPDF(elementIds, 'all-reports-combined');
      alert('Combined report PDF has been downloaded successfully!');
    } catch (error) {
      console.error('Combined export failed:', error);
      alert('Failed to export combined PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveReport = () => {
    switch (activeReport) {
      case 'sales':
        return <SalesReport data={sampleSalesData} />;
      case 'inventory':
        return <InventoryReport data={sampleInventoryData} />;
      case 'financial':
        return <FinancialReport data={sampleFinancialData} />;
      case 'medical':
        return <MedicalRecordsReport data={sampleMedicalRecordsData} />;
      default:
        return <SalesReport data={sampleSalesData} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>React PDF Report Generator</h1>
        <p>Generate professional PDF reports using jsPDF's .html() method</p>
      </header>

      <nav className="report-nav">
        <div className="nav-buttons">
          <button 
            className={activeReport === 'sales' ? 'active' : ''} 
            onClick={() => setActiveReport('sales')}
          >
            Sales Report
          </button>
          <button 
            className={activeReport === 'inventory' ? 'active' : ''} 
            onClick={() => setActiveReport('inventory')}
          >
            Inventory Report
          </button>
          <button 
            className={activeReport === 'financial' ? 'active' : ''} 
            onClick={() => setActiveReport('financial')}
          >
            Financial Report
          </button>
          <button 
            className={activeReport === 'medical' ? 'active' : ''} 
            onClick={() => setActiveReport('medical')}
          >
            Medical Records
          </button>
        </div>
      </nav>

      <div className="controls-panel">
        <div className="control-group">
          <h3>Current Report Actions</h3>
          <div className="button-group">
            <button 
              onClick={() => handlePreviewPDF(activeReport)}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              {isLoading ? 'Processing...' : 'Preview PDF'}
            </button>
            <button 
              onClick={() => handleExportPDF(activeReport, `${activeReport}-report`)}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Bulk Operations</h3>
          <div className="button-group">
            <button 
              onClick={handleExportAllReports}
              disabled={isLoading}
              className="btn btn-success"
            >
              {isLoading ? 'Generating...' : 'Download All Reports (Combined)'}
            </button>
          </div>
        </div>
      </div>

      <main className="report-container">
        <div className="report-display">
          {renderActiveReport()}
        </div>
      </main>

      {/* Hidden reports for combined PDF export */}
      <div style={{ display: 'none' }}>
        {activeReport !== 'sales' && <SalesReport data={sampleSalesData} />}
        {activeReport !== 'inventory' && <InventoryReport data={sampleInventoryData} />}
        {activeReport !== 'financial' && <FinancialReport data={sampleFinancialData} />}
        {activeReport !== 'medical' && <MedicalRecordsReport data={sampleMedicalRecordsData} />}
      </div>

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
