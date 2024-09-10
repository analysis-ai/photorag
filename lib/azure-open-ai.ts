import { AzureOpenAI, AzureOpenAIEmbeddings } from '@langchain/openai';

import { createAzure } from '@ai-sdk/azure';

export const azureOpenAI = new AzureOpenAI({
  model: 'gpt-4o-2024-08-06',
  deploymentName: 'gpt-4o-2024-08-06'
});

export const azureOpenAIEmbeddings = new AzureOpenAIEmbeddings({
  model: 'text-embedding-ada-002',
  deploymentName: 'text-embedding-ada-002'
});

export const azure = createAzure({
  resourceName: 'photorag-openai',
  apiKey: process.env.AZURE_OPENAI_API_KEY
});

export const azureAiModel = azure('gpt-4o-2024-08-06');

export const azureAiEmbeddings = azure.textEmbeddingModel(
  'text-embedding-ada-002'
);
