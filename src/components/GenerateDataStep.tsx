import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  Button, 
  Checkbox,
  CircularProgress,
  Alert,
  IconButton,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { StepContainer, ContentContainer, SectionCard } from './SharedComponents';
import { 
  GenerationOptions,
  GeneratedData,
  LabTestType
} from '../utils/zodSchemas';
import { 
  DATA_GENERATION_PRESETS, 
  generatePatient,
  generateProvider,
  generateInsuranceInfo,
  generateMedicalHistory,
  generateVisitsReport,
  generateLabReports,
  generateCMS1500
} from '../utils/dataGenerator';
import { 
  AzureOpenAIConfig, 
  generatePatientWithAI,
  generateProviderWithAI,
  generateInsuranceInfoWithAI,
  generateMedicalHistoryWithAI,
  generateVisitReportsWithAI,
  generateLabReportsWithAI,
  generateCMS1500WithAI
} from '../utils/aiDataGenerator';
import { loadAzureConfig, clearAzureConfig } from '../utils/azureConfigStorage';
import { clearCache, DEFAULT_CACHE_CONFIG } from '../utils/cache';
import AzureConfigModal from './AzureConfigModal';

interface GenerateDataStepProps {
  onDataGenerated: (
    data: GeneratedData,
    generationOptions: Required<GenerationOptions>
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
      let generatedData: GeneratedData;
      
      if (generationMethod === 'ai' && azureConfig) {
        // AI-powered generation using Azure OpenAI
        console.log('[GenerateDataStep] Using AI generation with Azure OpenAI');
        
        // Generate using AI functions
        const patient = await generatePatientWithAI(azureConfig);
        const provider = await generateProviderWithAI(azureConfig);
        const insuranceInfo = await generateInsuranceInfoWithAI(azureConfig, patient, customOptions.includeSecondaryInsurance);
        const medicalHistory = await generateMedicalHistoryWithAI(azureConfig, customOptions.complexity);
        const visitReports = await generateVisitReportsWithAI(azureConfig, customOptions.numberOfVisits, provider.name);

        // Generate lab reports - randomly select from available tests
        const availableLabTests: LabTestType[] = [
          'CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 
          'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 
          'Pathology', 'Hormone', 'Infectious'
        ];
        // Shuffle and select random lab tests
        const shuffled = [...availableLabTests].sort(() => Math.random() - 0.5);
        const selectedLabTests = shuffled.slice(0, customOptions.numberOfLabTests);
        const labReports = await generateLabReportsWithAI(azureConfig, selectedLabTests, provider.name);
        
        const cms1500 = await generateCMS1500WithAI(azureConfig, patient, insuranceInfo, provider);
        
        generatedData = {
          patient,
          provider,
          insuranceInfo,
          medicalHistory,
          visitReports,
          labReports,
          cms1500
        };
      } else {
        // Use standard Faker.js generation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const patient = generatePatient();
        const provider = generateProvider();
        const insuranceInfo = generateInsuranceInfo(patient,customOptions.includeSecondaryInsurance);
        const medicalHistory = generateMedicalHistory(customOptions.complexity);
        const visitReports = generateVisitsReport(customOptions.numberOfVisits, provider.name);
        
        // Generate lab reports - randomly select from available tests
        const availableLabTests: LabTestType[] = [
          'CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 
          'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 
          'Pathology', 'Hormone', 'Infectious'
        ];
        // Shuffle and select random lab tests
        const shuffled = [...availableLabTests].sort(() => Math.random() - 0.5);
        const selectedLabTests = shuffled.slice(0, customOptions.numberOfLabTests);
        const labReports = generateLabReports(selectedLabTests, provider.name);
        
        const cms1500 = generateCMS1500(patient, insuranceInfo, provider);
        
        generatedData = {
          patient,
          provider,
          insuranceInfo,
          medicalHistory,
          visitReports,
          labReports,
          cms1500
        };
      }
      
      // Pass generated data and generation options to parent
      onDataGenerated(generatedData, customOptions);
      
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
    console.log('[GenerateDataStep] Azure configuration saved successfully');
  };

  const handleClearConfig = () => {
    if (window.confirm('Are you sure you want to reset the Azure OpenAI configuration? This will remove all saved settings from browser storage.')) {
      clearAzureConfig();
      setAzureConfig(null);
      setGenerationMethod('faker');
      console.log('[GenerateDataStep] Azure configuration cleared');
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the cache? This will remove all cached AI-generated data from browser storage.')) {
      try {
        clearCache(DEFAULT_CACHE_CONFIG);
        console.log('[GenerateDataStep] Cache cleared successfully');
        alert('Cache cleared successfully!');
      } catch (error) {
        console.error('[GenerateDataStep] Failed to clear cache:', error);
        alert('Failed to clear cache. Please check the console for details.');
      }
    }
  };

