import React from 'react';

const VisitNotesPage = ({ data }) => {
  const { visitNotes, patient } = data;
  const currentDate = new Date().toLocaleDateString();
  
  const renderRecentVisits = () => {
    const visits = visitNotes || [];
    if (visits.length === 0) return null;

    return (
      <div className="compact-section">
        <h3>Recent Visit Notes</h3>
        
        {visits.slice(0, 2).map((visit, index) => (
          <div key={index} style={{marginBottom: '4mm', border: '1px solid #ddd', borderRadius: '2mm', padding: '3mm'}}>
            <h4 style={{color: '#2c5aa0', fontSize: '11px', marginBottom: '2mm', borderBottom: '1px solid #eee', paddingBottom: '1mm'}}>
              {visit.type} - {visit.date} - Dr. {visit.physician}
            </h4>
            
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label">Chief Complaint</td>
                  <td className="value">{visit.chiefComplaint}</td>
                </tr>
                <tr>
                  <td className="label">History</td>
                  <td className="value">{visit.historyOfPresentIllness}</td>
                </tr>
                <tr>
                  <td className="label">Vital Signs</td>
                  <td className="value">
                    BP: {visit.vitalSigns?.bloodPressure || 'N/A'}, HR: {visit.vitalSigns?.heartRate || 'N/A'}, 
                    Temp: {visit.vitalSigns?.temperature || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div style={{marginTop: '2mm'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm'}}>
                <div>
                  <h4 style={{fontSize: '10px', marginBottom: '1mm'}}>Assessment</h4>
                  <div style={{fontSize: '9px'}}>
                    {visit.assessment?.slice(0, 3).map((item, idx) => (
                      <div key={idx} style={{marginBottom: '0.5mm'}}>• {item}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 style={{fontSize: '10px', marginBottom: '1mm'}}>Plan</h4>
                  <div style={{fontSize: '9px'}}>
                    {visit.plan?.slice(0, 3).map((item, idx) => (
                      <div key={idx} style={{marginBottom: '0.5mm'}}>• {item}</div>
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
            <div style={{fontSize: '9px', marginTop: '1mm'}}>
              <div>• Hypertension (well controlled)</div>
              <div>• Type 2 Diabetes (fair control)</div>
              <div>• Dyslipidemia (LDL elevated)</div>
            </div>
          </div>
          <div className="reference-item">
            <strong>Current Medications</strong>
            <div style={{fontSize: '9px', marginTop: '1mm'}}>
              <div>• Lisinopril 10mg daily</div>
              <div>• Metformin 500mg BID</div>
              <div>• Atorvastatin 20mg daily</div>
            </div>
          </div>
        </div>
        
        <div style={{marginTop: '3mm'}}>
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
            <ul style={{fontSize: '9px'}}>
              <li>Endocrinology referral pending</li>
              <li>Dietitian consultation scheduled</li>
              <li>Home health aide arranged</li>
            </ul>
          </div>
          <div className="risk-category">
            <h4>Patient Education</h4>
            <ul style={{fontSize: '9px'}}>
              <li>Diabetes self-management reviewed</li>
              <li>Blood pressure monitoring taught</li>
              <li>Medication compliance discussed</li>
            </ul>
          </div>
          <div className="risk-category">
            <h4>Follow-up Schedule</h4>
            <ul style={{fontSize: '9px'}}>
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
        <h3></h3>
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
        
        <div style={{marginTop: '3mm'}}>
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
        {renderTreatmentSummary()}
        {renderProviderNotes()}
        {renderVisitSummary()}
        
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
          <span>Patient ID: {patient?.patientId || 'N/A'} | DOB: {patient?.dateOfBirth || 'N/A'}</span>
          <span>Page 5 of 5 | Visit Notes</span>
        </div>
      </div>
    </div>
  );
};

export default VisitNotesPage;