# PHOTORAG - PhotoMuse: AI-Powered Image Search and Analysis

PhotoMuse is an advanced image search and analysis application that uses AI to generate descriptions and tags for images, and then allows for similarity-based searching using natural language queries. This is my submission for the [Microsoft RAG Hack](https://github.com/microsoft/RAG_Hack)

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Setup](#setup)
4. [Usage](#usage)
5. [API Endpoints](#api-endpoints)
6. [Understanding Search Results](#understanding-search-results)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- Image upload and automatic description generation using GPT-4
- Automatic tagging of images
- Vector embedding of image descriptions for efficient similarity search
- Natural language querying of the image database

## Technology Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL with pgvector extension
- Drizzle ORM
- Azure OpenAI API (for GPT-4 and embeddings)
- LangChain.js

## Setup

1. Clone the repository:

```bash
git clone git@github.com:analysis-ai/photorag.git
cd photomuse
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
DATABASE_URL=your_postgres_database_url
PHOTOMUSE_API_KEY=your_chosen_api_key_for_authentication # This is not a long term solution.
```

4. Set up your PostgreSQL database with the pgvector extension.

5. Run database migrations:

```bash
npm run db:migrate
```

## Usage

1. Upload images through the provided UI or API endpoint.
2. The system will automatically generate descriptions and tags for the images.
3. Use the search functionality to find similar images based on natural language queries.

## API Endpoints

### POST /api/upload-image

Uploads an image and generates its description and tags.

Request body:

```json
{
  "imageUrl": "https://example.com/image.jpg",
  "userId": 123
}
```

### POST /api/image-search

Searches for similar images based on a text query.

Request body:

```json
{
  "query": "a sunny beach with palm trees",
  "limit": 5
}
```

Note: All API requests require the `x-api-key` header with your PHOTOMUSE_API_KEY.

## Understanding Search Results

When you perform a search, each result includes the following key information:

- `id`: The unique identifier of the image in the database.
- `filePath`: The URL or path to the image file.
- `description`: The AI-generated description of the image.
- `tags`: AI-generated tags for the image.
- `distance`: A measure of how different the query is from the image description.
- `confidence`: A score indicating how well the image matches the query.

### Confidence Score

The confidence score is calculated as `1 - distance`. Here's how to interpret it:

- A score closer to 1 indicates a higher confidence in the match.
- A score closer to 0 indicates a lower confidence.

For example:

- A confidence of 0.95 suggests a very strong match.
- A confidence of 0.50 suggests a moderate match.
- A confidence of 0.10 suggests a weak match.

Note that the exact thresholds for what constitutes a "good" match may vary depending on your specific use case and data. You may need to experiment to find the right thresholds for your application.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This README provides a comprehensive overview of your PhotoMuse application, including setup instructions, usage guidelines, and an explanation of the confidence scores. You may want to adjust some details based on your specific implementation or add more sections as needed.

Some suggestions for additional content you might want to include:

1. A more detailed explanation of how the vector embedding and similarity search work.
2. Examples of how to use the API endpoints with curl or JavaScript fetch.
3. Information about the database schema and how the data is structured.
4. Any performance considerations or limitations users should be aware of.
5. Future plans or roadmap for the project.

Would you like me to expand on any particular section of this README or add any additional information?
