import React from 'react';
import { Individual, Provider, InsuranceInfo, LabReport, VisitReport, MedicalHistory } from '../../utils/zodSchemas';
import PatientPage from './PatientPage';
import MedicalHistoryPage from './MedicalHistoryPage';
import MedicationsPage from './MedicationsPage';
import LabReportsPage from './LabReportsPage';
import VisitNotesPage from './VisitNotesPage';
import './MedicalRecordsReport.css';

interface MedicalRecordsReportProps {
  individual: Individual;
  provider: Provider;
  insuranceInfo: InsuranceInfo;
  labReports?: LabReport[];
  visitReports?: VisitReport[];
  medicalHistory?: MedicalHistory;

  fontFamily?: string;
}

const MedicalRecordsReport: React.FC<MedicalRecordsReportProps> = ({ individual, provider, insuranceInfo, labReports, visitReports, medicalHistory, fontFamily = "'Arial', sans-serif" }) => {
  return (
    <div
      className="medical-records-report"
      id="medical-records-report"
      style={{ fontFamily: fontFamily }}
    >
      {/* Page 1: Patient */}
      <PatientPage
        individual={individual}
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
          individual={individual}
          provider={provider}
          medicalHistory={medicalHistory}
        />
      )}

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 3: Medications */}
      <MedicationsPage
        individual={individual}
        provider={provider}
        medicalHistory={medicalHistory}
      />

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 4: Lab Results */}
      <LabReportsPage
        individual={individual}
        provider={provider}
        labReports={labReports}
        visitReport={(visitReports && visitReports.length > 0 ? visitReports[0] : undefined)}
      />

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 5: Visit Notes */}
      <VisitNotesPage
        individual={individual}
        provider={provider}
        visitReport={(visitReports && visitReports.length > 0 ? visitReports[0] : undefined)}
        medicalHistory={medicalHistory}
      />
    </div>
  );
};

export default MedicalRecordsReport;
