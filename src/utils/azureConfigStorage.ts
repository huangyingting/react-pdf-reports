/**
 * Azure OpenAI Configuration Storage
 * Handles saving and loading Azure OpenAI configuration from browser's localStorage
 */

import { AzureOpenAIConfig } from './aiDataGenerator';

const STORAGE_KEY = 'azureOpenAIConfig';

/**
 * Save Azure OpenAI configuration to localStorage
 */
export function saveAzureConfig(config: AzureOpenAIConfig): void {
  try {
    const configToSave = {
      endpoint: config.endpoint,
      apiKey: config.apiKey,
      deploymentName: config.deploymentName,
      apiVersion: config.apiVersion
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
    console.log('[Azure Config Storage] Configuration saved successfully');
  } catch (error) {
    console.error('[Azure Config Storage] Failed to save configuration:', error);
    throw new Error('Failed to save Azure OpenAI configuration to browser storage');
  }
}

/**
 * Load Azure OpenAI configuration from localStorage
 */
export function loadAzureConfig(): AzureOpenAIConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.log('[Azure Config Storage] No saved configuration found');
      return null;
    }

    const config = JSON.parse(stored) as AzureOpenAIConfig;
    console.log('[Azure Config Storage] Configuration loaded successfully');
    console.log('[Azure Config Storage] Endpoint:', config.endpoint);
    console.log('[Azure Config Storage] Deployment:', config.deploymentName);
    console.log('[Azure Config Storage] API Version:', config.apiVersion || '2025-04-01-preview');
    
    return config;
  } catch (error) {
    console.error('[Azure Config Storage] Failed to load configuration:', error);
    return null;
  }
}

/**
 * Clear Azure OpenAI configuration from localStorage
 */
export function clearAzureConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[Azure Config Storage] Configuration cleared successfully');
  } catch (error) {
    console.error('[Azure Config Storage] Failed to clear configuration:', error);
  }
}

/**
 * Check if Azure OpenAI configuration exists in localStorage
 */
export function hasAzureConfig(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    console.error('[Azure Config Storage] Failed to check configuration:', error);
    return false;
  }
}
