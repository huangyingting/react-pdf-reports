/**
 * Azure OpenAI Integration
 * Handles communication with Azure OpenAI API for generating medical data
 */

export interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  deploymentName: string;
  apiVersion?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Validate Azure OpenAI configuration
 */
export function validateAzureConfig(config: AzureOpenAIConfig): { valid: boolean; error?: string } {
  if (!config.endpoint || !config.endpoint.trim()) {
    return { valid: false, error: 'Endpoint is required' };
  }
  
  if (!config.apiKey || !config.apiKey.trim()) {
    return { valid: false, error: 'API Key is required' };
  }
  
  if (!config.deploymentName || !config.deploymentName.trim()) {
    return { valid: false, error: 'Deployment Name is required' };
  }
  
  // Validate endpoint format
  try {
    new URL(config.endpoint);
  } catch {
    return { valid: false, error: 'Invalid endpoint URL format' };
  }
  
  return { valid: true };
}

/**
 * Call Azure OpenAI Chat Completion API
 */
export async function callAzureOpenAI(
  messages: ChatMessage[],
  config: AzureOpenAIConfig,
  temperature: number = 0.7,
  maxTokens: number = 20*1024
): Promise<string> {
  // Validate configuration
  const validation = validateAzureConfig(config);
  if (!validation.valid) {
    throw new Error(`Azure OpenAI configuration error: ${validation.error}`);
  }

  const apiVersion = config.apiVersion || '2024-02-15-preview';
  const url = `${config.endpoint}/openai/deployments/${config.deploymentName}/chat/completions?api-version=${apiVersion}`;

  console.log('[Azure OpenAI] Request starting...');
  console.log('[Azure OpenAI] Endpoint:', config.endpoint);
  console.log('[Azure OpenAI] Deployment:', config.deploymentName);
  console.log('[Azure OpenAI] API Version:', apiVersion);
  console.log('[Azure OpenAI] Temperature:', temperature);
  console.log('[Azure OpenAI] Max Tokens:', maxTokens);

  try {
    const requestBody: any = {
      messages,
      max_completion_tokens: maxTokens,
      // Enable JSON mode - ensures response is valid JSON
      // Note: system or user message must include "JSON" for this to work
      response_format: { type: 'json_object' }
    };

    // Only include temperature if it's not the default value (1.0)
    // Some models don't support custom temperature values
    if (temperature !== 1.0) {
      requestBody.temperature = temperature;
    }

    console.log('[Azure OpenAI] Request body (FULL CONTENT):');
    console.log(JSON.stringify(requestBody, null, 2));

    const requestStartTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': config.apiKey
      },
      body: JSON.stringify(requestBody)
    });
    const requestDuration = Date.now() - requestStartTime;

    console.log('[Azure OpenAI] Response received in', requestDuration, 'ms');
    console.log('[Azure OpenAI] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Azure OpenAI] Error response:', JSON.stringify(errorData, null, 2));
      throw new Error(
        `Azure OpenAI API error: ${response.status} ${response.statusText}. ` +
        `Details: ${JSON.stringify(errorData)}`
      );
    }

    const data: ChatCompletionResponse = await response.json();
    
    console.log('[Azure OpenAI] Success! Response metadata:');
    console.log('  - ID:', data.id);
    console.log('  - Model:', data.model);
    console.log('  - Finish reason:', data.choices?.[0]?.finish_reason);
    console.log('  - Usage:', JSON.stringify(data.usage, null, 2));
    console.log('  - Content length:', data.choices?.[0]?.message?.content?.length || 0, 'characters');
    console.log('[Azure OpenAI] Response content (FULL):');
    console.log(data.choices?.[0]?.message?.content);

    if (!data.choices || data.choices.length === 0) {
      console.error('[Azure OpenAI] No choices in response:', JSON.stringify(data, null, 2));
      throw new Error('No response from Azure OpenAI');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('[Azure OpenAI] Request failed:', error);
    if (error instanceof Error) {
      console.error('[Azure OpenAI] Error stack:', error.stack);
      throw new Error(`Failed to call Azure OpenAI: ${error.message}`);
    }
    throw new Error('Failed to call Azure OpenAI: Unknown error');
  }
}

/**
 * Generate medical data using Azure OpenAI with retry logic
 */
export async function generateMedicalDataWithAI(
  config: AzureOpenAIConfig,
  prompt: string,
  systemPrompt: string = 'You are a medical data generator that creates realistic, HIPAA-compliant synthetic medical records for educational purposes. Always respond with valid JSON.',
  retries: number = 3
): Promise<any> {
  console.log('[generateMedicalDataWithAI] Starting generation with', retries, 'max retries');
  console.log('[generateMedicalDataWithAI] Prompt length:', prompt.length, 'characters');
  console.log('[generateMedicalDataWithAI] System prompt:', systemPrompt.substring(0, 100) + '...');

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ];

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    console.log(`[generateMedicalDataWithAI] Attempt ${attempt + 1}/${retries}`);
    try {
      const responseText = await callAzureOpenAI(messages, config, 1.0, 20*1024);
      
      console.log('[generateMedicalDataWithAI] Received response text, length:', responseText?.length || 0);
      
      // Validate response is not empty
      if (!responseText || responseText.trim() === '') {
        console.error('[generateMedicalDataWithAI] Empty response received');
        throw new Error('Empty response from Azure OpenAI');
      }
      
      console.log('[generateMedicalDataWithAI] Parsing JSON response...');
      // Parse the JSON response (Azure OpenAI JSON mode guarantees valid JSON)
      const parsedData = JSON.parse(responseText);
      
      console.log('[generateMedicalDataWithAI] JSON parsed successfully');
      console.log('[generateMedicalDataWithAI] Parsed data type:', typeof parsedData);
      console.log('[generateMedicalDataWithAI] Parsed data keys:', Object.keys(parsedData || {}).join(', '));
      
      // Validate we got an object back
      if (typeof parsedData !== 'object' || parsedData === null) {
        console.error('[generateMedicalDataWithAI] Invalid data type:', typeof parsedData);
        throw new Error('Invalid JSON structure: expected object, got ' + typeof parsedData);
      }
      
      console.log('[generateMedicalDataWithAI] ✅ Generation successful!');
      return parsedData;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Log the error for debugging
      console.error(`[generateMedicalDataWithAI] ❌ Attempt ${attempt + 1}/${retries} failed:`, error);
      console.error('[generateMedicalDataWithAI] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      if (error instanceof Error) {
        console.error('[generateMedicalDataWithAI] Error message:', error.message);
        console.error('[generateMedicalDataWithAI] Error stack:', error.stack);
      }
      
      // If it's a parsing error, try again
      if (error instanceof SyntaxError && attempt < retries - 1) {
        console.warn(`[generateMedicalDataWithAI] JSON parsing failed, retrying in ${(attempt + 1) * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      // If it's an API error and we have retries left, wait and try again
      if (attempt < retries - 1) {
        console.warn(`[generateMedicalDataWithAI] Retrying in ${(attempt + 1) * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      console.error('[generateMedicalDataWithAI] All retry attempts exhausted');
      break;
    }
  }

  console.error('[generateMedicalDataWithAI] Final error:', lastError);
  throw lastError || new Error('Failed to generate medical data after all retries');
}