  return (
    <StepContainer>
      <ContentContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <SectionCard>
            <Typography variant="h3" gutterBottom>Generation Method</Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center',
              flexWrap: 'wrap',
              mb: 3,
            }}>
              <RadioGroup
                row
                value={generationMethod}
                onChange={(e) => {
                  const value = e.target.value as GenerationMethod;
                  if (value === 'ai' && !azureConfig) {
                    return;
                  }
                  setGenerationMethod(value);
                }}
                sx={{ display: 'flex', gap: 2 }}
              >
                <FormControlLabel
                  value="faker"
                  control={<Radio />}
                  label="Faker.js"
                  sx={{
                    border: '1.5px solid',
                    borderColor: generationMethod === 'faker' ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    m: 0,
                    bgcolor: generationMethod === 'faker' ? 'rgba(241, 248, 233, 0.3)' : 'transparent',
                  }}
                />
                <FormControlLabel
                  value="ai"
                  control={<Radio disabled={!azureConfig} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>AI-Powered</span>
                      {azureConfig && <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                    </Box>
                  }
                  sx={{
                    border: '1.5px solid',
                    borderColor: generationMethod === 'ai' ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    m: 0,
                    bgcolor: generationMethod === 'ai' ? 'rgba(241, 248, 233, 0.3)' : 'transparent',
                    opacity: !azureConfig ? 0.6 : 1,
                  }}
                />
              </RadioGroup>

              <Button
                variant="outlined"
                size="small"
                startIcon={<SettingsIcon />}
                onClick={() => setShowConfigModal(true)}
                title={azureConfig ? 'Update Azure OpenAI settings' : 'Configure Azure OpenAI'}
              >
                {azureConfig ? 'Update' : 'Configure'}
              </Button>

              {azureConfig && (
                <IconButton
                  size="small"
                  onClick={handleClearConfig}
                  title="Reset Azure OpenAI configuration"
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              )}

              <IconButton
                size="small"
                onClick={handleClearCache}
                title="Clear cached AI-generated data"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="h3" gutterBottom sx={{ mt: 3 }}>Choose Data Complexity</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Select a preset configuration or customize your own settings
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 1.5,
              mb: 3,
            }}>
              {Object.entries(DATA_GENERATION_PRESETS).map(([key, preset]) => (
                <Card 
                  key={key}
                  onClick={() => handlePresetChange(key)}
                  sx={{ 
                    p: 2.5,
                    cursor: 'pointer',
                    border: selectedPreset === key ? '2px solid' : '1.5px solid',
                    borderColor: selectedPreset === key ? 'primary.main' : 'divider',
                    bgcolor: selectedPreset === key ? 'rgba(241, 248, 233, 1)' : 'background.default',
                    '&:hover': {
                      boxShadow: 7,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h4" sx={{ fontSize: '0.9375rem' }}>{preset.name}</Typography>
                    {selectedPreset === key && <CheckIcon sx={{ color: 'primary.main' }} />}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {preset.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', fontSize: '0.75rem' }}>
                    <Typography variant="caption">Visits: {preset.options.numberOfVisits}</Typography>
                    <Typography variant="caption">Lab Tests: {preset.options.numberOfLabTests}</Typography>
                    <Typography variant="caption">Complexity: {preset.options.complexity}</Typography>
                  </Box>
                </Card>
              ))}
            </Box>

            <Typography variant="h3" gutterBottom sx={{ mt: 3 }}>Custom Settings</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Fine-tune the generated data to meet your specific needs
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">Medical Complexity</Typography>
                <Select
                  value={customOptions.complexity}
                  onChange={(e: SelectChangeEvent) => setCustomOptions({...customOptions, complexity: e.target.value as 'low' | 'medium' | 'high'})}
                  fullWidth
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                    }
                  }}
                >
                  <MenuItem value="low">Basic (2-3 conditions)</MenuItem>
                  <MenuItem value="medium">Moderate (4-5 conditions)</MenuItem>
                  <MenuItem value="high">Complex (6+ conditions)</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">Number of Visits</Typography>
                <Select
                  value={customOptions.numberOfVisits}
                  onChange={(e: SelectChangeEvent<number>) => setCustomOptions({...customOptions, numberOfVisits: e.target.value as number})}
                  fullWidth
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                    }
                  }}
                >
                  <MenuItem value={1}>1 Visit</MenuItem>
                  <MenuItem value={2}>2 Visits</MenuItem>
                  <MenuItem value={3}>3 Visits</MenuItem>
                  <MenuItem value={5}>5 Visits</MenuItem>
                  <MenuItem value={7}>7 Visits</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">Lab Tests</Typography>
                <Select
                  value={customOptions.numberOfLabTests}
                  onChange={(e: SelectChangeEvent<number>) => setCustomOptions({...customOptions, numberOfLabTests: e.target.value as number})}
                  fullWidth
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                    }
                  }}
                >
                  <MenuItem value={1}>1 Test</MenuItem>
                  <MenuItem value={2}>2 Tests</MenuItem>
                  <MenuItem value={3}>3 Tests</MenuItem>
                  <MenuItem value={5}>5 Tests</MenuItem>
                  <MenuItem value={8}>8 Tests</MenuItem>
                  <MenuItem value={10}>10 Tests</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">Secondary Insurance</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={customOptions.includeSecondaryInsurance}
                      onChange={(e) => setCustomOptions({...customOptions, includeSecondaryInsurance: e.target.checked})}
                    />
                  }
                  label="Include"
                  sx={{
                    border: '1.5px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    m: 0,
                    bgcolor: customOptions.includeSecondaryInsurance ? 'rgba(241, 248, 233, 0.3)' : 'transparent',
                  }}
                />
              </Box>
            </Box>
          </SectionCard>

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          bgcolor: 'rgba(250, 245, 235, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(141, 110, 99, 0.3)',
          borderRadius: 2,
          boxShadow: 5,
          position: 'sticky',
          bottom: 24,
          mx: 'auto',
          maxWidth: 600,
          width: 'fit-content',
        }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateData}
            disabled={isGenerating}
            startIcon={isGenerating && <CircularProgress size={16} color="inherit" />}
          >
            {isGenerating 
              ? (generationMethod === 'ai' ? 'Generating with AI...' : 'Generating...') 
              : 'Generate & Continue →'}
          </Button>
        </Box>
      </ContentContainer>

      {/* Azure Config Modal */}
      {showConfigModal && (
        <AzureConfigModal
          onSave={handleConfigSave}
          onCancel={() => setShowConfigModal(false)}
          initialConfig={azureConfig || undefined}
        />
      )}
    </StepContainer>
  );
};

export default GenerateDataStep;
