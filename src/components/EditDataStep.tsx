import React, { useState, useEffect } from 'react';
import './EditDataStep.css';
import { MedicalRecord, Allergy, ChronicCondition, PatientDemographics, InsuranceInfo, Provider, MedicalHistory, Medications, SurgicalHistory, FamilyHistory, DiscontinuedMedication, LabTest, VitalSigns, VisitNote, MEDICAL_SPECIALTIES } from '../utils/types';
import { generateSecondaryInsuranceAndInsured } from '../utils/baseDataGenerator';

interface EditDataStepProps {
  medicalData: MedicalRecord | null;
  onDataUpdated: (data: MedicalRecord) => void;
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
  data: MedicalHistory;
  allergies: Allergy[];
  medications: Medications;
  onChange: (field: string, value: any) => void;
}

interface LabResultsSectionProps {
  data: LabTest[];
  onChange: (field: string, value: any) => void;
}

interface VitalSignsSectionProps {
  data: VitalSigns[];
  onChange: (field: string, value: any) => void;
}

interface VisitNotesSectionProps {
  data: VisitNote[];
  onChange: (field: string, value: any) => void;
}

const EditDataStep: React.FC<EditDataStepProps> = ({ medicalData, onDataUpdated, onNext, onBack }) => {
  const [editedData, setEditedData] = useState<MedicalRecord | null>(null);
  const [activeSection, setActiveSection] = useState<string>('patient');
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    if (medicalData) {
      setEditedData(JSON.parse(JSON.stringify(medicalData))); // Deep clone
    }
  }, [medicalData]);

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
      onDataUpdated(editedData);
      setHasChanges(false);
    }
  };

  if (!editedData) {
    return (
      <div className="edit-data-step">
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
    { id: 'medical', label: 'Clinical', icon: 'activity' }
  ];

  return (
    <div className="edit-data-step">
      <div className="step-content">
        <div className="step-header">
          <div>
            <h2>Review & Edit Data</h2>
            <p>Review and modify patient information before generating documents</p>
          </div>
        </div>

        <div className="edit-interface">
          <div className="section-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
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
                <span className="section-label">{section.label}</span>
              </button>
            ))}
          </div>

          <div className="edit-content">
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
            
            {activeSection === 'medical' && (
              <>
                <MedicalHistorySection 
                  data={editedData.medicalHistory} 
                  allergies={editedData.medicalHistory.allergies}
                  medications={editedData.medications}
                  onChange={(field, value) => {
                    // Handle medications separately since they're at root level
                    if (field.startsWith('medications.')) {
                      updateData('medications', field.replace('medications.', ''), value);
                    } else {
                      updateData('medicalHistory', field, value);
                    }
                  }}
                />
                
                <LabResultsSection 
                  data={editedData.labResults} 
                  onChange={(field, value) => updateData('labResults', field, value)}
                />
                
                <VitalSignsSection 
                  data={editedData.vitalSigns} 
                  onChange={(field, value) => updateData('vitalSigns', field, value)}
                />
                
                <VisitNotesSection 
                  data={editedData.visitNotes} 
                  onChange={(field, value) => updateData('visitNotes', field, value)}
                />
              </>
            )}
          </div>
        </div>

        <div className="edit-actions">
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
  );
};

