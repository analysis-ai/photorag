export interface ImageVectorQueryResult {
  id: number;
  file_path: string;
  description: string;
  tags: string;
  user_id: number;
  created: Date;
  updated: Date;
  description_vector: number[]; // Assuming this is how pgvector represents vectors
  distance: number;
}

export interface Image {
  id: number;
  filePath: string;
  description: string;
  tags: string;
  userId: number;
  created: Date;
  updated: Date;
}

export interface ImageSearchResult extends Image {
  distance: number;
  confidence: number;
}

export interface SearchResponse {
  message: string;
  results: ImageSearchResult[];
}
