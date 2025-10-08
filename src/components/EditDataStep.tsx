import React, { useState, useEffect } from 'react';
import './EditDataStep.css';
import { BasicData, ChronicCondition, PatientDemographics, InsuranceInfo, Provider, SurgicalHistory, FamilyHistory, DiscontinuedMedication, LaboratoryReportData, VisitReportData, MedicalHistoryData, MEDICAL_SPECIALTIES, LabTestType } from '../utils/types';
import { generateSecondaryInsuranceAndInsured } from '../utils/baseDataGenerator';

interface EditDataStepProps {
  medicalData: BasicData | null;
  laboratoryReportsMap?: Map<LabTestType, LaboratoryReportData>;
  visitReportsData?: VisitReportData[];
  medicalHistoryData?: MedicalHistoryData | null;
  onDataUpdated: (data: BasicData, labReportsMap?: Map<LabTestType, LaboratoryReportData>, visitDataArray?: VisitReportData[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Section {
  id: string;
  label: string;
  icon: string;
}

interface PatientInfoSectionProps {
  data: PatientDemographics;
  onChange: (field: string, value: any) => void;
}

interface InsuranceSectionProps {
  data: InsuranceInfo;
  onChange: (field: string, value: any) => void;
}

interface ProviderSectionProps {
  data: Provider;
  onChange: (field: string, value: any) => void;
}

interface MedicalHistorySectionProps {
  data: MedicalHistoryData;
  onChange: (field: string, value: any) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

interface LabResultsSectionProps {
  data: LaboratoryReportData;
  onChange: (updatedData: LaboratoryReportData) => void;
}

interface VitalSignsSectionProps {
  data: VisitReportData;
  onChange: (updatedData: VisitReportData) => void;
}

interface VisitNotesSectionProps {
  data: VisitReportData;
  onChange: (updatedData: VisitReportData) => void;
}

const EditDataStep: React.FC<EditDataStepProps> = ({ medicalData, laboratoryReportsMap, visitReportsData, medicalHistoryData, onDataUpdated, onNext, onBack }) => {
  const [editedData, setEditedData] = useState<BasicData | null>(null);
  const [editedLabReportsMap, setEditedLabReportsMap] = useState<Map<LabTestType, LaboratoryReportData>>(new Map());
  const [editedVisitReportsData, setEditedVisitReportsData] = useState<VisitReportData[]>([]);
  const [editedMedicalHistoryData, setEditedMedicalHistoryData] = useState<MedicalHistoryData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('patient');
  const [expandedLabReports, setExpandedLabReports] = useState<Set<LabTestType>>(new Set());
  const [expandedVisitReports, setExpandedVisitReports] = useState<Set<number>>(new Set());
  const [expandedMedicalSections, setExpandedMedicalSections] = useState<Set<string>>(new Set(['allergies', 'conditions', 'currentMeds', 'discontinuedMeds', 'surgicalHistory', 'familyHistory']));
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    if (medicalData) {
      setEditedData(JSON.parse(JSON.stringify(medicalData))); // Deep clone
    }
    if (laboratoryReportsMap) {
      const clonedMap = new Map<LabTestType, LaboratoryReportData>();
      laboratoryReportsMap.forEach((value, key) => {
        clonedMap.set(key, JSON.parse(JSON.stringify(value)));
      });
      setEditedLabReportsMap(clonedMap);
    }
    if (visitReportsData && visitReportsData.length > 0) {
      setEditedVisitReportsData(JSON.parse(JSON.stringify(visitReportsData)));
    }
    if (medicalHistoryData) {
      setEditedMedicalHistoryData(JSON.parse(JSON.stringify(medicalHistoryData))); // Deep clone
    }
  }, [medicalData, laboratoryReportsMap, visitReportsData, medicalHistoryData]);

  const updateData = (section: string, field: string, value: any) => {
    setEditedData(prev => {
      if (!prev) return prev;
      const updated = JSON.parse(JSON.stringify(prev)); // Deep clone
      const keys = field.split('.');
      let current: any = (updated as any)[section];
      
      // Navigate to the parent of the field to update
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}; // Create missing objects
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return updated;
    });
    setHasChanges(true);
  };

  const handleNext = () => {
    if (editedData) {
      onDataUpdated(editedData);
      onNext();
    }
  };

  const handleSaveChanges = () => {
    if (editedData) {
      onDataUpdated(editedData, editedLabReportsMap, editedVisitReportsData);
      setHasChanges(false);
    }
  };

  if (!editedData) {
    return (
      <div className="step">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading data for editing...</p>
        </div>
      </div>
    );
  }

  const sections: Section[] = [
    { id: 'patient', label: 'Patient', icon: 'user' },
    { id: 'insurance', label: 'Insurance', icon: 'card' },
    { id: 'provider', label: 'Provider', icon: 'stethoscope' },
    { id: 'medical', label: 'Medical History', icon: 'activity' },
    { id: 'labs', label: 'Lab Reports', icon: 'flask' },
    { id: 'vitals', label: 'Vital Signs', icon: 'heart' },
    { id: 'visits', label: 'Visit Notes', icon: 'clipboard' }
  ];

  const handleSectionChange = (sectionId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveSection(sectionId);
    // Smooth scroll the clicked tab into view
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  return (
    <div className="step">
      <div className="step-content">

        <div className="edit-interface">
          <div className="section-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={(e) => handleSectionChange(section.id, e)}
              >
                {section.icon === 'user' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
                {section.icon === 'card' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                )}
                {section.icon === 'stethoscope' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
                    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
                    <circle cx="20" cy="10" r="2"/>
                  </svg>
                )}
                {section.icon === 'activity' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                )}
                {section.icon === 'flask' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>
                    <path d="M8.5 2h7"/>
                    <path d="M7 16h10"/>
                  </svg>
                )}
                {section.icon === 'heart' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                )}
                {section.icon === 'clipboard' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  </svg>
                )}
                <span className="section-label">{section.label}</span>
              </button>
            ))}
          </div>

          <div className="edit-content" key={activeSection}>
            {activeSection === 'patient' && (
              <PatientInfoSection 
                data={editedData.patient} 
                onChange={(field, value) => updateData('patient', field, value)}
              />
            )}
            
            {activeSection === 'insurance' && (
              <InsuranceSection 
                data={editedData.insurance} 
                onChange={(field, value) => updateData('insurance', field, value)}
              />
            )}
            
            {activeSection === 'provider' && (
              <ProviderSection 
                data={editedData.provider} 
                onChange={(field, value) => updateData('provider', field, value)}
              />
            )}
            
            {activeSection === 'medical' && editedMedicalHistoryData && (
              <MedicalHistorySection 
                data={editedMedicalHistoryData}
                expandedSections={expandedMedicalSections}
                onToggleSection={(section) => {
                  const newExpanded = new Set(expandedMedicalSections);
                  if (newExpanded.has(section)) {
                    newExpanded.delete(section);
                  } else {
                    newExpanded.add(section);
                  }
                  setExpandedMedicalSections(newExpanded);
                }}
                onChange={(field, value) => {
                  setEditedMedicalHistoryData(prev => {
                    if (!prev) return prev;
                    const updated = JSON.parse(JSON.stringify(prev));
                    const keys = field.split('.');
                    let current: any = updated;
                    
                    for (let i = 0; i < keys.length - 1; i++) {
                      current = current[keys[i]];
                    }
                    current[keys[keys.length - 1]] = value;
                    setHasChanges(true);
                    return updated;
                  });
                }}
              />
            )}
            
            {/* Lab Results section: Data now managed via LaboratoryReportData */}
            {activeSection === 'labs' && (
              <>
                {editedLabReportsMap.size > 0 ? (
                  <div className="section">
                    <h3>Laboratory Reports ({editedLabReportsMap.size} reports)</h3>
                    <div className="lab-reports-accordion">
                      {Array.from(editedLabReportsMap.entries()).map(([testType, labData]) => {
                        const isExpanded = expandedLabReports.has(testType);
                        return (
                          <div key={testType} className="accordion-item">
                            <div 
                              className="accordion-header"
                              onClick={() => {
                                const newExpanded = new Set(expandedLabReports);
                                if (isExpanded) {
                                  newExpanded.delete(testType);
                                } else {
                                  newExpanded.add(testType);
                                }
                                setExpandedLabReports(newExpanded);
                              }}
                            >
                              <span className="accordion-icon">{isExpanded ? '▼' : '▶'}</span>
                              <span className="accordion-title">{labData.testName} ({testType})</span>
                              <span className="accordion-meta">{labData.results.length} results</span>
                            </div>
                            {isExpanded && (
                              <div className="accordion-content">
                                <LabResultsSection
                                  data={labData}
                                  onChange={(updated) => {
                                    const newMap = new Map(editedLabReportsMap);
                                    newMap.set(testType, updated);
                                    setEditedLabReportsMap(newMap);
                                    setHasChanges(true);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="section">
                    <h3>Laboratory Report</h3>
                    <p className="info-message">⚠️ No laboratory report data available. Please generate data first.</p>
                  </div>
                )}
              </>
            )}
            
            {/* Vital Signs section: Data now managed via VisitReportData array */}
            {activeSection === 'vitals' && (
              <>
                {editedVisitReportsData.length > 0 ? (
                  <div className="section">
                    <h3>Vital Signs ({editedVisitReportsData.length} visits)</h3>
                    <div className="lab-reports-accordion">
                      {editedVisitReportsData.map((visitData, index) => {
                        const isExpanded = expandedVisitReports.has(index);
                        return (
                          <div key={index} className="accordion-item">
                            <div 
                              className="accordion-header"
                              onClick={() => {
                                const newExpanded = new Set(expandedVisitReports);
                                if (isExpanded) {
                                  newExpanded.delete(index);
                                } else {
                                  newExpanded.add(index);
                                }
                                setExpandedVisitReports(newExpanded);
                              }}
                            >
                              <span className="accordion-icon">{isExpanded ? '▼' : '▶'}</span>
                              <span className="accordion-title">Visit {index + 1} - {visitData.visit.date}</span>
                              <span className="accordion-meta">{visitData.visit.type}</span>
                            </div>
                            {isExpanded && (
                              <div className="accordion-content">
                                <VitalSignsSection
                                  data={visitData}
                                  onChange={(updated) => {
                                    const newArray = [...editedVisitReportsData];
                                    newArray[index] = updated;
                                    setEditedVisitReportsData(newArray);
                                    setHasChanges(true);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="section">
                    <h3>Vital Signs</h3>
                    <p className="info-message">⚠️ No visit report data available. Please generate data first.</p>
                  </div>
                )}
              </>
            )}
            
            {/* Visit Notes section: Data now managed via VisitReportData array */}
            {activeSection === 'visits' && (
              <>
                {editedVisitReportsData.length > 0 ? (
                  <div className="section">
                    <h3>Visit Notes ({editedVisitReportsData.length} visits)</h3>
                    <div className="lab-reports-accordion">
                      {editedVisitReportsData.map((visitData, index) => {
                        const isExpanded = expandedVisitReports.has(index);
                        return (
                          <div key={index} className="accordion-item">
                            <div 
                              className="accordion-header"
                              onClick={() => {
                                const newExpanded = new Set(expandedVisitReports);
                                if (isExpanded) {
                                  newExpanded.delete(index);
                                } else {
                                  newExpanded.add(index);
                                }
                                setExpandedVisitReports(newExpanded);
                              }}
                            >
                              <span className="accordion-icon">{isExpanded ? '▼' : '▶'}</span>
                              <span className="accordion-title">Visit {index + 1} - {visitData.visit.date}</span>
                              <span className="accordion-meta">{visitData.visit.type}</span>
                            </div>
                            {isExpanded && (
                              <div className="accordion-content">
                                <VisitNotesSection
                                  data={visitData}
                                  onChange={(updated) => {
                                    const newArray = [...editedVisitReportsData];
                                    newArray[index] = updated;
                                    setEditedVisitReportsData(newArray);
                                    setHasChanges(true);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="section">
                    <h3>Visit Notes</h3>
                    <p className="info-message">⚠️ No visit report data available. Please generate data first.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="step-actions">
          <div className="action-buttons-group">
            <button className="btn btn-outline" onClick={onBack}>
              ← Back to Generate
            </button>
            
            {hasChanges && (
              <button className="btn btn-secondary" onClick={handleSaveChanges}>
                Save Changes
              </button>
            )}
            
            <button className="btn btn-primary" onClick={handleNext}>
              Continue to Export →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Patient Info Section Component
const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({ data, onChange }) => (
  <div className="section">
    <h3>Patient Demographics</h3>
    
    <div className="form-grid">
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          value={data.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Middle Initial</label>
        <input
          type="text"
          value={data.middleInitial || ''}
          onChange={(e) => onChange('middleInitial', e.target.value)}
          className="form-input"
          maxLength={1}
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          value={data.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          className="form-input"
        />
      </div>
            
      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="text"
          value={data.dateOfBirth}
          onChange={(e) => onChange('dateOfBirth', e.target.value)}
          className="form-input"
          placeholder="MM/DD/YYYY"
        />
      </div>
            
      <div className="form-group">
        <label>Medical Record Number</label>
        <input
          type="text"
          value={data.medicalRecordNumber}
          onChange={(e) => onChange('medicalRecordNumber', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>SSN</label>
        <input
          type="text"
          value={data.ssn}
          onChange={(e) => onChange('ssn', e.target.value)}
          className="form-input"
          placeholder="XXX-XX-XXXX"
        />
      </div>
      
      <div className="form-group">
        <label>Account Number</label>
        <input
          type="text"
          value={data.accountNumber || ''}
          onChange={(e) => onChange('accountNumber', e.target.value)}
          className="form-input"
          placeholder="Optional"
        />
      </div>
      
      <div className="form-group">
        <label>Gender</label>
        <select
          value={data.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          className="form-select"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          value={data.contact.phone}
          onChange={(e) => onChange('contact.phone', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={data.contact.email}
          onChange={(e) => onChange('contact.email', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Emergency Contact</label>
        <input
          type="text"
          value={data.contact.emergencyContact}
          onChange={(e) => onChange('contact.emergencyContact', e.target.value)}
          className="form-input"
          placeholder="Name and phone number"
        />
      </div>
    </div>

    <h4>Address Information</h4>
    <div className="form-grid">
      <div className="form-group">
        <label>Street Address</label>
        <input
          type="text"
          value={data.address.street}
          onChange={(e) => onChange('address.street', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>City</label>
        <input
          type="text"
          value={data.address.city}
          onChange={(e) => onChange('address.city', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>State</label>
        <input
          type="text"
          value={data.address.state}
          onChange={(e) => onChange('address.state', e.target.value)}
          className="form-input"
          maxLength={2}
        />
      </div>
      
      <div className="form-group">
        <label>ZIP Code</label>
        <input
          type="text"
          value={data.address.zipCode}
          onChange={(e) => onChange('address.zipCode', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  </div>
);

// Insurance Section Component
const InsuranceSection: React.FC<InsuranceSectionProps> = ({ data, onChange }) => {
  const handleAddSecondaryInsurance = () => {
    // Generate secondary insurance with populated data, excluding the primary insurance provider
    const result = generateSecondaryInsuranceAndInsured(data.primaryInsurance.provider);
    onChange('secondaryInsurance', result.secondaryInsurance);
    // Optionally, also update secondaryInsured if needed
    if (result.secondaryInsured) {
      onChange('secondaryInsured', result.secondaryInsured);
    }
  };

  const handleRemoveSecondaryInsurance = () => {
    onChange('secondaryInsurance', null);
  };

  return (
    <div className="section">
    <h3>Insurance</h3>

      <h4>Subscriber Information</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>Subscriber Name</label>
          <input
            type="text"
            value={data.subscriberName || ''}
            onChange={(e) => onChange('subscriberName', e.target.value)}
            className="form-input"
            placeholder="If different from patient"
          />
        </div>
        
        <div className="form-group">
          <label>Subscriber DOB</label>
          <input
            type="text"
            value={data.subscriberDOB || ''}
            onChange={(e) => onChange('subscriberDOB', e.target.value)}
            className="form-input"
            placeholder="MM/DD/YYYY"
          />
        </div>
        
        <div className="form-group">
          <label>Subscriber Gender</label>
          <select
            value={data.subscriberGender || ''}
            onChange={(e) => onChange('subscriberGender', e.target.value)}
            className="form-select"
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <h4>Primary Insurance</h4>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Insurance Company</label>
          <input
            type="text"
            value={data.primaryInsurance.provider}
            onChange={(e) => onChange('primaryInsurance.provider', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Policy Number</label>
          <input
            type="text"
            value={data.primaryInsurance.policyNumber}
            onChange={(e) => onChange('primaryInsurance.policyNumber', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Group Number</label>
          <input
            type="text"
            value={data.primaryInsurance.groupNumber}
            onChange={(e) => onChange('primaryInsurance.groupNumber', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Member ID</label>
          <input
            type="text"
            value={data.primaryInsurance.memberId}
            onChange={(e) => onChange('primaryInsurance.memberId', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Copay</label>
          <input
            type="text"
            value={data.primaryInsurance.copay || ''}
            onChange={(e) => onChange('primaryInsurance.copay', e.target.value)}
            className="form-input"
            placeholder="$20"
          />
        </div>
        
        <div className="form-group">
          <label>Deductible</label>
          <input
            type="text"
            value={data.primaryInsurance.deductible || ''}
            onChange={(e) => onChange('primaryInsurance.deductible', e.target.value)}
            className="form-input"
            placeholder="$1000"
          />
        </div>
      </div>



      <div style={{ marginTop: '20px' }}>
        <button 
          type="button"
          className={data.secondaryInsurance ? "btn btn-outline" : "btn btn-secondary"}
          onClick={data.secondaryInsurance ? handleRemoveSecondaryInsurance : handleAddSecondaryInsurance}
        >
          {data.secondaryInsurance ? '− Remove Secondary Insurance' : '+ Add Secondary Insurance'}
        </button>
      </div>

      {data.secondaryInsurance && (
        <>
          <h4>Secondary Insurance</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Insurance Company</label>
              <input
                type="text"
                value={data.secondaryInsurance.provider}
                onChange={(e) => onChange('secondaryInsurance.provider', e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Policy Number</label>
              <input
                type="text"
                value={data.secondaryInsurance.policyNumber}
                onChange={(e) => onChange('secondaryInsurance.policyNumber', e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Group Number</label>
              <input
                type="text"
                value={data.secondaryInsurance.groupNumber || ''}
                onChange={(e) => onChange('secondaryInsurance.groupNumber', e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Member ID</label>
              <input
                type="text"
                value={data.secondaryInsurance.memberId || ''}
                onChange={(e) => onChange('secondaryInsurance.memberId', e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Effective Date</label>
              <input
                type="text"
                value={data.secondaryInsurance.effectiveDate || ''}
                onChange={(e) => onChange('secondaryInsurance.effectiveDate', e.target.value)}
                className="form-input"
                placeholder="YYYY-MM-DD"
              />
            </div>
            
            <div className="form-group">
              <label>Copay</label>
              <input
                type="text"
                value={data.secondaryInsurance.copay || ''}
                onChange={(e) => onChange('secondaryInsurance.copay', e.target.value)}
                className="form-input"
                placeholder="$20"
              />
            </div>
            
            <div className="form-group">
              <label>Deductible</label>
              <input
                type="text"
                value={data.secondaryInsurance.deductible || ''}
                onChange={(e) => onChange('secondaryInsurance.deductible', e.target.value)}
                className="form-input"
                placeholder="$1000"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Provider Section Component
const ProviderSection: React.FC<ProviderSectionProps> = ({ data, onChange }) => (
  <div className="section">
    <h3>Primary Care Provider</h3>
    
    <div className="form-grid">
      <div className="form-group">
        <label>Provider Name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>NPI Number</label>
        <input
          type="text"
          value={data.npi}
          onChange={(e) => onChange('npi', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Specialty</label>
        <select
          value={data.specialty}
          onChange={(e) => onChange('specialty', e.target.value)}
          className="form-select"
        >
          {MEDICAL_SPECIALTIES.map(specialty => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Tax ID</label>
        <input
          type="text"
          value={data.taxId || ''}
          onChange={(e) => onChange('taxId', e.target.value)}
          className="form-input"
          placeholder="Optional"
        />
      </div>
      
      <div className="form-group">
        <label>Tax ID Type</label>
        <select
          value={data.taxIdType || ''}
          onChange={(e) => onChange('taxIdType', e.target.value as 'SSN' | 'EIN')}
          className="form-select"
        >
          <option value="">Select...</option>
          <option value="SSN">SSN</option>
          <option value="EIN">EIN</option>
        </select>
      </div>
    </div>

    <h4>Facility Information</h4>
    <div className="form-grid">
      <div className="form-group form-group-full">
        <label>Facility Name</label>
        <input
          type="text"
          value={data.facilityName || ''}
          onChange={(e) => onChange('facilityName', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Facility Phone</label>
        <input
          type="text"
          value={data.facilityPhone || ''}
          onChange={(e) => onChange('facilityPhone', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Facility Fax</label>
        <input
          type="text"
          value={data.facilityFax || ''}
          onChange={(e) => onChange('facilityFax', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Facility NPI</label>
        <input
          type="text"
          value={data.facilityNPI || ''}
          onChange={(e) => onChange('facilityNPI', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
    
    <h4>Provider Address</h4>
    <div className="form-grid">
      <div className="form-group form-group-full">
        <label>Street Address</label>
        <input
          type="text"
          value={data.address.street}
          onChange={(e) => onChange('address.street', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>City</label>
        <input
          type="text"
          value={data.address.city}
          onChange={(e) => onChange('address.city', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>State</label>
        <input
          type="text"
          value={data.address.state}
          onChange={(e) => onChange('address.state', e.target.value)}
          className="form-input"
          maxLength={2}
        />
      </div>
      
      <div className="form-group">
        <label>ZIP Code</label>
        <input
          type="text"
          value={data.address.zipCode}
          onChange={(e) => onChange('address.zipCode', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  </div>
);

// Medical History Section Component
const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ data, onChange, expandedSections, onToggleSection }) => (
  <div className="section">
    <h3>Medical History</h3>
    <div className="lab-reports-accordion">
      {/* Allergies Accordion */}
      <div className="accordion-item">
        <div 
          className="accordion-header"
          onClick={() => onToggleSection('allergies')}
        >
          <span className="accordion-icon">{expandedSections.has('allergies') ? '▼' : '▶'}</span>
          <span className="accordion-title">Allergies</span>
          <span className="accordion-meta">{(data.allergies || []).length} items</span>
        </div>
        {expandedSections.has('allergies') && (
          <div className="accordion-content">
            <div className="allergies-list">
      {(data.allergies || []).map((allergy, index) => (
        <div key={index} className="allergy-item">
          <div className="form-grid">
            <div className="form-group">
              <label>Allergen</label>
              <input
                type="text"
                value={allergy.allergen}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].allergen = e.target.value;
                  onChange('allergies', updated);
                }}
                className="form-input"
                placeholder="e.g., Penicillin"
              />
            </div>
            
            <div className="form-group">
              <label>Reaction</label>
              <input
                type="text"
                value={allergy.reaction}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].reaction = e.target.value;
                  onChange('allergies', updated);
                }}
                className="form-input"
                placeholder="e.g., Rash, Hives"
              />
            </div>
            
            <div className="form-group">
              <label>Severity</label>
              <select
                value={allergy.severity}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].severity = e.target.value;
                  onChange('allergies', updated);
                }}
                className="form-select"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Date Identified</label>
              <input
                type="text"
                value={allergy.dateIdentified}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].dateIdentified = e.target.value;
                  onChange('allergies', updated);
                }}
                className="form-input"
                placeholder="MM/DD/YYYY or Unknown"
              />
            </div>
          </div>
        </div>
      ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Conditions Accordion */}
      <div className="accordion-item">
        <div 
          className="accordion-header"
          onClick={() => onToggleSection('conditions')}
        >
          <span className="accordion-icon">{expandedSections.has('conditions') ? '▼' : '▶'}</span>
          <span className="accordion-title">Active Conditions</span>
          <span className="accordion-meta">{(data.chronicConditions || []).length} items</span>
        </div>
        {expandedSections.has('conditions') && (
          <div className="accordion-content">
    <div className="conditions-list">
      {(data.chronicConditions || []).map((condition: ChronicCondition, index: number) => (
        <div key={index} className="condition-item">
          <div className="condition-header">
            <span className="condition-number">#{index + 1}</span>
            <span className={`condition-status-badge status-${condition.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {condition.status}
            </span>
          </div>
          <div className="condition-body">
            <div className="form-group">
              <label>Condition Name</label>
              <input
                type="text"
                value={condition.condition}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].condition = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                className="form-input"
                placeholder="e.g., Type 2 Diabetes"
              />
            </div>
            
            <div className="form-group">
              <label>Diagnosed Date</label>
              <input
                type="text"
                value={condition.diagnosedDate}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].diagnosedDate = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                className="form-input"
                placeholder="MM/DD/YYYY"
              />
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select
                value={condition.status}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].status = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="Stable">Stable</option>
                <option value="Improving">Improving</option>
                <option value="Monitoring">Monitoring</option>
              </select>
            </div>
            
            <div className="form-group form-group-full">
              <label>Notes</label>
              <textarea
                value={condition.notes}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].notes = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                className="form-input"
                rows={2}
                placeholder="Additional information..."
              />
            </div>
          </div>
        </div>
      ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Medications Accordion */}
      <div className="accordion-item">
        <div 
          className="accordion-header"
          onClick={() => onToggleSection('currentMeds')}
        >
          <span className="accordion-icon">{expandedSections.has('currentMeds') ? '▼' : '▶'}</span>
          <span className="accordion-title">Current Medications</span>
          <span className="accordion-meta">{(data.medications.current || []).length} items</span>
        </div>
        {expandedSections.has('currentMeds') && (
          <div className="accordion-content">
    <div className="medications-list">
      {(data.medications.current || []).map((med, index) => (
        <div key={index} className="medication-item">
          <div className="medication-header">
            <span className="medication-number">💊 #{index + 1}</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Medication Name</label>
              <input
                type="text"
                value={med.name}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].name = e.target.value;
                  onChange('medications.current', updated);
                }}
                className="form-input"
                placeholder="e.g., Lisinopril"
              />
            </div>
            
            <div className="form-group">
              <label>Strength</label>
              <input
                type="text"
                value={med.strength}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].strength = e.target.value;
                  onChange('medications.current', updated);
                }}
                className="form-input"
                placeholder="e.g., 10mg"
              />
            </div>
            
            <div className="form-group">
              <label>Dosage</label>
              <input
                type="text"
                value={med.dosage}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].dosage = e.target.value;
                  onChange('medications.current', updated);
                }}
                className="form-input"
                placeholder="e.g., Once daily"
              />
            </div>
            
            <div className="form-group">
              <label>Purpose</label>
              <input
                type="text"
                value={med.purpose}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].purpose = e.target.value;
                  onChange('medications.current', updated);
                }}
                className="form-input"
                placeholder="e.g., Blood pressure control"
              />
            </div>
            
            <div className="form-group">
              <label>Prescribed By</label>
              <input
                type="text"
                value={med.prescribedBy}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].prescribedBy = e.target.value;
                  onChange('medications.current', updated);
                }}
                className="form-input"
                placeholder="Provider name"
              />
            </div>
            
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="text"
                value={med.startDate}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].startDate = e.target.value;
                  onChange('medications.current', updated);
                }}
                className="form-input"
                placeholder="MM/DD/YYYY"
              />
            </div>
            
            <div className="form-group form-group-full">
              <label>Instructions</label>
              <input
                type="text"
                value={med.instructions}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].instructions = e.target.value;
                  onChange('medications.current', updated);
                }}
                className="form-input"
                placeholder="Special instructions"
              />
            </div>
          </div>
        </div>
      ))}
            </div>
          </div>
        )}
      </div>

      {/* Discontinued Medications Accordion */}
      <div className="accordion-item">
        <div 
          className="accordion-header"
          onClick={() => onToggleSection('discontinuedMeds')}
        >
          <span className="accordion-icon">{expandedSections.has('discontinuedMeds') ? '▼' : '▶'}</span>
          <span className="accordion-title">Discontinued Medications</span>
          <span className="accordion-meta">{(data.medications.discontinued || []).length} items</span>
        </div>
        {expandedSections.has('discontinuedMeds') && (
          <div className="accordion-content">
    <div className="medications-list">
      {(data.medications.discontinued || []).map((med: DiscontinuedMedication, index: number) => (
        <div key={index} className="medication-item discontinued">
          <div className="medication-header">
            <span className="medication-number">🚫 #{index + 1}</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Medication Name</label>
              <input
                type="text"
                value={med.name}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].name = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                className="form-input"
                placeholder="e.g., Metformin"
              />
            </div>
            
            <div className="form-group">
              <label>Strength</label>
              <input
                type="text"
                value={med.strength}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].strength = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                className="form-input"
                placeholder="e.g., 500mg"
              />
            </div>
            
            <div className="form-group">
              <label>Reason for Discontinuation</label>
              <input
                type="text"
                value={med.reason}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].reason = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                className="form-input"
                placeholder="e.g., Side effects"
              />
            </div>
            
            <div className="form-group">
              <label>Discontinued Date</label>
              <input
                type="text"
                value={med.discontinuedDate}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].discontinuedDate = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                className="form-input"
                placeholder="MM/DD/YYYY"
              />
            </div>
            
            <div className="form-group">
              <label>Prescribed By</label>
              <input
                type="text"
                value={med.prescribedBy}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].prescribedBy = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                className="form-input"
                placeholder="Provider name"
              />
            </div>
          </div>
        </div>
      ))}
            </div>
          </div>
        )}
      </div>

      {/* Surgical History Accordion */}
      <div className="accordion-item">
        <div 
          className="accordion-header"
          onClick={() => onToggleSection('surgicalHistory')}
        >
          <span className="accordion-icon">{expandedSections.has('surgicalHistory') ? '▼' : '▶'}</span>
          <span className="accordion-title">Surgical History</span>
          <span className="accordion-meta">{(data.surgicalHistory || []).length} items</span>
        </div>
        {expandedSections.has('surgicalHistory') && (
          <div className="accordion-content">
    <div className="surgical-list">
      {(data.surgicalHistory || []).map((surgery: SurgicalHistory, index: number) => (
        <div key={index} className="surgery-item">
          <div className="surgery-header">
            <span className="surgery-number">🏥 #{index + 1}</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Procedure</label>
              <input
                type="text"
                value={surgery.procedure}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].procedure = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                className="form-input"
                placeholder="e.g., Appendectomy"
              />
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                value={surgery.date}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].date = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                className="form-input"
                placeholder="MM/DD/YYYY"
              />
            </div>
            
            <div className="form-group">
              <label>Hospital</label>
              <input
                type="text"
                value={surgery.hospital}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].hospital = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                className="form-input"
                placeholder="Hospital name"
              />
            </div>
            
            <div className="form-group">
              <label>Surgeon</label>
              <input
                type="text"
                value={surgery.surgeon}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].surgeon = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                className="form-input"
                placeholder="Surgeon name"
              />
            </div>
            
            <div className="form-group form-group-full">
              <label>Complications</label>
              <textarea
                value={surgery.complications}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].complications = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                className="form-input"
                rows={2}
                placeholder="Any complications or notes..."
              />
            </div>
          </div>
        </div>
      ))}
            </div>
          </div>
        )}
      </div>

      {/* Family History Accordion */}
      <div className="accordion-item">
        <div 
          className="accordion-header"
          onClick={() => onToggleSection('familyHistory')}
        >
          <span className="accordion-icon">{expandedSections.has('familyHistory') ? '▼' : '▶'}</span>
          <span className="accordion-title">Family History</span>
          <span className="accordion-meta">{(data.familyHistory || []).length} items</span>
        </div>
        {expandedSections.has('familyHistory') && (
          <div className="accordion-content">
    <div className="family-history-list">
      {(data.familyHistory || []).map((family: FamilyHistory, index: number) => (
        <div key={index} className="family-item">
          <div className="family-header">
            <span className="family-number">👨‍👩‍👧‍👦 #{index + 1}</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Relation</label>
              <input
                type="text"
                value={family.relation}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].relation = e.target.value;
                  onChange('familyHistory', updated);
                }}
                className="form-input"
                placeholder="e.g., Father, Mother"
              />
            </div>
            
            <div className="form-group">
              <label>Conditions (comma-separated)</label>
              <input
                type="text"
                value={family.conditions.join(', ')}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].conditions = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                  onChange('familyHistory', updated);
                }}
                className="form-input"
                placeholder="e.g., Diabetes, Heart Disease"
              />
            </div>
            
            <div className="form-group">
              <label>Age at Death</label>
              <input
                type="text"
                value={family.ageAtDeath}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].ageAtDeath = e.target.value;
                  onChange('familyHistory', updated);
                }}
                className="form-input"
                placeholder="e.g., 75 or Living"
              />
            </div>
            
            <div className="form-group">
              <label>Cause of Death</label>
              <input
                type="text"
                value={family.causeOfDeath}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].causeOfDeath = e.target.value;
                  onChange('familyHistory', updated);
                }}
                className="form-input"
                placeholder="e.g., Heart Attack or N/A"
              />
            </div>
          </div>
        </div>
      ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Lab Results Section Component - Updated to use LaboratoryReportData
const LabResultsSection: React.FC<LabResultsSectionProps> = ({ data, onChange }) => {
  if (!data) return null;

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
  };

  const handleResultChange = (resultIndex: number, field: string, value: any) => {
    const updated = { ...data };
    updated.results = [...data.results];
    updated.results[resultIndex] = { ...updated.results[resultIndex], [field]: value };
    onChange(updated);
  };

  return (
    <div className="section">
      <h3>Laboratory Report - {data.testName}</h3>
      
      <h4>Test Information</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>Test Name</label>
          <input
            type="text"
            value={data.testName}
            onChange={(e) => handleFieldChange('testName', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Specimen Type</label>
          <input
            type="text"
            value={data.specimenType}
            onChange={(e) => handleFieldChange('specimenType', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Collection Date</label>
          <input
            type="text"
            value={data.specimenCollectionDate}
            onChange={(e) => handleFieldChange('specimenCollectionDate', e.target.value)}
            className="form-input"
            placeholder="MM/DD/YYYY"
          />
        </div>
        
        <div className="form-group">
          <label>Report Date</label>
          <input
            type="text"
            value={data.reportDate}
            onChange={(e) => handleFieldChange('reportDate', e.target.value)}
            className="form-input"
            placeholder="MM/DD/YYYY"
          />
        </div>
        
        <div className="form-group">
          <label>Ordering Physician</label>
          <input
            type="text"
            value={data.orderingPhysician}
            onChange={(e) => handleFieldChange('orderingPhysician', e.target.value)}
            className="form-input"
          />
        </div>
      </div>
      
      <h4>Test Results ({data.results.length})</h4>
      <div className="lab-results-list">
        {data.results.map((result, index) => (
          <div key={index} className="lab-result-item">
            <div className="form-grid">
              <div className="form-group">
                <label>Parameter</label>
                <input
                  type="text"
                  value={result.parameter}
                  onChange={(e) => handleResultChange(index, 'parameter', e.target.value)}
                  className="form-input"
                  placeholder="e.g., WBC"
                />
              </div>
              
              <div className="form-group">
                <label>Value</label>
                <input
                  type="text"
                  value={result.value}
                  onChange={(e) => handleResultChange(index, 'value', e.target.value)}
                  className="form-input"
                  placeholder="e.g., 7.5"
                />
              </div>
              
              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  value={result.unit}
                  onChange={(e) => handleResultChange(index, 'unit', e.target.value)}
                  className="form-input"
                  placeholder="e.g., K/uL"
                />
              </div>
              
              <div className="form-group">
                <label>Reference Range</label>
                <input
                  type="text"
                  value={result.referenceRange}
                  onChange={(e) => handleResultChange(index, 'referenceRange', e.target.value)}
                  className="form-input"
                  placeholder="e.g., 4.5-11.0"
                />
              </div>
              
              <div className="form-group">
                <label>Flag</label>
                <select
                  value={result.flag}
                  onChange={(e) => handleResultChange(index, 'flag', e.target.value)}
                  className="form-select"
                >
                  <option value="">None</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                  <option value="Critical">Critical</option>
                  <option value="Abnormal">Abnormal</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Vital Signs Section Component - Updated to use VisitReportData
const VitalSignsSection: React.FC<VitalSignsSectionProps> = ({ data, onChange }) => {
  if (!data || !data.vitalSigns) return null;

  const handleVitalChange = (field: string, value: any) => {
    const updated = { ...data };
    updated.vitalSigns = { ...data.vitalSigns, [field]: value };
    onChange(updated);
  };

  const vitals = data.vitalSigns;

  return (
    <div className="section">
      <h3>Vital Signs</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Blood Pressure</label>
          <input
            type="text"
            value={vitals.bloodPressure}
            onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
            className="form-input"
            placeholder="120/80"
          />
        </div>
        
        <div className="form-group">
          <label>Heart Rate (bpm)</label>
          <input
            type="text"
            value={vitals.heartRate}
            onChange={(e) => handleVitalChange('heartRate', e.target.value)}
            className="form-input"
            placeholder="72"
          />
        </div>
        
        <div className="form-group">
          <label>Temperature (°F)</label>
          <input
            type="text"
            value={vitals.temperature}
            onChange={(e) => handleVitalChange('temperature', e.target.value)}
            className="form-input"
            placeholder="98.6"
          />
        </div>
        
        <div className="form-group">
          <label>Weight (lbs)</label>
          <input
            type="text"
            value={vitals.weight}
            onChange={(e) => handleVitalChange('weight', e.target.value)}
            className="form-input"
            placeholder="150"
          />
        </div>
        
        <div className="form-group">
          <label>Height</label>
          <input
            type="text"
            value={vitals.height}
            onChange={(e) => handleVitalChange('height', e.target.value)}
            className="form-input"
            placeholder="5'8&quot;"
          />
        </div>
        
        <div className="form-group">
          <label>BMI</label>
          <input
            type="text"
            value={vitals.bmi}
            onChange={(e) => handleVitalChange('bmi', e.target.value)}
            className="form-input"
            placeholder="22.8"
          />
        </div>
        
        <div className="form-group">
          <label>Oxygen Saturation (%)</label>
          <input
            type="text"
            value={vitals.oxygenSaturation}
            onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
            className="form-input"
            placeholder="98"
          />
        </div>
        
        <div className="form-group">
          <label>Respiratory Rate (breaths/min)</label>
          <input
            type="text"
            value={vitals.respiratoryRate}
            onChange={(e) => handleVitalChange('respiratoryRate', e.target.value)}
            className="form-input"
            placeholder="16"
          />
        </div>
      </div>
    </div>
  );
};

// Visit Notes Section Component - Updated to use VisitReportData
const VisitNotesSection: React.FC<VisitNotesSectionProps> = ({ data, onChange }) => {
  if (!data || !data.visit) return null;

  const handleVisitChange = (field: string, value: any) => {
    const updated = { ...data };
    updated.visit = { ...data.visit, [field]: value };
    onChange(updated);
  };

  const handleVitalChange = (field: string, value: any) => {
    const updated = { ...data };
    updated.vitalSigns = { ...data.vitalSigns, [field]: value };
    onChange(updated);
  };

  const visit = data.visit;

  return (
    <div className="section">
      <h3>Visit Notes</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Visit Date</label>
          <input
            type="text"
            value={visit.date}
                onChange={(e) => handleVisitChange('date', e.target.value)}
            className="form-input"
            placeholder="MM/DD/YYYY"
          />
        </div>
        
        <div className="form-group">
          <label>Visit Type</label>
          <input
            type="text"
            value={visit.type}
            onChange={(e) => handleVisitChange('type', e.target.value)}
            className="form-input"
            placeholder="e.g., Follow-up, Annual Physical"
          />
        </div>
        
        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            value={visit.duration}
            onChange={(e) => handleVisitChange('duration', e.target.value)}
            className="form-input"
            placeholder="e.g., 30 minutes"
          />
        </div>
        
        <div className="form-group">
          <label>Provider</label>
          <input
            type="text"
            value={visit.provider}
            onChange={(e) => handleVisitChange('provider', e.target.value)}
            className="form-input"
            placeholder="Provider name"
          />
        </div>
        
        <div className="form-group form-group-full">
          <label>Chief Complaint</label>
          <textarea
            value={visit.chiefComplaint}
            onChange={(e) => handleVisitChange('chiefComplaint', e.target.value)}
            className="form-input"
            rows={2}
            placeholder="Patient's main concern..."
          />
        </div>
        
        <div className="form-group form-group-full">
          <label>Assessment (comma-separated)</label>
          <textarea
            value={visit.assessment.join(', ')}
            onChange={(e) => handleVisitChange('assessment', e.target.value.split(',').map(a => a.trim()).filter(a => a))}
            className="form-input"
            rows={2}
            placeholder="Diagnoses and findings..."
          />
        </div>
        
        <div className="form-group form-group-full">
          <label>Plan (comma-separated)</label>
          <textarea
            value={visit.plan.join(', ')}
            onChange={(e) => handleVisitChange('plan', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
            className="form-input"
            rows={2}
            placeholder="Treatment plan and next steps..."
          />
        </div>
      </div>
      
      <h5>Vitals</h5>
      <div className="form-grid">
        <div className="form-group">
          <label>Blood Pressure</label>
          <input
            type="text"
            value={data.vitalSigns.bloodPressure}
            onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
            className="form-input"
            placeholder="120/80"
          />
        </div>
        
        <div className="form-group">
          <label>Heart Rate</label>
          <input
            type="number"
            value={data.vitalSigns.heartRate}
            onChange={(e) => handleVitalChange('heartRate', parseInt(e.target.value) || 0)}
            className="form-input"
            placeholder="72"
          />
        </div>
        
        <div className="form-group">
          <label>Temperature (°F)</label>
          <input
            type="number"
            step="0.1"
            value={data.vitalSigns.temperature}
            onChange={(e) => handleVitalChange('temperature', parseFloat(e.target.value) || 0)}
            className="form-input"
            placeholder="98.6"
          />
        </div>
        
        <div className="form-group">
          <label>Weight (lbs)</label>
          <input
            type="number"
            value={data.vitalSigns.weight}
            onChange={(e) => handleVitalChange('weight', parseInt(e.target.value) || 0)}
            className="form-input"
            placeholder="150"
          />
        </div>
        
        <div className="form-group">
          <label>Height</label>
          <input
            type="text"
            value={data.vitalSigns.height}
            onChange={(e) => handleVitalChange('height', e.target.value)}
            className="form-input"
            placeholder="5'8&quot;"
          />
        </div>
        
        <div className="form-group">
          <label>Oxygen Saturation (%)</label>
          <input
            type="number"
            value={data.vitalSigns.oxygenSaturation}
            onChange={(e) => handleVitalChange('oxygenSaturation', parseInt(e.target.value) || 0)}
            className="form-input"
            placeholder="98"
          />
        </div>
      </div>
    </div>
  );
};

export default EditDataStep;
