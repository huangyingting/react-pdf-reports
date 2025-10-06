import React, { useState, useEffect } from 'react';
import './EditDataStep.css';
import { MedicalRecord, Allergy, ChronicCondition, PatientDemographics, InsuranceInfo, Provider, MedicalHistory, Medications } from '../utils/types';

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
      const updated = { ...prev };
      const keys = field.split('.');
      let current: any = (updated as any)[section];
      
      for (let i = 0; i < keys.length - 1; i++) {
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
    { id: 'patient', label: 'Patient Info', icon: '👤' },
    { id: 'insurance', label: 'Insurance', icon: '🏥' },
    { id: 'provider', label: 'Provider', icon: '👨‍⚕️' },
    { id: 'medical', label: 'Medical History', icon: '📋' }
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
              <MedicalHistorySection 
                data={editedData.medicalHistory} 
                allergies={editedData.medicalHistory.allergies}
                medications={editedData.medications}
                onChange={(field, value) => updateData('medicalHistory', field, value)}
              />
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
        <label>Gender</label>
        <select
          value={data.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          className="form-select"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
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
        <label>Phone Number</label>
        <input
          type="text"
          value={data.contact.phone}
          onChange={(e) => onChange('contact.phone', e.target.value)}
          className="form-input"
        />
      </div>
    </div>

    <h4>Address Information</h4>
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

// Insurance Section Component
const InsuranceSection: React.FC<InsuranceSectionProps> = ({ data, onChange }) => (
  <div className="form-section">
    <h3>Primary Insurance</h3>
    
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
          value={data.primaryInsurance.copay}
          onChange={(e) => onChange('primaryInsurance.copay', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Deductible</label>
        <input
          type="text"
          value={data.primaryInsurance.deductible}
          onChange={(e) => onChange('primaryInsurance.deductible', e.target.value)}
          className="form-input"
        />
      </div>
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
        </div>
      </>
    )}
  </div>
);

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
        <input
          type="text"
          value={data.specialty}
          onChange={(e) => onChange('specialty', e.target.value)}
          className="form-input"
        />
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
    </div>

    <h4>Facility Information</h4>
    <div className="form-grid">
      <div className="form-group">
        <label>Facility Name</label>
        <input
          type="text"
          value={data.facilityName || ''}
          onChange={(e) => onChange('facilityName', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          value={data.facilityPhone || ''}
          onChange={(e) => onChange('facilityPhone', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Fax</label>
        <input
          type="text"
          value={data.facilityFax || ''}
          onChange={(e) => onChange('facilityFax', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  </div>
);

// Medical History Section Component
const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ data, allergies, onChange }) => (
  <div className="form-section">
    <h3>Allergies</h3>
    <div className="form-group">
      <label>Known Allergies (comma-separated)</label>
      <input
        type="text"
        value={(allergies || []).map(allergy => allergy.allergen).join(', ')}
        onChange={(e) => {
          const allergenNames = e.target.value.split(',').map(a => a.trim()).filter(a => a);
          const allergyObjects: Allergy[] = allergenNames.map(name => ({
            allergen: name,
            reaction: 'Unknown',
            severity: 'Moderate',
            dateIdentified: 'Unknown'
          }));
          onChange('allergies', allergyObjects);
        }}
        className="form-input"
        placeholder="Penicillin, Sulfa drugs, etc."
      />
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
                <option value="Well controlled">✓ Well controlled</option>
                <option value="Stable">◉ Stable</option>
                <option value="Improving">↑ Improving</option>
                <option value="Monitoring">⊙ Monitoring</option>
                <option value="Worsening">↓ Worsening</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EditDataStep;
