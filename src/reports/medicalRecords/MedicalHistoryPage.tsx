import React from 'react';
import { MedicationHistoryData } from '../../utils/types';

interface MedicalHistoryPageProps {
  data: MedicationHistoryData;
}

const MedicalHistoryPage: React.FC<MedicalHistoryPageProps> = ({ data }) => {
  const { patient, provider, allergies } = data;
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <div className="medical-page history-page">
      <header className="medical-page-header">
        <div className="hospital-info">
          <h2>{provider?.facilityName || 'Healthcare Facility'}</h2>
          <p>
            {provider?.facilityAddress?.street && provider?.facilityAddress?.city ? 
              `${provider.facilityAddress.street}, ${provider.facilityAddress.city}, ${provider.facilityAddress.state} ${provider.facilityAddress.zipCode}` :
              '123 Healthcare Blvd, Springfield, IL 62701'
            } | {provider?.facilityPhone || '(555) 555-0100'}
          </p>
        </div>
        <div className="page-title">
          <h1>Medication & Allergy History</h1>
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
              {(allergies || []).map((allergy, index) => (
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

        {/* Current Medications */}
        <section className="current-medications-section compact-section">
          <h3>Current Medications</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Strength/Dosage</th>
                <th>Purpose</th>
                <th>Prescribed By</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {(data.medications?.current || []).map((med, index) => (
                <tr key={index}>
                  <td><strong>{med.name}</strong></td>
                  <td>{med.strength} - {med.dosage}</td>
                  <td>{med.purpose}</td>
                  <td>{med.prescribedBy}</td>
                  <td>{med.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Discontinued Medications */}
        <section className="discontinued-medications-section compact-section">
          <h3>Discontinued Medications</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Strength</th>
                <th>Discontinued Date</th>
                <th>Reason</th>
                <th>Prescribed By</th>
              </tr>
            </thead>
            <tbody>
              {(data.medications?.discontinued || []).map((med, index) => (
                <tr key={index}>
                  <td><strong>{med.name}</strong></td>
                  <td>{med.strength}</td>
                  <td>{med.discontinuedDate}</td>
                  <td>{med.reason}</td>
                  <td>{med.prescribedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Medication Instructions Summary */}
        <section className="medication-instructions-section compact-section">
          <h3>Medication Instructions & Notes</h3>
          <div className="reference-grid">
            {(data.medications?.current || []).slice(0, 3).map((med, index) => (
              <div key={index} className="reference-item">
                <strong>{med.name}</strong>
                <div className="note">{med.instructions}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Medication Safety Summary */}
        <section className="medication-safety compact-section">
          <h3>Medication Safety Summary</h3>
          <div className="risk-grid">
            <div className="risk-category">
              <h4>Active Medications</h4>
              <ul>
                <li>Current: {data.medications?.current?.length || 0} medications</li>
                <li>Recently Discontinued: {data.medications?.discontinued?.length || 0}</li>
                <li>Pharmacy: {patient.pharmacy?.name || 'Not on file'}</li>
              </ul>
            </div>
            <div className="risk-category">
              <h4>Allergy Alerts</h4>
              <ul>
                <li>Documented Allergies: {allergies?.length || 0}</li>
                {allergies?.slice(0, 2).map((allergy, idx) => (
                  <li key={idx}>{allergy.allergen} - {allergy.severity}</li>
                ))}
              </ul>
            </div>
            <div className="risk-category">
              <h4>Safety Recommendations</h4>
              <ul>
                <li>Verify allergies before prescribing</li>
                <li>Check drug interactions</li>
                <li>Review medication adherence</li>
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
