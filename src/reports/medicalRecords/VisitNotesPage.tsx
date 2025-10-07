import React from 'react';
import { MedicalRecord, VisitReportData } from '../../utils/types';

interface VisitNotesPageProps {
  data: MedicalRecord;
  visitReportData?: VisitReportData;
}

const VisitNotesPage: React.FC<VisitNotesPageProps> = ({ data, visitReportData }) => {
  const { patient } = data;
  const currentDate = new Date().toLocaleDateString();
  
  const renderRecentVisits = () => {
    if (!visitReportData?.visit) return null;

    const visit = visitReportData.visit;
    const vitalSigns = visitReportData.vitalSigns;

    return (
      <div className="compact-section">
        <h3>Recent Visit Notes</h3>
        
        <div className="visit-container">
          <h4 className="visit-header">
            {visit.type} - {visit.date} - {visit.provider}
          </h4>
          
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Chief Complaint</td>
                <td className="value">{visit.chiefComplaint}</td>
              </tr>
              <tr>
                <td className="label">Vital Signs</td>
                <td className="value">
                  BP: {vitalSigns?.bloodPressure || 'N/A'}, HR: {vitalSigns?.heartRate || 'N/A'}, 
                  Temp: {vitalSigns?.temperature || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="assessment-plan-grid">
            <div className="assessment-plan-container">
              <div className="assessment-section">
                <h4>Assessment</h4>
                <div className="assessment-list">
                  {(Array.isArray(visit.assessment) ? visit.assessment : [visit.assessment]).filter(Boolean).slice(0, 3).map((item, idx) => (
                    <div key={idx} className="assessment-item">• {item}</div>
                  ))}
                </div>
              </div>
              <div className="plan-section">
                <h4>Plan</h4>
                <div className="plan-list">
                  {(Array.isArray(visit.plan) ? visit.plan : [visit.plan]).filter(Boolean).slice(0, 3).map((item, idx) => (
                    <div key={idx} className="plan-item">• {item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTreatmentSummary = () => {
    const visit = visitReportData?.visit;
    const currentMeds = data.medications?.current || [];
    const chronicConditions = data.medicalHistory?.chronicConditions || [];

    return (
      <div className="compact-section">
        <h3>Current Treatment Summary</h3>
        <div className="reference-grid">
          <div className="reference-item">
            <strong>Active Diagnoses</strong>
            <div className="diagnosis-list">
              {visit?.assessment && visit.assessment.length > 0 ? (
                visit.assessment.slice(0, 3).map((diag, idx) => (
                  <div key={idx} className="diagnosis-item">• {diag}</div>
                ))
              ) : chronicConditions.length > 0 ? (
                chronicConditions.slice(0, 3).map((condition, idx) => (
                  <div key={idx} className="diagnosis-item">• {condition.condition} ({condition.status})</div>
                ))
              ) : (
                <div className="diagnosis-item">• No active diagnoses documented</div>
              )}
            </div>
          </div>
          <div className="reference-item">
            <strong>Current Medications</strong>
            <div className="medication-list">
              {currentMeds.length > 0 ? (
                currentMeds.slice(0, 3).map((med, idx) => (
                  <div key={idx} className="medication-item">• {med.name} {med.strength} {med.dosage}</div>
                ))
              ) : (
                <div className="medication-item">• No current medications documented</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="treatment-monitoring">
          <h4>Visit Plan & Follow-up</h4>
          <table className="info-table">
            <tbody>
              {visit?.plan && visit.plan.length > 0 ? (
                visit.plan.slice(0, 4).map((planItem, idx) => (
                  <tr key={idx}>
                    <td className="label">Plan Item {idx + 1}</td>
                    <td className="value">{planItem}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="label">Treatment Plan</td>
                  <td className="value">No specific treatment plan documented</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderProviderNotes = () => {
    const visit = visitReportData?.visit;
    const provider = visitReportData?.provider;
    const allergies = data.medicalHistory?.allergies || [];

    return (
      <div className="compact-section">
        <h3>Provider Information & Clinical Notes</h3>
        <div className="risk-grid">
          <div className="risk-category">
            <h4>Treating Provider</h4>
            <ul className="provider-notes-list">
              <li><strong>Name:</strong> {provider?.name || visit?.provider || 'Not specified'}</li>
              <li><strong>Specialty:</strong> {provider?.specialty || 'Not specified'}</li>
              <li><strong>Contact:</strong> {provider?.phone || 'Not specified'}</li>
            </ul>
          </div>
          <div className="risk-category">
            <h4>Allergies & Alerts</h4>
            <ul className="provider-notes-list">
              {allergies.length > 0 ? (
                allergies.slice(0, 3).map((allergy, idx) => (
                  <li key={idx}>⚠️ {allergy.allergen} ({allergy.severity})</li>
                ))
              ) : (
                <li>No known allergies</li>
              )}
            </ul>
          </div>
          <div className="risk-category">
            <h4>Visit Details</h4>
            <ul className="provider-notes-list">
              <li><strong>Visit Type:</strong> {visit?.type || 'N/A'}</li>
              <li><strong>Visit Date:</strong> {visit?.date || 'N/A'}</li>
              <li><strong>Duration:</strong> {visit?.duration || 'N/A'}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderVisitSummary = () => {
    const visit = visitReportData?.visit;
    const vitalSigns = visitReportData?.vitalSigns;
    const lastVisitDate = visit?.date || 'N/A';
    
    return (
      <div className="compact-section">
        <h3>Visit Summary</h3>
        <div className="reference-grid">
          <div className="reference-item">
            <strong>Visit History</strong>
            <div>Visit documented on {lastVisitDate}</div>
            <div className="note">Chief Complaint: {visit?.chiefComplaint || 'Not specified'}</div>
          </div>
          <div className="reference-item">
            <strong>Visit Duration</strong>
            <div>{visit?.duration || 'Not specified'}</div>
            <div className="note">Visit Type: {visit?.type || 'N/A'}</div>
          </div>
        </div>
        
        <div className="clinical-trends">
          <h4>Vital Signs Summary</h4>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Blood Pressure</td>
                <td className="value">{vitalSigns?.bloodPressure || 'Not recorded'}</td>
              </tr>
              <tr>
                <td className="label">Heart Rate</td>
                <td className="value">{vitalSigns?.heartRate || 'Not recorded'}</td>
              </tr>
              <tr>
                <td className="label">Temperature</td>
                <td className="value">{vitalSigns?.temperature || 'Not recorded'}</td>
              </tr>
              {vitalSigns?.respiratoryRate && (
                <tr>
                  <td className="label">Respiratory Rate</td>
                  <td className="value">{vitalSigns.respiratoryRate}</td>
                </tr>
              )}
              {vitalSigns?.oxygenSaturation && (
                <tr>
                  <td className="label">Oxygen Saturation</td>
                  <td className="value">{vitalSigns.oxygenSaturation}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* First Page: Recent Visit Notes */}
      <div className="medical-page">
        <div className="medical-page-header">
          <div className="hospital-info">
            <h2>{visitReportData?.provider?.facilityName || data.provider?.facilityName || 'Healthcare Facility'}</h2>
            <p>
              {visitReportData?.provider?.facilityAddress?.street && visitReportData?.provider?.facilityAddress?.city ? 
                `${visitReportData.provider.facilityAddress.street}, ${visitReportData.provider.facilityAddress.city}, ${visitReportData.provider.facilityAddress.state} ${visitReportData.provider.facilityAddress.zipCode}` :
                data.provider?.facilityAddress?.street && data.provider?.facilityAddress?.city ?
                `${data.provider.facilityAddress.street}, ${data.provider.facilityAddress.city}, ${data.provider.facilityAddress.state} ${data.provider.facilityAddress.zipCode}` :
                '123 Medical Center Drive, Healthcare City, HC 12345'
              } | Phone: {visitReportData?.provider?.facilityPhone || data.provider?.facilityPhone || '(555) 123-4567'}
            </p>
          </div>
          <div className="page-title">
            <h1>Clinical Visit Notes</h1>
            <p className="generated-date">Generated: {currentDate}</p>
          </div>
        </div>

        <div className="medical-page-content">
          {renderRecentVisits()}
          
          {!visitReportData?.visit && (
            <div className="no-data">
              No visit notes available
            </div>
          )}
        </div>

        <div className="medical-page-footer">
          <div className="confidentiality-notice">
            <p><strong>CONFIDENTIAL MEDICAL RECORD:</strong> This document contains privileged and confidential information intended only for the addressee. If you have received this in error, please notify the sender immediately.</p>
          </div>
          <div className="page-info">
            <span>Patient ID: {patient?.id || 'N/A'} | DOB: {patient?.dateOfBirth || 'N/A'}</span>
            <span>Page 5a of 5 | Visit Notes - Recent Visits</span>
          </div>
        </div>
      </div>

      <div className="page-break"></div>

      {/* Second Page: Treatment Summary and Provider Notes */}
      <div className="medical-page">
        <div className="medical-page-header">
          <div className="hospital-info">
            <h2>{visitReportData?.provider?.facilityName || data.provider?.facilityName || 'Healthcare Facility'}</h2>
            <p>
              {visitReportData?.provider?.facilityAddress?.street && visitReportData?.provider?.facilityAddress?.city ? 
                `${visitReportData.provider.facilityAddress.street}, ${visitReportData.provider.facilityAddress.city}, ${visitReportData.provider.facilityAddress.state} ${visitReportData.provider.facilityAddress.zipCode}` :
                data.provider?.facilityAddress?.street && data.provider?.facilityAddress?.city ?
                `${data.provider.facilityAddress.street}, ${data.provider.facilityAddress.city}, ${data.provider.facilityAddress.state} ${data.provider.facilityAddress.zipCode}` :
                '123 Medical Center Drive, Healthcare City, HC 12345'
              } | Phone: {visitReportData?.provider?.facilityPhone || data.provider?.facilityPhone || '(555) 123-4567'}
            </p>
          </div>
          <div className="page-title">
            <h1>Treatment Summary & Care Coordination</h1>
            <p className="generated-date">Generated: {currentDate}</p>
          </div>
        </div>

        <div className="medical-page-content">
          {renderTreatmentSummary()}
          {renderProviderNotes()}
          {renderVisitSummary()}
        </div>

        <div className="medical-page-footer">
          <div className="confidentiality-notice">
            <p><strong>CONFIDENTIAL MEDICAL RECORD:</strong> This document contains privileged and confidential information intended only for the addressee. If you have received this in error, please notify the sender immediately.</p>
          </div>
          <div className="page-info">
            <span>Patient ID: {patient?.id || 'N/A'} | DOB: {patient?.dateOfBirth || 'N/A'}</span>
            <span>Page 5b of 5 | Visit Notes - Summary & Coordination</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisitNotesPage;