// Patient Info Section Component
const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({ data, onChange }) => (
  <div className="form-section">
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
    <div className="form-section">

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
  <div className="form-section">
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
const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ data, allergies, medications, onChange }) => (
  <div className="form-section">
    <h3>Allergies ({(allergies || []).length})</h3>
    <div className="allergies-list">
      {(allergies || []).map((allergy, index) => (
        <div key={index} className="allergy-item">
          <div className="form-grid">
            <div className="form-group">
              <label>Allergen</label>
              <input
                type="text"
                value={allergy.allergen}
                onChange={(e) => {
                  const updated = [...(allergies || [])];
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
                  const updated = [...(allergies || [])];
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
                  const updated = [...(allergies || [])];
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
                  const updated = [...(allergies || [])];
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

    <h4>Active Conditions ({(data.chronicConditions || []).length})</h4>
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

    <h4>Current Medications ({(medications.current || []).length})</h4>
    <div className="medications-list">
      {(medications.current || []).map((med, index) => (
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
                  const updated = [...(medications.current || [])];
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
                  const updated = [...(medications.current || [])];
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
                  const updated = [...(medications.current || [])];
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
                  const updated = [...(medications.current || [])];
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
                  const updated = [...(medications.current || [])];
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
                  const updated = [...(medications.current || [])];
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
                  const updated = [...(medications.current || [])];
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

    <h4>Discontinued Medications ({(medications.discontinued || []).length})</h4>
    <div className="medications-list">
      {(medications.discontinued || []).map((med: DiscontinuedMedication, index: number) => (
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
                  const updated = [...(medications.discontinued || [])];
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
                  const updated = [...(medications.discontinued || [])];
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
                  const updated = [...(medications.discontinued || [])];
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
                  const updated = [...(medications.discontinued || [])];
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
                  const updated = [...(medications.discontinued || [])];
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

    <h4>Surgical History ({(data.surgicalHistory || []).length})</h4>
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

    <h4>Family History ({(data.familyHistory || []).length})</h4>
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
);

// Lab Results Section Component
const LabResultsSection: React.FC<LabResultsSectionProps> = ({ data, onChange }) => (
  <div className="form-section">
    <h3>Lab Tests ({(data || []).length})</h3>
    <div className="lab-tests-list">
      {(data || []).map((test, testIndex) => (
        <div key={testIndex} className="lab-test-item">
          <div className="lab-test-header">
            <span className="test-number">🔬 Test #{testIndex + 1}</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Test Date</label>
              <input
                type="text"
                value={test.testDate}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[testIndex].testDate = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="MM/DD/YYYY"
              />
            </div>
            
            <div className="form-group">
              <label>Test Name</label>
              <input
                type="text"
                value={test.testName}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[testIndex].testName = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="e.g., Complete Blood Count"
              />
            </div>
            
            <div className="form-group">
              <label>Ordering Physician</label>
              <input
                type="text"
                value={test.orderingPhysician}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[testIndex].orderingPhysician = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="Provider name"
              />
            </div>
          </div>
          
          <h5>Test Results ({(test.results || []).length})</h5>
          <div className="lab-results-grid">
            {(test.results || []).map((result, resultIndex) => (
              <div key={resultIndex} className="lab-result-row">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Parameter</label>
                    <input
                      type="text"
                      value={result.parameter}
                      onChange={(e) => {
                        const updated = [...(data || [])];
                        updated[testIndex].results[resultIndex].parameter = e.target.value;
                        onChange('', updated);
                      }}
                      className="form-input"
                      placeholder="e.g., WBC"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Value</label>
                    <input
                      type="text"
                      value={result.value}
                      onChange={(e) => {
                        const updated = [...(data || [])];
                        updated[testIndex].results[resultIndex].value = e.target.value;
                        onChange('', updated);
                      }}
                      className="form-input"
                      placeholder="e.g., 7.5"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Unit</label>
                    <input
                      type="text"
                      value={result.unit}
                      onChange={(e) => {
                        const updated = [...(data || [])];
                        updated[testIndex].results[resultIndex].unit = e.target.value;
                        onChange('', updated);
                      }}
                      className="form-input"
                      placeholder="e.g., K/uL"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Reference Range</label>
                    <input
                      type="text"
                      value={result.referenceRange}
                      onChange={(e) => {
                        const updated = [...(data || [])];
                        updated[testIndex].results[resultIndex].referenceRange = e.target.value;
                        onChange('', updated);
                      }}
                      className="form-input"
                      placeholder="e.g., 4.5-11.0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={result.status}
                      onChange={(e) => {
                        const updated = [...(data || [])];
                        updated[testIndex].results[resultIndex].status = e.target.value;
                        onChange('', updated);
                      }}
                      className="form-select"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Vital Signs Section Component
const VitalSignsSection: React.FC<VitalSignsSectionProps> = ({ data, onChange }) => (
  <div className="form-section">
    <h3>Vital Signs Records ({(data || []).length})</h3>
    <div className="vitals-list">
      {(data || []).map((vitals, index) => (
        <div key={index} className="vitals-item">
          <div className="vitals-header">
            <span className="vitals-number">💓 Record #{index + 1}</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                value={vitals.date}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].date = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="MM/DD/YYYY"
              />
            </div>
            
            <div className="form-group">
              <label>Time</label>
              <input
                type="text"
                value={vitals.time}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].time = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="HH:MM AM/PM"
              />
            </div>
            
            <div className="form-group">
              <label>Blood Pressure</label>
              <input
                type="text"
                value={vitals.bloodPressure}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].bloodPressure = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="120/80"
              />
            </div>
            
            <div className="form-group">
              <label>Heart Rate</label>
              <input
                type="text"
                value={vitals.heartRate}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].heartRate = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="72 bpm"
              />
            </div>
            
            <div className="form-group">
              <label>Temperature</label>
              <input
                type="text"
                value={vitals.temperature}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].temperature = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="98.6°F"
              />
            </div>
            
            <div className="form-group">
              <label>Weight</label>
              <input
                type="text"
                value={vitals.weight}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].weight = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="150 lbs"
              />
            </div>
            
            <div className="form-group">
              <label>Height</label>
              <input
                type="text"
                value={vitals.height}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].height = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="5'8&quot;"
              />
            </div>
            
            <div className="form-group">
              <label>BMI</label>
              <input
                type="text"
                value={vitals.bmi}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].bmi = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="22.8"
              />
            </div>
            
            <div className="form-group">
              <label>Oxygen Saturation</label>
              <input
                type="text"
                value={vitals.oxygenSaturation}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].oxygenSaturation = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="98%"
              />
            </div>
            
            <div className="form-group">
              <label>Respiratory Rate</label>
              <input
                type="text"
                value={vitals.respiratoryRate}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].respiratoryRate = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="16 breaths/min"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Visit Notes Section Component
const VisitNotesSection: React.FC<VisitNotesSectionProps> = ({ data, onChange }) => (
  <div className="form-section">
    <h3>Visit Notes ({(data || []).length})</h3>
    <div className="visits-list">
      {(data || []).map((visit, index) => (
        <div key={index} className="visit-item">
          <div className="visit-header">
            <span className="visit-number">📝 Visit #{index + 1}</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Visit Date</label>
              <input
                type="text"
                value={visit.date}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].date = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="MM/DD/YYYY"
              />
            </div>
            
            <div className="form-group">
              <label>Visit Type</label>
              <input
                type="text"
                value={visit.type}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].type = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="e.g., Follow-up, Annual Physical"
              />
            </div>
            
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                value={visit.duration}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].duration = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="e.g., 30 minutes"
              />
            </div>
            
            <div className="form-group">
              <label>Provider</label>
              <input
                type="text"
                value={visit.provider}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].provider = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="Provider name"
              />
            </div>
            
            <div className="form-group form-group-full">
              <label>Chief Complaint</label>
              <textarea
                value={visit.chiefComplaint}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].chiefComplaint = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                rows={2}
                placeholder="Patient's main concern..."
              />
            </div>
            
            <div className="form-group form-group-full">
              <label>Assessment (comma-separated)</label>
              <textarea
                value={visit.assessment.join(', ')}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].assessment = e.target.value.split(',').map(a => a.trim()).filter(a => a);
                  onChange('', updated);
                }}
                className="form-input"
                rows={2}
                placeholder="Diagnoses and findings..."
              />
            </div>
            
            <div className="form-group form-group-full">
              <label>Plan (comma-separated)</label>
              <textarea
                value={visit.plan.join(', ')}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].plan = e.target.value.split(',').map(p => p.trim()).filter(p => p);
                  onChange('', updated);
                }}
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
                value={visit.vitals.bloodPressure}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].vitals.bloodPressure = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="120/80"
              />
            </div>
            
            <div className="form-group">
              <label>Heart Rate</label>
              <input
                type="number"
                value={visit.vitals.heartRate}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].vitals.heartRate = parseInt(e.target.value) || 0;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="72"
              />
            </div>
            
            <div className="form-group">
              <label>Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                value={visit.vitals.temperature}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].vitals.temperature = parseFloat(e.target.value) || 0;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="98.6"
              />
            </div>
            
            <div className="form-group">
              <label>Weight (lbs)</label>
              <input
                type="number"
                value={visit.vitals.weight}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].vitals.weight = parseInt(e.target.value) || 0;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="150"
              />
            </div>
            
            <div className="form-group">
              <label>Height</label>
              <input
                type="text"
                value={visit.vitals.height}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].vitals.height = e.target.value;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="5'8&quot;"
              />
            </div>
            
            <div className="form-group">
              <label>Oxygen Saturation (%)</label>
              <input
                type="number"
                value={visit.vitals.oxygenSaturation}
                onChange={(e) => {
                  const updated = [...(data || [])];
                  updated[index].vitals.oxygenSaturation = parseInt(e.target.value) || 0;
                  onChange('', updated);
                }}
                className="form-input"
                placeholder="98"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EditDataStep;
