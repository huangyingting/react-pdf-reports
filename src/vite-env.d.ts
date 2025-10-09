/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_OPENAI_ENDPOINT: string;
  readonly VITE_AZURE_OPENAI_API_KEY: string;
  readonly VITE_AZURE_OPENAI_DEPLOYMENT_NAME: string;
  readonly VITE_AZURE_OPENAI_API_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
