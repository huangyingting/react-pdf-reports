import React from 'react';
import { Patient, Provider, MedicalHistory } from '../../utils/zodSchemas';

interface MedicationsPageProps {
  patient: Patient;
  provider: Provider;
  medicalHistory?: MedicalHistory;
}

const MedicationsPage: React.FC<MedicationsPageProps> = ({ patient, provider, medicalHistory }) => {
  const medications = medicalHistory?.medications;
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="medical-page medications-page">
      <header className="medical-page-header">
        <div className="hospital-info">
          <h2>{provider?.facilityName || 'Healthcare Facility'}</h2>
          <p>
            {provider?.facilityAddress?.street && provider?.facilityAddress?.city && provider?.facilityAddress?.state && provider?.facilityAddress?.zipCode
              ? `${provider.facilityAddress.street}, ${provider.facilityAddress.city}, ${provider.facilityAddress.state} ${provider.facilityAddress.zipCode}`
              : '123 Healthcare Blvd, Springfield, IL 62701'}
            {' | '}
            {provider?.facilityPhone || '(555) 555-0100'}
          </p>
        </div>
        <div className="page-title">
          <h1>Current Medications & Drug History</h1>
          <p className="generated-date">Generated: {currentDate}</p>
        </div>
      </header>

      <main className="medical-page-content">
        {/* Active Medications Table */}
        <section className="current-medications-section compact-section">
          <h3>Active Medications</h3>
          <table className="medications-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Strength</th>
                <th>Dosage</th>
                <th>Purpose</th>
                <th>Prescriber</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {(medications?.current || []).map((medication, index) => (
                <tr key={index}>
                  <td><strong>{medication.name}</strong></td>
                  <td>{medication.strength}</td>
                  <td>{medication.dosage}</td>
                  <td>{medication.purpose}</td>
                  <td>{medication.prescribedBy}</td>
                  <td>{medication.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Medication Instructions */}
          <div className="medication-instructions">
            <h4>Special Instructions</h4>
            <table className="instructions-table">
              <tbody>
                {(medications?.current || []).map((medication, index) => (
                  <tr key={index}>
                    <td><strong>{medication.name}:</strong></td>
                    <td>{medication.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Discontinued Medications */}
        <section className="discontinued-medications-section compact-section">
          <h3>Discontinued Medications</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Strength</th>
                <th>Reason for Discontinuation</th>
                <th>Discontinued Date</th>
                <th>Prescriber</th>
              </tr>
            </thead>
            <tbody>
              {(medications?.discontinued || []).map((medication, index) => (
                <tr key={index}>
                  <td><strong>{medication.name}</strong></td>
                  <td>{medication.strength}</td>
                  <td>{medication.reason}</td>
                  <td>{medication.discontinuedDate}</td>
                  <td>{medication.prescribedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Critical Drug Information */}
        <section className="drug-safety-section compact-section">
          <h3>Drug Safety & Monitoring</h3>
          <div className="safety-grid">
            <div className="safety-column">
              <h4>Drug Allergies</h4>
              <div className="alert-item critical">
                <span className="drug-name">Penicillin</span>
                <span className="reaction">Severe: Rash, breathing difficulty</span>
              </div>
              <div className="alert-item warning">
                <span className="drug-name">Shellfish</span>
                <span className="reaction">Moderate: Hives, swelling</span>
              </div>
            </div>

            <div className="safety-column">
              <h4>Drug Interactions</h4>
              <ul className="interaction-list">
                <li>Monitor potassium levels with Lisinopril</li>
                <li>Avoid grapefruit juice with Atorvastatin</li>
                <li>Take Metformin with food</li>
              </ul>
            </div>

            <div className="safety-column">
              <h4>Monitoring Requirements</h4>
              <table className="monitoring-table">
                <tbody>
                  <tr>
                    <td>Blood Pressure:</td>
                    <td>Weekly (Lisinopril)</td>
                  </tr>
                  <tr>
                    <td>Liver Function:</td>
                    <td>Annually (Atorvastatin)</td>
                  </tr>
                  <tr>
                    <td>Kidney Function:</td>
                    <td>Every 6 months (Metformin)</td>
                  </tr>
                  <tr>
                    <td>HbA1c:</td>
                    <td>Every 3 months (Diabetes)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Medication Compliance & Notes */}
        <section className="compliance-section compact-section">
          <h3>Medication Management</h3>
          <div className="compliance-grid">
            <div className="compliance-item">
              <h4>Pharmacy Information</h4>
              <p><strong>Preferred Pharmacy:</strong> Springfield Pharmacy<br />
                <strong>Address:</strong> 456 Main St, Springfield, IL<br />
                <strong>Phone:</strong> (555) 987-6543</p>
            </div>
            <div className="compliance-item">
              <h4>Refill Schedule</h4>
              <table className="refill-table">
                <tbody>
                  <tr>
                    <td>Lisinopril:</td>
                    <td>30-day supply, 5 refills</td>
                  </tr>
                  <tr>
                    <td>Metformin:</td>
                    <td>90-day supply, 3 refills</td>
                  </tr>
                  <tr>
                    <td>Atorvastatin:</td>
                    <td>30-day supply, 5 refills</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="compliance-item">
              <h4>Compliance Notes</h4>
              <p>Patient reports good adherence to medication regimen.
                Uses pill organizer for daily medications. No missed doses reported
                in past month. Next medication review scheduled for December 2024.</p>
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
          <span>Page 3 of 5</span>
          <span>Patient: {patient.firstName} {patient.lastName}</span>
          <span>MRN: {patient.id}</span>
        </div>
      </footer>
    </div>
  );
};

export default MedicationsPage;
