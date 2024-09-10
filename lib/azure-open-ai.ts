// import { images } from '@/db/schema';
// import { VercelPostgres } from '@langchain/community/vectorstores/vercel_postgres';
import { AzureOpenAI, AzureOpenAIEmbeddings } from '@langchain/openai';

export const azureOpenAI = new AzureOpenAI({
  model: 'gpt-4o-2024-08-06',
  deploymentName: 'gpt-4o-2024-08-06'
});

export const azureOpenAIEmbeddings = new AzureOpenAIEmbeddings({
  model: 'text-embedding-ada-002',
  deploymentName: 'text-embedding-ada-002'
});

// export async function createVectorStore() {
//   const vectorPostgresStore = await VercelPostgres.initialize(
//     azureOpenAIEmbeddings,
//     {
//       tableName: images._.name,
//       postgresConnectionOptions: {
//         connectionString: process.env.DB_URL
//       },
//       columns: {
//         idColumnName: images.id.name,
//         vectorColumnName: images.descriptionVector.name,
//         contentColumnName: images.description.name,
//         metadataColumnName: images.tags.name
//       }
//     }
//   );
//   return vectorPostgresStore;
// }
