import { azureOpenAI, azureOpenAIEmbeddings } from '@/lib/azure-open-ai';
import axios from 'axios';
import sharp from 'sharp';

const azureVisionApiUrl = `${process.env.AZURE_AI_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Description,Tags`;

export async function analyzeImage(
  imageUrl: string
): Promise<{ description: string; tags: string[] }> {
  const response = await axios.post(
    azureVisionApiUrl,
    { url: imageUrl },
    {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_VISION_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  const { description, tags } = response.data;

  return {
    description: description.captions[0]?.text,
    tags: tags.map((t: any) => t.name) as string[]
  };
}

export async function generateDescriptionFromTags(
  tags: string[],
  basicDescription: string
) {
  const prompt = `Here is a list of tags from an image: ${tags.join(', ')}. The basic description is: "${basicDescription}". 
  Can you write a detailed paragraph describing the image?`;

  const response = await azureOpenAI.invoke(prompt);

  return response;
}

export async function resizeImage(buffer: Buffer): Promise<Buffer> {
  const MAX_WIDTH = 800;

  const image = sharp(buffer);
  const metadata = await image.metadata();

  const width = metadata.width || 0;
  const height = metadata.height || 0;

  if (width > height && width > MAX_WIDTH) {
    return image
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .toBuffer();
  } else if (height > MAX_WIDTH) {
    return image
      .resize({ height: MAX_WIDTH, withoutEnlargement: true })
      .toBuffer();
  }

  return buffer;
}

export async function processImage(imageUrl: string) {
  // Step 1: Analyze image using Azure Vision API
  const { description: basicDescription, tags } = await analyzeImage(imageUrl);

  // Step 2: Generate detailed description using GPT-4o
  const detailedDescription = await generateDescriptionFromTags(
    tags,
    basicDescription
  );

  return { basicDescription, tags, detailedDescription };
}

export async function generateEmbedding(text: string) {
  const embedding = await azureOpenAIEmbeddings.embedQuery(text);
  return embedding;
}
