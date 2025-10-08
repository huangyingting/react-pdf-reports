import React from 'react';
import { BasicData, LaboratoryReportData, VisitReportData, MedicalHistoryData } from '../../utils/constants';
import PatientDemographicsPage from './PatientDemographicsPage';
import MedicalHistoryPage from './MedicalHistoryPage';
import MedicationsPage from './MedicationsPage';
import LabResultsPage from './LabResultsPage';
import VisitNotesPage from './VisitNotesPage';
import './MedicalRecordsReport.css';

interface MedicalRecordsReportProps {
  data: BasicData;
  laboratoryReportData?: LaboratoryReportData[];
  visitReportData?: VisitReportData;
  medicalHistoryData?: MedicalHistoryData;
  fontFamily?: string;
}

const MedicalRecordsReport: React.FC<MedicalRecordsReportProps> = ({ data, laboratoryReportData, visitReportData, medicalHistoryData, fontFamily = "'Arial', sans-serif" }) => {
  return (
    <div 
      className="medical-records-report"
      id="medical-records-report" 
      style={{ fontFamily: fontFamily }}
    >
      {/* Page 1: Patient Demographics */}
      <PatientDemographicsPage data={data} medicalHistoryData={medicalHistoryData} />
      
      {/* Page Break */}
      <div className="page-break"></div>
      
      {/* Page 2: Medical History */}
      {medicalHistoryData && <MedicalHistoryPage data={medicalHistoryData} />}
      
      {/* Page Break */}
      <div className="page-break"></div>
      
      {/* Page 3: Medications */}
      <MedicationsPage data={data} medicalHistoryData={medicalHistoryData} />
      
      {/* Page Break */}
      <div className="page-break"></div>
      
      {/* Page 4: Lab Results */}
      <LabResultsPage 
        data={data} 
        laboratoryReportData={laboratoryReportData}
        visitReportData={visitReportData}
      />
      
      {/* Page Break */}
      <div className="page-break"></div>
      
      {/* Page 5: Visit Notes */}
      <VisitNotesPage 
        data={data}
        visitReportData={visitReportData}
        medicalHistoryData={medicalHistoryData}
      />
    </div>
  );
};

export default MedicalRecordsReport;
