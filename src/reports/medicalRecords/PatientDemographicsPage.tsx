import React from 'react';
import { MedicalRecord, LaboratoryReportData, MedicalHistoryData } from '../../utils/types';

interface PatientDemographicsPageProps {
  data: MedicalRecord;
  laboratoryReportData?: LaboratoryReportData;
  medicationHistoryData?: MedicalHistoryData;
}

const PatientDemographicsPage: React.FC<PatientDemographicsPageProps> = ({ data, laboratoryReportData, medicationHistoryData }) => {
  const { patient, provider } = data;
  const currentDate = new Date().toLocaleDateString();
  
  // Extract dynamic data from medicationHistoryData
  const allergiesText = medicationHistoryData?.allergies && medicationHistoryData.allergies.length > 0
    ? medicationHistoryData.allergies.map(a => `${a.allergen} (${a.severity})`).join(', ')
    : 'No known allergies';
  
  const chronicConditionsText = medicationHistoryData?.chronicConditions && medicationHistoryData.chronicConditions.length > 0
    ? medicationHistoryData.chronicConditions.map(c => c.condition).join(', ')
    : 'None documented';
  
  const currentMedicationsText = medicationHistoryData?.medications?.current && medicationHistoryData.medications.current.length > 0
    ? medicationHistoryData.medications.current.slice(0, 3).map(m => m.name).join(', ') + (medicationHistoryData.medications.current.length > 3 ? `, +${medicationHistoryData.medications.current.length - 3} more` : '')
    : 'No current medications';
  
  // Try to find blood type from laboratory report data
  const bloodTypeResult = laboratoryReportData?.results?.find(r => 
    r.parameter?.toLowerCase().includes('blood type') || r.parameter?.toLowerCase().includes('abo')
  );
  const bloodType = bloodTypeResult?.value || 'Not on file';
  const bloodTypeDate = laboratoryReportData?.reportDate;
  
  // Use pharmacy data from patient demographics
  const pharmacy = patient.pharmacy;
  
  return (
    <div className="medical-page demographics-page">
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
          <h1>Patient Demographics & Information</h1>
          <p className="generated-date">Generated: {currentDate}</p>
        </div>
      </header>

      <main className="medical-page-content">
        {/* Compact Patient Basic Information Table */}
        <section className="patient-basic-info compact-section">
          <h3>Patient Information</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Medical Record #:</td>
                <td className="value">{patient.id}</td>
                <td className="label">Full Name:</td>
                <td className="value">{patient.firstName} {patient.lastName}</td>
              </tr>
              <tr>
                <td className="label">Date of Birth:</td>
                <td className="value">{patient.dateOfBirth}</td>
                <td className="label">Age:</td>
                <td className="value">{patient.age} years</td>
              </tr>
              <tr>
                <td className="label">Gender:</td>
                <td className="value">{patient.gender}</td>
                <td className="label">SSN:</td>
                <td className="value">{patient.ssn}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Compact Contact Information */}
        <section className="contact-information compact-section">
          <h3>Contact Information</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Address:</td>
                <td className="value" colSpan={3}>
                  {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.zipCode}, {patient.address.country}
                </td>
              </tr>
              <tr>
                <td className="label">Phone:</td>
                <td className="value">{patient.contact.phone}</td>
                <td className="label">Email:</td>
                <td className="value">{patient.contact.email}</td>
              </tr>
              <tr>
                <td className="label">Emergency Contact:</td>
                <td className="value" colSpan={3}>{patient.contact.emergencyContact}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Compact Insurance Information */}
        <section className="insurance-information compact-section">
          <h3>Insurance Information</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Provider:</td>
                <td className="value">{patient.insurance.provider}</td>
                <td className="label">Policy Number:</td>
                <td className="value">{patient.insurance.policyNumber}</td>
              </tr>
              <tr>
                <td className="label">Group Number:</td>
                <td className="value">{patient.insurance.groupNumber}</td>
                <td className="label">Effective Date:</td>
                <td className="value">{patient.insurance.effectiveDate}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Medical Alerts Summary */}
        <section className="medical-alerts compact-section">
          <h3>Medical Alerts & Allergies</h3>
          <div className="alert-summary">
            <div className="alert-box critical">
              <strong>⚠️ DRUG ALLERGIES:</strong> {allergiesText}
            </div>
            <div className="alert-box warning">
              <strong>🩺 CHRONIC CONDITIONS:</strong> {chronicConditionsText}
            </div>
            <div className="alert-box info">
              <strong>💊 CURRENT MEDICATIONS:</strong> {currentMedicationsText}
            </div>
          </div>
        </section>

        {/* Quick Reference Summary */}
        <section className="quick-reference compact-section">
          <h3>Quick Reference</h3>
          <div className="reference-grid">
            <div className="reference-item">
              <strong>Primary Care Physician:</strong><br />
              {provider?.name || 'Not assigned'}<br />
              {provider?.specialty || 'General Practice'}<br />
              {provider?.phone || 'N/A'}
            </div>
            <div className="reference-item">
              <strong>Last Visit:</strong><br />
              No visits on record<br />
              N/A<br />
              N/A
            </div>
            <div className="reference-item">
              <strong>Blood Type:</strong><br />
              {bloodType}<br />
              <span className="note">{bloodTypeDate ? `Verified ${bloodTypeDate}` : 'Pending verification'}</span>
            </div>
            <div className="reference-item">
              <strong>Preferred Pharmacy:</strong><br />
              {pharmacy.name}<br />
              {pharmacy.address}<br />
              {pharmacy.phone}
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
          <span>Page 1 of 5</span>
          <span>Patient: {patient.firstName} {patient.lastName}</span>
          <span>MRN: {patient.id}</span>
        </div>
      </footer>
    </div>
  );
};

export default PatientDemographicsPage;
