import React from 'react';
import { MedicalRecord } from '../../utils/types';

interface LabResultsPageProps {
  data: MedicalRecord;
}

const LabResultsPage: React.FC<LabResultsPageProps> = ({ data }) => {
  const { labResults, patient, provider } = data;
  const currentDate = new Date().toLocaleDateString();
  
  // Facility information with fallbacks
  const facilityName = provider?.facilityName || 'Metropolitan General Hospital';
  const facilityAddress = provider?.facilityAddress;
  const facilityPhone = provider?.facilityPhone || '(555) 123-4567';
  const facilityAddressLine = facilityAddress 
    ? `${facilityAddress.street}, ${facilityAddress.city}, ${facilityAddress.state} ${facilityAddress.zipCode}`
    : '123 Medical Center Drive, Healthcare City, HC 12345';
  
  const renderVitalSigns = () => {
    const vitals = data.vitalSigns || [];
    if (vitals.length === 0) return null;

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
              <th>BMI</th>
            </tr>
          </thead>
          <tbody>
            {vitals.slice(0, 3).map((vital, index) => (
              <tr key={index}>
                <td>{vital.date}</td>
                <td>{vital.temperature} °F</td>
                <td>{vital.bloodPressure}</td>
                <td>{vital.heartRate} bpm</td>
                <td>{vital.respiratoryRate} /min</td>
                <td>{vital.oxygenSaturation}%</td>
                <td>{vital.bmi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRecentLabs = () => {
    const tests = labResults || [];
    if (tests.length === 0) return null;

    return (
      <div className="compact-section">
        <h3>Recent Laboratory Results</h3>
        
        {tests.slice(0, 2).map((test, testIndex) => (
          <div key={testIndex} style={{marginBottom: '4mm'}}>
            <h4 style={{color: '#2c5aa0', fontSize: '11px', marginBottom: '2mm'}}>
              {test.testName} - {test.testDate}
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
                {test.results.slice(0, 6).map((result, resultIndex) => (
                  <tr key={resultIndex}>
                    <td style={{fontWeight: 'bold'}}>{result.parameter}</td>
                    <td style={{textAlign: 'center', fontWeight: result.status !== 'Normal' ? 'bold' : 'normal'}}>
                      {result.value}
                    </td>
                    <td style={{textAlign: 'center'}}>{result.unit}</td>
                    <td style={{textAlign: 'center'}}>{result.referenceRange}</td>
                    <td style={{textAlign: 'center'}}>
                      <span className={`status-badge status-${result.status?.toLowerCase().replace(' ', '-')}`}>
                        {result.status}
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
    const tests = labResults || [];
    const criticalResults: Array<{
      test: string;
      component: string;
      value: string | number;
      units: string;
      status: string;
      referenceRange: string;
    }> = [];
    
    tests.forEach(test => {
      test.results?.forEach(result => {
        if (result.status === 'High' || result.status === 'Low' || result.status === 'Critical') {
          criticalResults.push({
            test: test.testName,
            component: result.parameter,
            value: result.value,
            units: result.unit,
            status: result.status,
            referenceRange: result.referenceRange
          });
        }
      });
    });

    if (criticalResults.length === 0) return null;

    return (
      <div className="compact-section">
        <h3>Critical Values & Alerts</h3>
        <div className="alert-summary">
          {criticalResults.slice(0, 4).map((alert, index) => (
            <div key={index} className={`alert-box ${alert.status === 'Critical' ? 'critical' : alert.status === 'High' ? 'warning' : 'info'}`}>
              <strong>{alert.component}</strong> - {alert.value} {alert.units} 
              <span style={{fontSize: '9px', color: '#666'}}>
                (Normal: {alert.referenceRange}) - Status: {alert.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLabSummary = () => {
    const tests = labResults || [];
    if (tests.length === 0) return null;

    return (
      <div className="compact-section">
        <h3>Laboratory Summary</h3>
        <div className="reference-grid">
          <div className="reference-item">
            <strong>Tests Ordered</strong>
            <div>{tests.length} test panels completed</div>
            <div className="note">Most recent: {tests[0]?.testDate || 'N/A'}</div>
          </div>
          <div className="reference-item">
            <strong>Abnormal Results</strong>
            <div>
              {tests.reduce((count, test) => 
                count + (test.results?.filter(r => r.status !== 'Normal').length || 0), 0
              )} findings
            </div>
            <div className="note">Require follow-up review</div>
          </div>
        </div>
        
        <div style={{marginTop: '3mm'}}>
          <h4>Trending Indicators</h4>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Glucose Trend</td>
                <td className="value">Stable within normal range</td>
              </tr>
              <tr>
                <td className="label">Lipid Profile</td>
                <td className="value">Cholesterol slightly elevated, monitoring</td>
              </tr>
              <tr>
                <td className="label">Kidney Function</td>
                <td className="value">Normal creatinine and eGFR</td>
              </tr>
              <tr>
                <td className="label">Liver Function</td>
                <td className="value">All enzymes within normal limits</td>
              </tr>
            </tbody>
          </table>
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
        
        {(!data.vitalSigns?.length && !labResults?.length) && (
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
