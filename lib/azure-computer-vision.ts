import {
  CaptionResult,
  Response,
  TagElement
} from '@/types/azure-computer-vision';

import { ImageModel } from '@/models';
import { ImageType } from '@/types/image';
import axios from 'axios';
import { azureOpenAI } from '@/lib/azure-open-ai';
import { describeImage } from '@/lib/azure-generate';

export async function analyzeImage(
  imageUrl: string,
  filePath: string,
  filename: string,
  userId: number
): Promise<ImageType> {
  const analyzeImageApiUrl =
    `${process.env.AZURE_AI_ENDPOINT}/computervision/imageanalysis:analyze` +
    `?api-version=2024-02-01&features=tags,read,caption,denseCaptions,smartCrops,objects,people`;

  const { data } = await axios.post(
    analyzeImageApiUrl,
    { url: imageUrl },
    {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_VISION_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  // TODO - just testing
  const genCaption = await describeImage(imageUrl);

  console.log('Generated caption:', genCaption);

  const { captionResult, metadata, tagsResult } = data as Response;

  const description = await generateDescriptionFromTags(
    tagsResult.values,
    captionResult
  );

  const { vector: descriptionVector } = await vectorizeText(description);

  const { vector: imageVector, modelVersion } = await vectorizeImage(imageUrl);

  // store image data in database
  const image = await ImageModel.addImage({
    caption: captionResult.text,
    description,
    descriptionVector,
    filePath,
    filename,
    imageVector,
    metadata,
    tags: tagsResult.values.map((tag) => tag.name),
    userId,
    vectorModel: modelVersion
  });

  return image;
}

export async function vectorizeImage(
  imageUrl: string
): Promise<{ vector: number[]; modelVersion: string }> {
  const vectorizeImageApiUrl =
    `${process.env.AZURE_AI_ENDPOINT}computervision/retrieval:vectorizeImage` +
    `?api-version=2024-02-01&model-version=2023-04-15`;

  const { data } = await axios.post(
    vectorizeImageApiUrl,
    { url: imageUrl },
    {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_VISION_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  return data;
}

export async function vectorizeText(
  text: string
): Promise<{ vector: number[]; modelVersion: string }> {
  const vectorizeTextApiUrl =
    `${process.env.AZURE_AI_ENDPOINT}computervision/retrieval:vectorizeText` +
    `?api-version=2024-02-01&model-version=2023-04-15`;

  const { data } = await axios.post(
    vectorizeTextApiUrl,
    { text },
    {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_VISION_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  return data;
}

export async function generateDescriptionFromTags(
  tags: TagElement[],
  captionResult: CaptionResult
) {
  // Build the prompt
  const captionText = `Caption: "${captionResult.text}" (Confidence: ${captionResult.confidence.toFixed(6)})`;

  // Only include tags with a confidence score above 0.6 (adjustable threshold)
  const tagText = tags
    .filter((tag) => tag.confidence > 0.8)
    .map((tag) => `"${tag.name}" (Confidence: ${tag.confidence.toFixed(6)})`)
    .join(', ');

  const tagSection = `Tags: ${tagText}`;

  // Final prompt to send to the LLM
  const prompt = `
    Refine the following image analysis to generate a detailed but concise description.
    
    - Use the caption as the main source of information.
    - Incorporate only high-confidence tags (above 0.6) as additional context.
    - Avoid unnecessary details or long descriptions. Focus on the key elements of the image.
    - Keep the description to one or two sentences.

    ${captionText}
    
    ${tagSection}
  `;

  const response = await azureOpenAI.invoke(prompt);

  return response;
}
