import React, { useState, useEffect } from 'react';
import { DATA_GENERATION_PRESETS, GenerationOptions, BasicData, MedicalHistoryData, VisitReportData, LaboratoryReportData, LabTestType } from '../utils/constants';
import { generateBasicData } from '../utils/dataGenerator';
import { 
  generateBasicDataWithAI, 
  generateMedicalHistoryDataWithAI, 
  generateVisitReportDataWithAI, 
  generateLaboratoryReportDataWithAI 
} from '../utils/aiDataGenerator';
import { AzureOpenAIConfig } from '../utils/azureOpenAI';
import { loadAzureConfig } from '../utils/azureConfigStorage';
import CustomSelect from './CustomSelect';
import AzureConfigModal from './AzureConfigModal';

import './GenerateDataStep.css';

interface GenerateDataStepProps {
  onDataGenerated: (
    data: BasicData,
    generationOptions: Required<GenerationOptions>,
    preGeneratedMedicalHistory?: MedicalHistoryData | null,
    preGeneratedVisitReports?: VisitReportData[] | null,
    preGeneratedLabReports?: Map<LabTestType, LaboratoryReportData> | null
  ) => void;
  onNext: () => void;
}

type GenerationMethod = 'faker' | 'ai';

const GenerateDataStep: React.FC<GenerateDataStepProps> = ({ onDataGenerated, onNext }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('standard');
  const [customOptions, setCustomOptions] = useState<Required<GenerationOptions>>({
    complexity: 'medium',
    numberOfVisits: 3,
    numberOfLabTests: 5,
    includeSecondaryInsurance: true
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>('faker');
  const [azureConfig, setAzureConfig] = useState<AzureOpenAIConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load saved Azure configuration on mount
  useEffect(() => {
    const savedConfig = loadAzureConfig();
    if (savedConfig) {
      setAzureConfig(savedConfig);
      console.log('[GenerateDataStep] Loaded saved Azure configuration');
    }
  }, []);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = DATA_GENERATION_PRESETS[presetKey];
    setCustomOptions(preset.options);
  };

  const handleGenerateData = async () => {
    // If AI is selected but no config, show modal
    if (generationMethod === 'ai' && !azureConfig) {
      setShowConfigModal(true);
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      let data: BasicData;
      let medicalHistory: MedicalHistoryData | null = null;
      let visitReports: VisitReportData[] | null = null;
      let labReports: Map<LabTestType, LaboratoryReportData> | null = null;
      
      if (generationMethod === 'ai' && azureConfig) {
        // Use Azure OpenAI to generate all data
        console.log('[GenerateDataStep] Generating data with AI...');
        
        // Generate basic patient data
        data = await generateBasicDataWithAI(
          azureConfig,
          customOptions.complexity as 'low' | 'medium' | 'high'
        );
        console.log('[GenerateDataStep] Basic data generated');
        
        // Generate medical history
        try {
          medicalHistory = await generateMedicalHistoryDataWithAI(
            azureConfig,
            data,
            customOptions.complexity as 'low' | 'medium' | 'high'
          );
          console.log('[GenerateDataStep] Medical history generated');
        } catch (err) {
          console.error('[GenerateDataStep] Failed to generate medical history:', err);
        }
        
        // Generate visit reports
        try {
          visitReports = await generateVisitReportDataWithAI(
            azureConfig,
            data,
            customOptions.numberOfVisits
          );
          console.log('[GenerateDataStep] Visit reports generated:', visitReports?.length);
        } catch (err) {
          console.error('[GenerateDataStep] Failed to generate visit reports:', err);
        }
        
        // Generate laboratory reports
        try {
          const allLabTypes: LabTestType[] = ['CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 'Pathology', 'Hormone', 'Infectious'];
          const labReportsData = await generateLaboratoryReportDataWithAI(
            azureConfig,
            data,
            allLabTypes
          );
          labReports = labReportsData as Map<LabTestType, LaboratoryReportData>;
          console.log('[GenerateDataStep] Laboratory reports generated:', labReports?.size);
        } catch (err) {
          console.error('[GenerateDataStep] Failed to generate laboratory reports:', err);
        }
      } else {
        // Use standard Faker.js generation
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        data = generateBasicData(customOptions);
      }
      
      // Pass all generated data AND generation options to parent
      onDataGenerated(data, customOptions, medicalHistory, visitReports, labReports);
      
      // Automatically move to next step
      onNext();
    } catch (error) {
      console.error('Error generating data:', error);
      const errorMessage = generationMethod === 'ai' 
        ? 'Failed to generate data with AI. Please check your Azure OpenAI configuration or try standard generation.'
        : 'Failed to generate data. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfigSave = (config: AzureOpenAIConfig) => {
    setAzureConfig(config);
    setShowConfigModal(false);
    // Automatically trigger generation after config is saved
    setTimeout(() => {
      handleGenerateData();
    }, 100);
  };

  return (
    <div className="step">
      <div className="step-content">


        <div className="data-generation-options">
          <div className="section">
            <h3>Generation Method</h3>
            <div className="generation-method-compact">
              <div className="method-options-inline">
                <div 
                  className={`method-option-radio ${generationMethod === 'faker' ? 'selected' : ''}`}
                  onClick={() => setGenerationMethod('faker')}
                >
                  <input
                    type="radio"
                    name="generationMethod"
                    value="faker"
                    checked={generationMethod === 'faker'}
                    onChange={() => setGenerationMethod('faker')}
                  />
                  <span className="method-icon">⚡</span>
                  <span className="method-name">Faker.js</span>
                </div>

                <div 
                  className={`method-option-radio ${generationMethod === 'ai' ? 'selected' : ''} ${!azureConfig ? 'disabled' : ''}`}
                  onClick={() => {
                    if (azureConfig) {
                      setGenerationMethod('ai');
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="generationMethod"
                    value="ai"
                    checked={generationMethod === 'ai'}
                    onChange={() => {
                      if (azureConfig) {
                        setGenerationMethod('ai');
                      }
                    }}
                    disabled={!azureConfig}
                  />
                  <span className="method-icon">🤖</span>
                  <span className="method-name">AI-Powered</span>
                  {azureConfig && <span className="status-badge configured">✓</span>}
                </div>

                <button
                  type="button"
                  className="btn-config-inline"
                  onClick={() => setShowConfigModal(true)}
                  title={azureConfig ? 'Update Azure OpenAI settings' : 'Configure Azure OpenAI'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6"/>
                  </svg>
                  {azureConfig ? 'Update' : 'Configure'}
                </button>
              </div>
            </div>

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


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

                    <div className="step-actions">
            <button
              className="btn btn-primary"
              onClick={handleGenerateData}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="spinner"></div>
                  <span>{generationMethod === 'ai' ? 'Generating with AI...' : 'Generating...'}</span>
                </>
              ) : (
                <span>Generate & Continue →</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Azure Config Modal */}
      {showConfigModal && (
        <AzureConfigModal
          onSave={handleConfigSave}
          onCancel={() => setShowConfigModal(false)}
          initialConfig={azureConfig || undefined}
        />
      )}
    </div>
  );
};

export default GenerateDataStep;
