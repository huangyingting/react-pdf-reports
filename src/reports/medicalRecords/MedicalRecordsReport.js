import React from 'react';
import PatientDemographicsPage from './PatientDemographicsPage';
import MedicalHistoryPage from './MedicalHistoryPage';
import MedicationsPage from './MedicationsPage';
import LabResultsPage from './LabResultsPage';
import VisitNotesPage from './VisitNotesPage';
import './MedicalRecordsReport.css';

const MedicalRecordsReport = ({ data, fontFamily = "'Arial', sans-serif" }) => {
  return (
    <div 
      className="medical-records-report"
      id="medical-records-report" 
      style={{ fontFamily: fontFamily }}
    >
      {/* Page 1: Patient Demographics */}
      <PatientDemographicsPage data={data} />
      
      {/* Page Break */}
      <div className="page-break"></div>
      
      {/* Page 2: Medical History */}
      <MedicalHistoryPage data={data} />
      
      {/* Page Break */}
      <div className="page-break"></div>
      
      {/* Page 3: Medications */}
      <MedicationsPage data={data} />
      
      {/* Page Break */}
      <div className="page-break"></div>
      
      {/* Page 4: Lab Results */}
      <LabResultsPage data={data} />
      
      {/* Page Break */}
      <div className="page-break"></div>
      
      {/* Page 5: Visit Notes */}
      <VisitNotesPage data={data} />
    </div>
  );
};

export default MedicalRecordsReport;