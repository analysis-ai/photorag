import { AzureOpenAI, AzureOpenAIEmbeddings } from '@langchain/openai';

export const azureOpenAI = new AzureOpenAI({
  model: 'gpt-4o-2024-08-06',
  deploymentName: 'gpt-4o-2024-08-06'
});

export const azureOpenAIEmbeddings = new AzureOpenAIEmbeddings({
  model: 'text-embedding-ada-002',
  deploymentName: 'text-embedding-ada-002'
});
