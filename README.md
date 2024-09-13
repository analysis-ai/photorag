# PhotoMuse: AI-Powered Image Search and Analysis

PhotoMuse is an advanced image search and analysis application that uses AI to generate descriptions and tags for images, and then allows for similarity-based searching using natural language queries. This is my submission for the [Microsoft RAG Hack](https://github.com/microsoft/RAG_Hack).

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Setup](#setup)
4. [Understanding Search Results](#understanding-search-results)
5. [How It Works](#how-it-works)
6. [Contributing](#contributing)
7. [License](#license)

## Features

- Image upload and automatic description generation using Azure Computer Vision and GPT-4
- Automatic tagging of images
- Vector embedding of image descriptions for efficient similarity search
- Natural language querying of the image database
- Refined search queries using AI
- Confidence scoring and explanations for search results

## Technology Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL with pgvector extension
- Drizzle ORM
- Azure OpenAI API (for GPT-4 and embeddings)
- Azure Computer Vision API
- Azure Blob Storage

## Setup

1. Clone the repository:

```bash
git clone https://github.com/dubscode/photorag.git
cd photorag
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables in a `.env.local` file:

```bash
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_API_INSTANCE_NAME=your_instance_name
AZURE_OPENAI_API_DEPLOYMENT_NAME=your_deployment_name
AZURE_OPENAI_API_VERSION=your_api_version
AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME=your_embedding_deployment_name
AZURE_AI_ENDPOINT=your_azure_ai_endpoint
AZURE_VISION_API_KEY=your_azure_vision_api_key
DATABASE_URL=your_postgres_database_url
```

4. Set up your PostgreSQL database with the pgvector extension.

5. Run database migrations:

```bash
npm run db:migrate
```

## Understanding Search Results

When you perform a search, each result includes the following key information:

- `id`: The unique identifier of the image in the database.
- `filePath`: The URL or path to the image file (returned as a SAS URL for Azure Blob Storage).
- `description`: The AI-generated description of the image.
- `tags`: AI-generated tags for the image.
- `distance`: A measure of how different the query is from the image description.
- `confidence`: A score indicating how well the image matches the query.
- `confidenceExplanation`: A detailed explanation of why this image was matched and how the confidence score was calculated.

### Confidence Score

The confidence score is calculated based on the cosine similarity between the query embedding and the image description embedding. Here's how to interpret it:

- A score closer to 1 indicates a higher confidence in the match.
- A score closer to 0 indicates a lower confidence.

The confidence explanation provides more context about why an image was matched, including information about matching tags and the similarity score.

## How It Works

1. **Image Upload**: When an image is uploaded, it's stored in Azure Blob Storage.
2. **Image Analysis**: The image is analyzed using Azure Computer Vision to generate tags and captions.
3. **Description Generation**: GPT-4 is used to generate a detailed description based on the tags and captions.
4. **Vector Embedding**: The description is converted into a vector embedding using Azure OpenAI.
5. **Search**: When a user performs a search:
   - The query is refined using GPT-4 to extract relevant tags and improve the search terms.
   - The refined query is converted to a vector embedding.
   - A similarity search is performed using cosine similarity between the query embedding and the stored image embeddings.
   - Results are ranked based on similarity and tag matches.
