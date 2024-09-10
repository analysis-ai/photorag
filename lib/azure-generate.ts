import { generateObject, generateText } from 'ai';

import { azureAiModel } from '@/lib/azure-open-ai';
import { z } from 'zod';

const RefineQuerySchema = z.object({
  newQuery: z
    .string()
    .describe(
      'A refined query based on the users original query, optimized to help improve image search results.'
    ),
  tags: z
    .array(z.string())
    .describe(
      'Five high-confidence, one-word tags, that will help improve image search results for the given query.'
    )
});

export async function describeImage(imageUrl: string) {
  const result = await generateText({
    model: azureAiModel,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the image in detail.' },
          {
            type: 'image',
            image: imageUrl
          }
        ]
      }
    ]
  });

  return result.text;
}

export async function refineImageQuery(query: string) {
  const prompt = {
    instructions: `Refine the following user query for image search purposes. The goal is to improve the accuracy and relevance of the search results. Leverage your knowledge to suggest terms the user might not have considered and enhance the query with more specific or related keywords. 
    
    The refined query should be more concise and precise, using terms that will increase the likelihood of finding high-quality, relevant images. Additionally, generate five high-confidence search tags that can further help in filtering or categorizing the images. The tags should be one word.
    
    Original user query: "${query}"`,
    userOriginalQuery: query
  };

  const result = await generateObject({
    model: azureAiModel,
    system: `You are an AI assistant specialized in refining user queries to improve image search results.
             Your task is to take a simple user query and refine it to be more specific, concise, and optimized for better search accuracy.
             Additionally, generate 5 relevant search tags to enhance the user's ability to find what they are looking for.`,
    schema: RefineQuerySchema,
    schemaName: 'RefineQuerySchema',
    schemaDescription:
      'Schema for refining a user query and generating relevant image search tags to improve search results.',
    prompt: JSON.stringify(prompt),
    temperature: 0.7
  });

  return result;
}
