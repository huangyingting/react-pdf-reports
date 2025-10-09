import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Alert,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { AzureOpenAIConfig, validateAzureConfig } from '../utils/aiDataGenerator';
import { loadAzureConfig, saveAzureConfig, clearAzureConfig } from '../utils/azureConfigStorage';

interface AzureConfigModalProps {
  onSave: (config: AzureOpenAIConfig) => void;
  onCancel: () => void;
  initialConfig?: AzureOpenAIConfig;
}

const AzureConfigModal: React.FC<AzureConfigModalProps> = ({ onSave, onCancel, initialConfig }) => {
  const [config, setConfig] = useState<AzureOpenAIConfig>({
    endpoint: initialConfig?.endpoint || '',
    apiKey: initialConfig?.apiKey || '',
    deploymentName: initialConfig?.deploymentName || '',
    apiVersion: initialConfig?.apiVersion || '2025-04-01-preview'
  });
  const [error, setError] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [hasSavedConfig, setHasSavedConfig] = useState<boolean>(false);

  // Load saved configuration on mount
  useEffect(() => {
    if (!initialConfig) {
      const savedConfig = loadAzureConfig();
      if (savedConfig) {
        setConfig(savedConfig);
        setHasSavedConfig(true);
        console.log('[AzureConfigModal] Loaded saved configuration from browser storage');
      }
    }
  }, [initialConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateAzureConfig(config);
    if (!validation.valid) {
      setError(validation.error || 'Invalid configuration');
      return;
    }

    setError('');
    
    // Save to localStorage
    try {
      saveAzureConfig(config);
      setHasSavedConfig(true);
    } catch (error) {
      console.error('Failed to save configuration to storage:', error);
      // Continue anyway - the config is still valid for this session
    }
    
    onSave(config);
  };

  const handleClearConfig = () => {
    if (window.confirm('Are you sure you want to clear the saved Azure OpenAI configuration from browser storage?')) {
      clearAzureConfig();
      setConfig({
        endpoint: '',
        apiKey: '',
        deploymentName: '',
        apiVersion: '2025-04-01-preview'
      });
      setHasSavedConfig(false);
      setError('');
      console.log('[AzureConfigModal] Configuration cleared');
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h3" sx={{ fontSize: '1.25rem' }}>Azure OpenAI Configuration</Typography>
        <IconButton onClick={onCancel} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {hasSavedConfig && !error && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✓ Saved configuration loaded from browser storage
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Azure OpenAI Endpoint"
            type="url"
            placeholder="https://your-resource.openai.azure.com"
            value={config.endpoint}
            onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
            required
            margin="normal"
            helperText="Your Azure OpenAI resource endpoint URL"
          />

          <TextField
            fullWidth
            label="API Key"
            type={showApiKey ? 'text' : 'password'}
            placeholder="Enter your Azure OpenAI API key"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            required
            margin="normal"
            helperText="Your Azure OpenAI API key (found in Azure Portal)"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowApiKey(!showApiKey)}
                    edge="end"
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Deployment Name"
            type="text"
            placeholder="gpt-5-mini"
            value={config.deploymentName}
            onChange={(e) => setConfig({ ...config, deploymentName: e.target.value })}
            required
            margin="normal"
            helperText="The name of your deployed model (e.g., gpt-4, gpt-35-turbo)"
          />

          <TextField
            fullWidth
            label="API Version"
            type="text"
            placeholder="2025-04-01-preview"
            value={config.apiVersion}
            onChange={(e) => setConfig({ ...config, apiVersion: e.target.value })}
            margin="normal"
            helperText="Azure OpenAI API version (default: 2025-04-01-preview)"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          <Box>
            {hasSavedConfig && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearConfig}
                title="Clear saved configuration from browser storage"
              >
                Clear Saved Config
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Configuration
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AzureConfigModal;
