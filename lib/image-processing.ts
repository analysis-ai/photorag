import path from 'path';

import { azureOpenAI, azureOpenAIEmbeddings } from '@/lib/azure-open-ai';
import axios from 'axios';
import sharp from 'sharp';

const fontPath = path.join(
  process.cwd(),
  'public',
  'fonts',
  'OpenSans-Regular.ttf'
);

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

export async function resizeImage(
  buffer: Buffer,
  shouldWatermark = true
): Promise<Buffer> {
  const MAX_WIDTH = 800;
  const watermarkText = 'www.MegWise.com';

  let image = sharp(buffer);
  const metadata = await image.metadata();

  const width = metadata.width || 0;
  const height = metadata.height || 0;

  if (metadata.orientation && metadata.orientation >= 2) {
    image = image.rotate();
  }

  // Resize image if necessary
  if (width > height && width > MAX_WIDTH) {
    image.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  } else if (height > MAX_WIDTH) {
    image.resize({ height: MAX_WIDTH, withoutEnlargement: true });
  }

  // Create watermark
  const watermark = await sharp({
    text: {
      text: `<span foreground="white">${watermarkText}</span>`,
      font: 'Open Sans',
      fontfile: fontPath,
      width: 300,
      height: 125,
      align: 'center',
      rgba: true
    }
  })
    .png()
    .toBuffer();

  if (shouldWatermark) {
    // Add watermark to the image
    return image
      .composite([
        {
          input: watermark,
          gravity: 'center'
        }
      ])
      .toBuffer();
  } else {
    return image.toBuffer();
  }
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
