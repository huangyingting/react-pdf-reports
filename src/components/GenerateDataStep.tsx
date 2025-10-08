import React, { useState } from 'react';
import { DATA_GENERATION_PRESETS, GenerationOptions, BasicData } from '../utils/types';
import {generateBasicData} from '../utils/baseDataGenerator';
import CustomSelect from './CustomSelect';

import './GenerateDataStep.css';

interface GenerateDataStepProps {
  onDataGenerated: (data: BasicData) => void;
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
      
      const data = generateBasicData(customOptions);
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
                <CustomSelect
                  value={customOptions.complexity}
                  onChange={(value) => setCustomOptions({...customOptions, complexity: value as 'low' | 'medium' | 'high'})}
                  options={[
                    { value: 'low', label: 'Basic (2-3 conditions)' },
                    { value: 'medium', label: 'Moderate (4-5 conditions)' },
                    { value: 'high', label: 'Complex (6+ conditions)' }
                  ]}
                />
              </div>

              <div className="option-group">
                <label>Number of Visits</label>
                <CustomSelect
                  value={customOptions.numberOfVisits}
                  onChange={(value) => setCustomOptions({...customOptions, numberOfVisits: value as number})}
                  options={[
                    { value: 1, label: '1 Visit' },
                    { value: 2, label: '2 Visits' },
                    { value: 3, label: '3 Visits' },
                    { value: 5, label: '5 Visits' },
                    { value: 7, label: '7 Visits' }
                  ]}
                />
              </div>

              <div className="option-group">
                <label>Lab Tests</label>
                <CustomSelect
                  value={customOptions.numberOfLabTests}
                  onChange={(value) => setCustomOptions({...customOptions, numberOfLabTests: value as number})}
                  options={[
                    { value: 1, label: '1 Test' },
                    { value: 2, label: '2 Tests' },
                    { value: 3, label: '3 Tests' },
                    { value: 5, label: '5 Tests' },
                    { value: 8, label: '8 Tests' },
                    { value: 10, label: '10 Tests' }
                  ]}
                />
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
              className="btn btn-primary"
              onClick={handleGenerateData}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="spinner"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate & Continue →</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateDataStep;
