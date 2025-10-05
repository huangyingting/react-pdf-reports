import React, { useState, useEffect } from 'react';
import './EditDataStep.css';

const EditDataStep = ({ medicalData, onDataUpdated, onNext, onBack }) => {
  const [editedData, setEditedData] = useState(null);
  const [activeSection, setActiveSection] = useState('patient');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (medicalData) {
      setEditedData(JSON.parse(JSON.stringify(medicalData))); // Deep clone
    }
  }, [medicalData]);

  const updateData = (section, field, value) => {
    setEditedData(prev => {
      const updated = { ...prev };
      const keys = field.split('.');
      let current = updated[section];
      
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

  const sections = [
    { id: 'patient', label: 'Patient Info', icon: '👤' },
    { id: 'insurance', label: 'Insurance', icon: '🏥' },
    { id: 'provider', label: 'Provider', icon: '👨‍⚕️' },
    { id: 'medical', label: 'Medical History', icon: '📋' }
  ];

  return (
    <div className="edit-data-step">
      <div className="step-content">
        <div className="step-header">
          <div className="step-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/>
            </svg>
          </div>
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
                <span className="section-icon">{section.icon}</span>
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
const PatientInfoSection = ({ data, onChange }) => (
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
          onChange={(e) => onChange('address.phone', e.target.value)}
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
          maxLength="2"
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
const InsuranceSection = ({ data, onChange }) => (
  <div className="form-section">
    <h3>Primary Insurance</h3>
    
    <div className="form-grid">
      <div className="form-group">
        <label>Insurance Company</label>
        <input
          type="text"
          value={data.primaryInsurance.company}
          onChange={(e) => onChange('primaryInsurance.company', e.target.value)}
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
        <label>Member Number</label>
        <input
          type="text"
          value={data.primaryInsurance.memberNumber}
          onChange={(e) => onChange('primaryInsurance.memberNumber', e.target.value)}
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
              value={data.secondaryInsurance.company}
              onChange={(e) => onChange('secondaryInsurance.company', e.target.value)}
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
const ProviderSection = ({ data, onChange }) => (
  <div className="form-section">
    <h3>Primary Care Provider</h3>
    
    <div className="form-grid">
      <div className="form-group">
        <label>Provider Name</label>
        <input
          type="text"
          value={data.primaryCare.name}
          onChange={(e) => onChange('primaryCare.name', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>NPI Number</label>
        <input
          type="text"
          value={data.primaryCare.npi}
          onChange={(e) => onChange('primaryCare.npi', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Specialty</label>
        <input
          type="text"
          value={data.primaryCare.specialty}
          onChange={(e) => onChange('primaryCare.specialty', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          value={data.primaryCare.phone}
          onChange={(e) => onChange('primaryCare.phone', e.target.value)}
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
          value={data.facility.name}
          onChange={(e) => onChange('facility.name', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          value={data.facility.phone}
          onChange={(e) => onChange('facility.phone', e.target.value)}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label>Fax</label>
        <input
          type="text"
          value={data.facility.fax}
          onChange={(e) => onChange('facility.fax', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
  </div>
);

// Medical History Section Component
const MedicalHistorySection = ({ data, allergies, medications, onChange }) => (
  <div className="form-section">
    <h3>Allergies</h3>
    <div className="form-group">
      <label>Known Allergies (comma-separated)</label>
      <input
        type="text"
        value={(allergies || []).map(allergy => 
          typeof allergy === 'string' ? allergy : allergy.allergen
        ).join(', ')}
        onChange={(e) => {
          const allergenNames = e.target.value.split(',').map(a => a.trim()).filter(a => a);
          const allergyObjects = allergenNames.map(name => ({
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

    <h4>Active Conditions</h4>
    <div className="conditions-list">
      {(data.chronicConditions || []).map((condition, index) => (
        <div key={index} className="condition-item">
          <div className="form-grid">
            <div className="form-group">
              <label>Condition</label>
              <input
                type="text"
                value={condition.condition}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].condition = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                className="form-input"
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
                <option value="Well controlled">Well controlled</option>
                <option value="Stable">Stable</option>
                <option value="Improving">Improving</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Worsening">Worsening</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EditDataStep;