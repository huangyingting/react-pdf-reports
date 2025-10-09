import React from 'react';
import { Patient, Provider, InsuranceInfo, LabReport, VisitReport, MedicalHistory } from '../../utils/zodSchemas';
import PatientPage from './PatientPage';
import MedicalHistoryPage from './MedicalHistoryPage';
import MedicationsPage from './MedicationsPage';
import LabReportsPage from './LabReportsPage';
import VisitNotesPage from './VisitNotesPage';
import './MedicalRecordsReport.css';

interface MedicalRecordsReportProps {
  patient: Patient;
  provider: Provider;
  insuranceInfo: InsuranceInfo;
  labReports?: LabReport[];
  visitReports?: VisitReport[];
  medicalHistory?: MedicalHistory;

  fontFamily?: string;
}

const MedicalRecordsReport: React.FC<MedicalRecordsReportProps> = ({ patient, provider, insuranceInfo, labReports, visitReports, medicalHistory, fontFamily = "'Arial', sans-serif" }) => {
  return (
    <div
      className="medical-records-report"
      id="medical-records-report"
      style={{ fontFamily: fontFamily }}
    >
      {/* Page 1: Patient Demographics */}
      <PatientPage
        patient={patient}
        provider={provider}
        insuranceInfo={insuranceInfo}
        labReports={labReports}
        medicalHistory={medicalHistory}
      />

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 2: Medical History */}
      {medicalHistory && (
        <MedicalHistoryPage
          patient={patient}
          provider={provider}
          medicalHistory={medicalHistory}
        />
      )}

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 3: Medications */}
      <MedicationsPage
        patient={patient}
        medicalHistory={medicalHistory}
      />

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 4: Lab Results */}
      <LabReportsPage
        patient={patient}
        provider={provider}
        labReports={labReports}
        visitReport={(visitReports && visitReports.length > 0 ? visitReports[0] : undefined)}
      />

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 5: Visit Notes */}
      <VisitNotesPage
        patient={patient}
        provider={provider}
        visitReport={(visitReports && visitReports.length > 0 ? visitReports[0] : undefined)}
        medicalHistory={medicalHistory}
      />
    </div>
  );
};

export default MedicalRecordsReport;
