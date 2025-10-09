import React, { useState, useEffect } from 'react';
import { AzureOpenAIConfig, validateAzureConfig } from '../utils/aiDataGenerator';
import { loadAzureConfig, saveAzureConfig, clearAzureConfig } from '../utils/azureConfigStorage';
import './AzureConfigModal.css';

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
    apiVersion: initialConfig?.apiVersion || '2024-02-15-preview'
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
        apiVersion: '2024-02-15-preview'
      });
      setHasSavedConfig(false);
      setError('');
      console.log('[AzureConfigModal] Configuration cleared');
    }
  };

  return (
    <div className="azure-config-modal-overlay">
      <div className="azure-config-modal">
        <div className="modal-header">
          <h2>Azure OpenAI Configuration</h2>
          <button className="close-button" onClick={onCancel} type="button">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {hasSavedConfig && !error && (
              <div className="info-banner">
                ✓ Saved configuration loaded from browser storage
              </div>
            )}
            
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="endpoint">
                Azure OpenAI Endpoint <span className="required">*</span>
              </label>
              <input
                id="endpoint"
                type="url"
                placeholder="https://your-resource.openai.azure.com"
                value={config.endpoint}
                onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                required
              />
              <small>Your Azure OpenAI resource endpoint URL</small>
            </div>

            <div className="form-group">
              <label htmlFor="apiKey">
                API Key <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Enter your Azure OpenAI API key"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowApiKey(!showApiKey)}
                  aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <small>Your Azure OpenAI API key (found in Azure Portal)</small>
            </div>

            <div className="form-group">
              <label htmlFor="deploymentName">
                Deployment Name <span className="required">*</span>
              </label>
              <input
                id="deploymentName"
                type="text"
                placeholder="gpt-5-mini"
                value={config.deploymentName}
                onChange={(e) => setConfig({ ...config, deploymentName: e.target.value })}
                required
              />
              <small>The name of your deployed model (e.g., gpt-4, gpt-35-turbo)</small>
            </div>

            <div className="form-group">
              <label htmlFor="apiVersion">
                API Version
              </label>
              <input
                id="apiVersion"
                type="text"
                placeholder="2024-02-15-preview"
                value={config.apiVersion}
                onChange={(e) => setConfig({ ...config, apiVersion: e.target.value })}
              />
              <small>Azure OpenAI API version (default: 2024-02-15-preview)</small>
            </div>
          </div>

          <div className="modal-footer">
            <div className="footer-left">
              {hasSavedConfig && (
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleClearConfig}
                  title="Clear saved configuration from browser storage"
                >
                  Clear Saved Config
                </button>
              )}
            </div>
            <div className="footer-right">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Configuration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AzureConfigModal;
