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
import { StepContainer, ContentContainer, SectionCard, FloatingActionBar } from './SharedComponents';
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
            <Typography variant="h3" gutterBottom >Generation Method</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how you want to generate your medical data
            </Typography>
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
                    border: '2px solid',
                    borderColor: generationMethod === 'faker' ? 'primary.main' : 'divider',
                    borderRadius: 2.5,
                    px: 2.5,
                    py: 1.25,
                    m: 0,
                    background: generationMethod === 'faker' 
                      ? 'linear-gradient(135deg, rgba(241, 248, 233, 0.6) 0%, rgba(143, 175, 60, 0.1) 100%)'
                      : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 12px rgba(107, 142, 35, 0.15)',
                      transform: 'translateY(-2px)',
                    }
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
                    border: '2px solid',
                    borderColor: generationMethod === 'ai' ? 'primary.main' : 'divider',
                    borderRadius: 2.5,
                    px: 2.5,
                    py: 1.25,
                    m: 0,
                    background: generationMethod === 'ai' 
                      ? 'linear-gradient(135deg, rgba(241, 248, 233, 0.6) 0%, rgba(143, 175, 60, 0.1) 100%)'
                      : 'transparent',
                    opacity: !azureConfig ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: !azureConfig ? 'divider' : 'primary.main',
                      boxShadow: !azureConfig ? 'none' : '0 4px 12px rgba(107, 142, 35, 0.15)',
                      transform: !azureConfig ? 'none' : 'translateY(-2px)',
                    }
                  }}
                />
              </RadioGroup>

              <Button
                variant="outlined"
                size="small"
                startIcon={<SettingsIcon />}
                onClick={() => setShowConfigModal(true)}
                title={azureConfig ? 'Update Azure OpenAI settings' : 'Configure Azure OpenAI'}
                sx={{
                  borderRadius: 2,
                  borderWidth: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    borderWidth: 1.5,
                    transform: 'scale(1.05)',
                  }
                }}
              >
                {azureConfig ? 'Update' : 'Configure'}
              </Button>

              {azureConfig && (
                <IconButton
                  size="small"
                  onClick={handleClearConfig}
                  title="Reset Azure OpenAI configuration"
                  sx={{ 
                    border: '1.5px solid', 
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'error.main',
                      color: 'error.main',
                      transform: 'rotate(90deg)',
                    }
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              )}

              <IconButton
                size="small"
                onClick={handleClearCache}
                title="Clear cached AI-generated data"
                sx={{ 
                  border: '1.5px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'error.main',
                    color: 'error.main',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="h3" gutterBottom>Choose Data Complexity</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select a preset configuration or customize your own settings
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 2,
              mb: 3,
            }}>
              {Object.entries(DATA_GENERATION_PRESETS).map(([key, preset]) => (
                <Card 
                  key={key}
                  onClick={() => handlePresetChange(key)}
                  sx={{ 
                    p: 3,
                    cursor: 'pointer',
                    border: selectedPreset === key ? '2.5px solid' : '1.5px solid',
                    borderColor: selectedPreset === key ? 'primary.main' : 'divider',
                    background: selectedPreset === key 
                      ? 'linear-gradient(135deg, rgba(241, 248, 233, 1) 0%, rgba(143, 175, 60, 0.15) 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f8faf9 100%)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: selectedPreset === key 
                      ? '0 8px 24px rgba(107, 142, 35, 0.2)'
                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #6b8e23, #8faf3c)',
                      opacity: selectedPreset === key ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(107, 142, 35, 0.18)',
                      borderColor: 'primary.main',
                      '&::before': {
                        opacity: 1,
                      }
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="h4" sx={{ fontSize: '1.0625rem', fontWeight: 700 }}>{preset.name}</Typography>
                    {selectedPreset === key && (
                      <Box sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        borderRadius: '50%', 
                        width: 24, 
                        height: 24, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(107, 142, 35, 0.3)',
                      }}>
                        <CheckIcon sx={{ fontSize: 16 }} />
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                    {preset.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Box sx={{ 
                      px: 1.5, 
                      py: 0.5, 
                      bgcolor: 'rgba(107, 142, 35, 0.1)', 
                      borderRadius: 1.5,
                      border: '1px solid rgba(107, 142, 35, 0.2)',
                    }}>
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        Visits: {preset.options.numberOfVisits}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      px: 1.5, 
                      py: 0.5, 
                      bgcolor: 'rgba(107, 142, 35, 0.1)', 
                      borderRadius: 1.5,
                      border: '1px solid rgba(107, 142, 35, 0.2)',
                    }}>
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        Tests: {preset.options.numberOfLabTests}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      px: 1.5, 
                      py: 0.5, 
                      bgcolor: 'rgba(107, 142, 35, 0.1)', 
                      borderRadius: 1.5,
                      border: '1px solid rgba(107, 142, 35, 0.2)',
                    }}>
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {preset.options.complexity}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>

            <Typography variant="h3" gutterBottom>Custom Settings</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Fine-tune the generated data to meet your specific needs
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 2.5,
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ fontSize: '0.9rem' }}>
                  Medical Complexity
                </Typography>
                <Select
                  value={customOptions.complexity}
                  onChange={(e: SelectChangeEvent) => setCustomOptions({...customOptions, complexity: e.target.value as 'low' | 'medium' | 'high'})}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 1.5,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <MenuItem value="low">Basic (2-3 conditions)</MenuItem>
                  <MenuItem value="medium">Moderate (4-5 conditions)</MenuItem>
                  <MenuItem value="high">Complex (6+ conditions)</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ fontSize: '0.9rem' }}>
                  Number of Visits
                </Typography>
                <Select
                  value={customOptions.numberOfVisits}
                  onChange={(e: SelectChangeEvent<number>) => setCustomOptions({...customOptions, numberOfVisits: e.target.value as number})}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 1.5,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
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

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ fontSize: '0.9rem' }}>
                  Lab Tests
                </Typography>
                <Select
                  value={customOptions.numberOfLabTests}
                  onChange={(e: SelectChangeEvent<number>) => setCustomOptions({...customOptions, numberOfLabTests: e.target.value as number})}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 1.5,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
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

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ fontSize: '0.9rem' }}>
                  Secondary Insurance
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={customOptions.includeSecondaryInsurance}
                      onChange={(e) => setCustomOptions({...customOptions, includeSecondaryInsurance: e.target.checked})}
                    />
                  }
                  label="Include"
                  sx={{
                    border: '2px solid',
                    borderColor: customOptions.includeSecondaryInsurance ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    m: 0,
                    minHeight: '40px',
                    height: '40px',
                    background: customOptions.includeSecondaryInsurance 
                      ? 'linear-gradient(135deg, rgba(241, 248, 233, 0.6) 0%, rgba(143, 175, 60, 0.1) 100%)'
                      : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 12px rgba(107, 142, 35, 0.15)',
                    }
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

        <FloatingActionBar variant="centered">
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateData}
            disabled={isGenerating}
            startIcon={isGenerating && <CircularProgress size={18} color="inherit" />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 2.5,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(107, 142, 35, 0.3)',
              background: 'linear-gradient(135deg, #6b8e23 0%, #8faf3c 100%)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(107, 142, 35, 0.4)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)',
              }
            }}
          >
            {isGenerating 
              ? (generationMethod === 'ai' ? 'Generating with AI...' : 'Generating...') 
              : 'Generate & Continue →'}
          </Button>
        </FloatingActionBar>
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
