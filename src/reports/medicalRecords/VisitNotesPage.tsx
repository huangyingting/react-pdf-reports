import React from 'react';
import { MedicalRecord } from '../../utils/types';

interface VisitNotesPageProps {
  data: MedicalRecord;
}

const VisitNotesPage: React.FC<VisitNotesPageProps> = ({ data }) => {
  const { visitNotes, patient } = data;
  const currentDate = new Date().toLocaleDateString();
  
  const renderRecentVisits = () => {
    const visits = visitNotes || [];
    if (visits.length === 0) return null;

    return (
      <div className="compact-section">
        <h3>Recent Visit Notes</h3>
        
        {visits.slice(0, 2).map((visit, index) => (
          <div key={index} className="visit-container">
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
                    BP: {visit.vitals?.bloodPressure || 'N/A'}, HR: {visit.vitals?.heartRate || 'N/A'}, 
                    Temp: {visit.vitals?.temperature || 'N/A'}
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
        ))}
      </div>
    );
  };

  const renderTreatmentSummary = () => {
    return (
      <div className="compact-section">
        <h3>Current Treatment Summary</h3>
        <div className="reference-grid">
          <div className="reference-item">
            <strong>Active Diagnoses</strong>
            <div className="diagnosis-list">
              <div className="diagnosis-item">• Hypertension (well controlled)</div>
              <div className="diagnosis-item">• Type 2 Diabetes (fair control)</div>
              <div className="diagnosis-item">• Dyslipidemia (LDL elevated)</div>
            </div>
          </div>
          <div className="reference-item">
            <strong>Current Medications</strong>
            <div className="medication-list">
              <div className="medication-item">• Lisinopril 10mg daily</div>
              <div className="medication-item">• Metformin 500mg BID</div>
              <div className="medication-item">• Atorvastatin 20mg daily</div>
            </div>
          </div>
        </div>
        
        <div className="treatment-monitoring">
          <h4>Monitoring & Goals</h4>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Blood Pressure</td>
                <td className="value">Weekly at home, Target &lt; 130/80 mmHg</td>
              </tr>
              <tr>
                <td className="label">HbA1c</td>
                <td className="value">Every 3 months, Target &lt; 7.0%</td>
              </tr>
              <tr>
                <td className="label">Lipid Panel</td>
                <td className="value">Annually, LDL Target &lt; 100 mg/dL</td>
              </tr>
              <tr>
                <td className="label">Weight Management</td>
                <td className="value">Goal: 10-15 lbs weight loss</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderProviderNotes = () => {
    return (
      <div className="compact-section">
        <h3>Provider Communication Notes</h3>
        <div className="risk-grid">
          <div className="risk-category">
            <h4>Care Coordination</h4>
            <ul className="provider-notes-list">
              <li>Endocrinology referral pending</li>
              <li>Dietitian consultation scheduled</li>
              <li>Home health aide arranged</li>
            </ul>
          </div>
          <div className="risk-category">
            <h4>Patient Education</h4>
            <ul className="provider-notes-list">
              <li>Diabetes self-management reviewed</li>
              <li>Blood pressure monitoring taught</li>
              <li>Medication compliance discussed</li>
            </ul>
          </div>
          <div className="risk-category">
            <h4>Follow-up Schedule</h4>
            <ul className="provider-notes-list">
              <li>Next visit: 3 months</li>
              <li>Lab work: 6 weeks</li>
              <li>Emergency contact if concerns</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderVisitSummary = () => {
    const visits = visitNotes || [];
    const totalVisits = visits.length;
    const lastVisitDate = visits[0]?.date || 'N/A';
    
    return (
      <div className="compact-section">
        <h3>Visit Summary</h3>
        <div className="reference-grid">
          <div className="reference-item">
            <strong>Visit History</strong>
            <div>{totalVisits} visits in past 12 months</div>
            <div className="note">Last visit: {lastVisitDate}</div>
          </div>
          <div className="reference-item">
            <strong>Care Quality Metrics</strong>
            <div>Adherence: Good (85%)</div>
            <div className="note">Medication compliance tracking</div>
          </div>
        </div>
        
        <div className="clinical-trends">
          <h4>Clinical Trends</h4>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Blood Pressure Control</td>
                <td className="value">Improving trend, average 135/82 mmHg</td>
              </tr>
              <tr>
                <td className="label">Glucose Management</td>
                <td className="value">Stable, last HbA1c 7.2% (3 months ago)</td>
              </tr>
              <tr>
                <td className="label">Weight Tracking</td>
                <td className="value">Gradual decrease, lost 3 lbs since last visit</td>
              </tr>
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
            <h2>Metropolitan General Hospital</h2>
            <p>123 Medical Center Drive, Healthcare City, HC 12345 | Phone: (555) 123-4567</p>
          </div>
          <div className="page-title">
            <h1>Clinical Visit Notes</h1>
            <p className="generated-date">Generated: {currentDate}</p>
          </div>
        </div>

        <div className="medical-page-content">
          {renderRecentVisits()}
          
          {(!visitNotes || visitNotes.length === 0) && (
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
            <h2>Metropolitan General Hospital</h2>
            <p>123 Medical Center Drive, Healthcare City, HC 12345 | Phone: (555) 123-4567</p>
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
