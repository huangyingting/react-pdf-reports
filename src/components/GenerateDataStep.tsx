import React, { useState } from 'react';
import { DATA_GENERATION_PRESETS, GenerationOptions, MedicalRecord } from '../utils/types';
import {generateCompleteMedicalRecord} from '../utils/medicalRecordsGenerator';

import './GenerateDataStep.css';

interface GenerateDataStepProps {
  onDataGenerated: (data: MedicalRecord) => void;
  onNext: () => void;
}

const GenerateDataStep: React.FC<GenerateDataStepProps> = ({ onDataGenerated, onNext }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('standard');
  const [customOptions, setCustomOptions] = useState<Required<GenerationOptions>>({
    complexity: 'medium',
    numberOfVisits: 3,
    numberOfLabTests: 5,
    includeSecondaryInsurance: true
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = DATA_GENERATION_PRESETS[presetKey];
    setCustomOptions(preset.options);
  };

  const handleGenerateData = async () => {
    setIsGenerating(true);
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = generateCompleteMedicalRecord(customOptions);
      onDataGenerated(data);
      
      // Automatically move to next step
      onNext();
    } catch (error) {
      console.error('Error generating data:', error);
      alert('Failed to generate data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="step">
      <div className="step-content">


        <div className="data-generation-options">
          <div className="section">
            <h3>Choose Data Complexity</h3>
            <p>Select a preset configuration or customize your own settings</p>
            
            <div className="preset-cards">
              {Object.entries(DATA_GENERATION_PRESETS).map(([key, preset]) => (
                <div 
                  key={key}
                  className={`preset-card ${selectedPreset === key ? 'selected' : ''}`}
                  onClick={() => handlePresetChange(key)}
                >
                  <div className="preset-header">
                    <h4>{preset.name}</h4>
                    <div className="preset-indicator">
                      {selectedPreset === key && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <p>{preset.description}</p>
                  <div className="preset-details">
                    <span>Visits: {preset.options.numberOfVisits}</span>
                    <span>Lab Tests: {preset.options.numberOfLabTests}</span>
                    <span>Complexity: {preset.options.complexity}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3>Custom Settings</h3>
            <p>Fine-tune the generated data to meet your specific needs</p>
            
            <div className="custom-options">
              <div className="option-group">
                <label>Medical Complexity</label>
                <select 
                  value={customOptions.complexity}
                  onChange={(e) => setCustomOptions({...customOptions, complexity: e.target.value as 'low' | 'medium' | 'high'})}
                  className="option-select"
                >
                  <option value="low">Low - Basic conditions (2-3 conditions)</option>
                  <option value="medium">Medium - Moderate complexity (4-5 conditions)</option>
                  <option value="high">High - Complex patient (6+ conditions)</option>
                </select>
              </div>

              <div className="option-group">
                <label>Number of Visits</label>
                <select 
                  value={customOptions.numberOfVisits}
                  onChange={(e) => setCustomOptions({...customOptions, numberOfVisits: parseInt(e.target.value)})}
                  className="option-select"
                >
                  <option value="1">1 Visit</option>
                  <option value="2">2 Visits</option>
                  <option value="3">3 Visits</option>
                  <option value="5">5 Visits</option>
                  <option value="7">7 Visits</option>
                </select>
              </div>

              <div className="option-group">
                <label>Lab Tests</label>
                <select 
                  value={customOptions.numberOfLabTests}
                  onChange={(e) => setCustomOptions({...customOptions, numberOfLabTests: parseInt(e.target.value)})}
                  className="option-select"
                >
                  <option value="3">3 Tests</option>
                  <option value="5">5 Tests</option>
                  <option value="8">8 Tests</option>
                  <option value="10">10 Tests</option>
                </select>
              </div>

              <div className="option-group">
                <label>Secondary Insurance</label>
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={customOptions.includeSecondaryInsurance}
                    onChange={(e) => setCustomOptions({...customOptions, includeSecondaryInsurance: e.target.checked})}
                  />
                  <span>Include</span>
                </label>
              </div>
            </div>
          </div>

                    <div className="step-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={handleGenerateData}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="spinner"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate Data & Continue →</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateDataStep;
