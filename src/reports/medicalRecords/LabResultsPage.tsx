import React from 'react';
import { MedicalRecord, LaboratoryReportData, VisitReportData } from '../../utils/types';

interface LabResultsPageProps {
  data: MedicalRecord;
  laboratoryReportData?: LaboratoryReportData[];
  visitReportData?: VisitReportData;
}

const LabResultsPage: React.FC<LabResultsPageProps> = ({ data, laboratoryReportData, visitReportData }) => {
  const { patient, provider } = data;
  const currentDate = new Date().toLocaleDateString();
  
  // Facility information with fallbacks
  const facilityName = provider?.facilityName || 'Metropolitan General Hospital';
  const facilityAddress = provider?.facilityAddress;
  const facilityPhone = provider?.facilityPhone || '(555) 123-4567';
  const facilityAddressLine = facilityAddress 
    ? `${facilityAddress.street}, ${facilityAddress.city}, ${facilityAddress.state} ${facilityAddress.zipCode}`
    : '123 Medical Center Drive, Healthcare City, HC 12345';
  
  const renderVitalSigns = () => {
    const vitalSigns = visitReportData?.vitalSigns;
    if (!vitalSigns) return null;

    return (
      <div className="compact-section">
        <h3>Vital Signs</h3>
        <table className="compact-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature</th>
              <th>Blood Pressure</th>
              <th>Heart Rate</th>
              <th>Respiratory Rate</th>
              <th>Oxygen Sat</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{visitReportData.visit?.date || 'N/A'}</td>
              <td>{vitalSigns.temperature} °F</td>
              <td>{vitalSigns.bloodPressure}</td>
              <td>{vitalSigns.heartRate} bpm</td>
              <td>{vitalSigns.respiratoryRate || 'N/A'}</td>
              <td>{vitalSigns.oxygenSaturation || 'N/A'}%</td>
              <td>{vitalSigns.weight} lbs</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderRecentLabs = () => {
    if (!laboratoryReportData || laboratoryReportData.length === 0) return null;

    return (
      <div className="compact-section">
        <h3>Recent Laboratory Results</h3>
        
        {laboratoryReportData.slice(0, 3).map((labReport, labIndex) => (
          <div key={labIndex} style={{marginBottom: '4mm'}}>
            <h4 style={{color: '#2c5aa0', fontSize: '11px', marginBottom: '2mm'}}>
              {labReport.testName} - {labReport.reportDate}
            </h4>
            
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Result</th>
                  <th>Units</th>
                  <th>Reference Range</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {labReport.results.slice(0, 10).map((result, resultIndex) => (
                  <tr key={resultIndex}>
                    <td style={{fontWeight: 'bold'}}>{result.parameter}</td>
                    <td style={{textAlign: 'center', fontWeight: result.flag !== 'Normal' ? 'bold' : 'normal'}}>
                      {result.value}
                    </td>
                    <td style={{textAlign: 'center'}}>{result.unit}</td>
                    <td style={{textAlign: 'center'}}>{result.referenceRange}</td>
                    <td style={{textAlign: 'center'}}>
                      <span className={`status-badge status-${result.flag?.toLowerCase().replace(' ', '-')}`}>
                        {result.flag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  const renderCriticalAlerts = () => {
    if (!laboratoryReportData || laboratoryReportData.length === 0) return null;
    
    // Collect critical results from all lab reports
    const allCriticalResults = laboratoryReportData.flatMap(labReport =>
      labReport.results
        .filter(result => 
          result.flag === 'High' || result.flag === 'Low' || result.flag === 'Critical' || result.flag === 'Abnormal'
        )
        .map(result => ({ ...result, testName: labReport.testName }))
    );

    if (allCriticalResults.length === 0) return null;

    return (
      <div className="compact-section">
        <h3>Critical Values & Alerts</h3>
        <div className="alert-summary">
          {allCriticalResults.slice(0, 4).map((result, index) => (
            <div key={index} className={`alert-box ${result.flag === 'Critical' ? 'critical' : result.flag === 'High' ? 'warning' : 'info'}`}>
              <strong>{result.parameter}</strong> - {result.value} {result.unit} 
              <span style={{fontSize: '9px', color: '#666'}}>
                (Normal: {result.referenceRange}) - Status: {result.flag}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLabSummary = () => {
    if (!laboratoryReportData || laboratoryReportData.length === 0) return null;

    // Calculate total abnormal results across all lab reports
    const totalAbnormalCount = laboratoryReportData.reduce((sum, labReport) => {
      return sum + labReport.results.filter(r => r.flag !== 'Normal' && r.flag !== '').length;
    }, 0);

    return (
      <div className="compact-section">
        <h3>Laboratory Summary</h3>
        <div className="reference-grid">
          <div className="reference-item">
            <strong>Tests Ordered</strong>
            <div>{laboratoryReportData.length} test{laboratoryReportData.length !== 1 ? 's' : ''}</div>
            <div className="note">Recent reports available</div>
          </div>
          <div className="reference-item">
            <strong>Abnormal Results</strong>
            <div>
              {totalAbnormalCount} finding{totalAbnormalCount !== 1 ? 's' : ''}
            </div>
            <div className="note">{totalAbnormalCount > 0 ? 'Require follow-up review' : 'All values normal'}</div>
          </div>
        </div>
        
        <div style={{marginTop: '3mm'}}>
          <h4>Test Information</h4>
          {laboratoryReportData.slice(0, 2).map((labReport, index) => (
            <div key={index} style={{marginBottom: index < 1 ? '3mm' : '0'}}>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="label">Test Type</td>
                    <td className="value">{labReport.testType}</td>
                  </tr>
                  <tr>
                    <td className="label">Specimen Type</td>
                    <td className="value">{labReport.specimenType}</td>
                  </tr>
                  <tr>
                    <td className="label">Collection Date</td>
                    <td className="value">{labReport.specimenCollectionDate} at {labReport.specimenCollectionTime}</td>
                  </tr>
                  <tr>
                    <td className="label">Ordering Physician</td>
                    <td className="value">{labReport.orderingPhysician}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="medical-page">
      <div className="medical-page-header">
        <div className="hospital-info">
          <h2>{facilityName}</h2>
          <p>{facilityAddressLine} | Phone: {facilityPhone}</p>
        </div>
        <div className="page-title">
          <h1>Laboratory Results</h1>
          <p className="generated-date">Generated: {currentDate}</p>
        </div>
      </div>

      <div className="medical-page-content">
        {renderVitalSigns()}
        {renderRecentLabs()}
        {renderCriticalAlerts()}
        {renderLabSummary()}
        
        {(!visitReportData?.vitalSigns && !laboratoryReportData) && (
          <div className="no-data-message">
            <p>No laboratory or vital sign data available for this patient.</p>
          </div>
        )}
      </div>

      <div className="medical-page-footer">
        <div className="confidentiality-notice">
          <p><strong>CONFIDENTIAL MEDICAL RECORD:</strong> This document contains privileged and confidential information intended only for the addressee. If you have received this in error, please notify the sender immediately.</p>
        </div>
        <div className="page-info">
          <span>Patient ID: {patient?.id || 'N/A'} | DOB: {patient?.dateOfBirth || 'N/A'}</span>
          <span>Page 4 of 5 | Lab Results</span>
        </div>
      </div>
    </div>
  );
};

export default LabResultsPage;
