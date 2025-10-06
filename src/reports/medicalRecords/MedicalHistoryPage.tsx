import React from 'react';
import { MedicalRecord } from '../../utils/types';

interface MedicalHistoryPageProps {
  data: MedicalRecord;
}

const MedicalHistoryPage: React.FC<MedicalHistoryPageProps> = ({ data }) => {
  const { medicalHistory, patient } = data;
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <div className="medical-page history-page">
      <header className="medical-page-header">
        <div className="hospital-info">
          <h2>Springfield Medical Center</h2>
          <p>123 Healthcare Blvd, Springfield, IL 62701 | (555) 555-0100</p>
        </div>
        <div className="page-title">
          <h1>Medical History</h1>
          <p className="generated-date">Generated: {currentDate}</p>
        </div>
      </header>

      <main className="medical-page-content">
        {/* Compact Allergies Section */}
        <section className="allergies-section compact-section">
          <h3>Allergies</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Allergen</th>
                <th>Reaction</th>
                <th>Severity</th>
                <th>Date Identified</th>
              </tr>
            </thead>
            <tbody>
              {(medicalHistory.allergies || []).map((allergy, index) => (
                <tr key={index}>
                  <td><strong>{allergy.allergen}</strong></td>
                  <td>{allergy.reaction}</td>
                  <td>
                    <span className={`severity-badge severity-${(allergy.severity || 'none').toLowerCase()}`}>
                      {allergy.severity || 'Unknown'}
                    </span>
                  </td>
                  <td>{allergy.dateIdentified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Compact Chronic Conditions */}
        <section className="chronic-conditions-section compact-section">
          <h3>Chronic Conditions</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Condition</th>
                <th>Diagnosed</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {(medicalHistory.chronicConditions || []).map((condition, index) => (
                <tr key={index}>
                  <td><strong>{condition.condition}</strong></td>
                  <td>{condition.diagnosedDate}</td>
                  <td>
                    <span className={`status-badge status-${(condition.status || 'unknown').toLowerCase()}`}>
                      {condition.status || 'Unknown'}
                    </span>
                  </td>
                  <td>{condition.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Compact Surgical History */}
        <section className="surgical-history-section compact-section">
          <h3>Surgical History</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Procedure</th>
                <th>Date</th>
                <th>Hospital</th>
                <th>Surgeon</th>
                <th>Complications</th>
              </tr>
            </thead>
            <tbody>
              {(medicalHistory.surgicalHistory || []).map((surgery, index) => (
                <tr key={index}>
                  <td><strong>{surgery.procedure}</strong></td>
                  <td>{surgery.date}</td>
                  <td>{surgery.hospital}</td>
                  <td>{surgery.surgeon}</td>
                  <td>{surgery.complications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Compact Family History */}
        <section className="family-history-section compact-section">
          <h3>Family History</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Relation</th>
                <th>Medical Conditions</th>
                <th>Age at Death</th>
                <th>Cause of Death</th>
              </tr>
            </thead>
            <tbody>
              {(medicalHistory.familyHistory || []).map((family, index) => (
                <tr key={index}>
                  <td><strong>{family.relation}</strong></td>
                  <td>{(family.conditions || []).join(', ')}</td>
                  <td>{family.ageAtDeath}</td>
                  <td>{family.causeOfDeath}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Risk Factors Summary */}
        <section className="risk-factors compact-section">
          <h3>Risk Assessment Summary</h3>
          <div className="risk-grid">
            <div className="risk-category">
              <h4>High Risk Factors</h4>
              <ul>
                <li>Family history of heart disease</li>
                <li>Family history of diabetes</li>
                <li>Multiple drug allergies</li>
              </ul>
            </div>
            <div className="risk-category">
              <h4>Moderate Risk Factors</h4>
              <ul>
                <li>Age over 35</li>
                <li>Previous surgeries</li>
                <li>Chronic hypertension</li>
              </ul>
            </div>
            <div className="risk-category">
              <h4>Preventive Measures</h4>
              <ul>
                <li>Regular cardiac screening</li>
                <li>Diabetes monitoring</li>
                <li>Allergy identification bracelet</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="medical-page-footer">
        <div className="confidentiality-notice">
          <p><strong>CONFIDENTIAL:</strong> This document contains protected health information. 
          Unauthorized disclosure is prohibited by law.</p>
        </div>
        <div className="page-info">
          <span>Page 2 of 5</span>
          <span>Patient: {patient.firstName} {patient.lastName}</span>
          <span>MRN: {patient.id}</span>
        </div>
      </footer>
    </div>
  );
};

export default MedicalHistoryPage;
