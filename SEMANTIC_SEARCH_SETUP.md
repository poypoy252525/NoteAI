# Semantic Search Setup Guide

This guide explains how to set up and use semantic search functionality in your NoteAI application using pgvector and Google's GenAI embeddings.

## Prerequisites

1. **Supabase Database with pgvector Extension**
   - Ensure you have enabled the `vector` extension in your Supabase database
   - You can do this via the Supabase dashboard: Database > Extensions > Enable `vector`

2. **Google GenAI API Key**
   - Make sure your `GENAI_API_KEY` is set in your environment variables

## Database Setup

### 1. Run the Migration

```bash
cd server
npx prisma migrate deploy
```

If you encounter issues, you can manually run the migration SQL:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS "vector";

-- Add embedding column to Note table
ALTER TABLE "Note" ADD COLUMN "embedding" vector(1536);

-- Create index for efficient similarity search
CREATE INDEX "note_embedding_idx" ON "Note" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

## API Endpoints

### 1. Search Notes by Semantic Similarity

**POST** `/api/semantic-search/search`

```json
{
  "query": "machine learning algorithms",
  "limit": 10,
  "threshold": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "uuid",
      "title": "Deep Learning Basics",
      "content": "Content about neural networks...",
      "category": "AI/ML",
      "summary": "Introduction to deep learning concepts",
      "similarity": 0.85,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

### 2. Find Similar Notes to a Specific Note

**GET** `/api/semantic-search/similar/:noteId?limit=5`

**Response:**
```json
{
  "success": true,
  "results": [...],
  "count": 3
}
```

### 3. Generate Embeddings for All Notes

**POST** `/api/semantic-search/generate-embeddings`

This endpoint will generate embeddings for all notes that don't have them yet. It runs in the background.

**Response:**
```json
{
  "success": true,
  "message": "Embedding generation started in background"
}
```

### 4. Update Embedding for a Specific Note

**PUT** `/api/semantic-search/update-embedding/:noteId`

```json
{
  "content": "Updated note content with title"
}
```

## Automatic Embedding Generation

When you create new notes using the existing `/api/users/:userId/notes` endpoint, embeddings are automatically generated in the background. The embedding combines both the title and content of the note for better semantic representation.

## How It Works

1. **Text Embedding**: Uses Google's `text-embedding-004` model to convert text into 1536-dimensional vectors
2. **Vector Storage**: Embeddings are stored in PostgreSQL using the pgvector extension
3. **Similarity Search**: Uses cosine similarity to find semantically related notes
4. **Indexing**: IVFFLAT index is used for efficient similarity searches

## Usage Examples

### Frontend Integration

```javascript
// Search for notes semantically
const searchNotes = async (query) => {
  const response = await fetch('/api/semantic-search/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query,
      limit: 10,
      threshold: 0.7
    })
  });
  
  const data = await response.json();
  return data.results;
};

// Find similar notes
const findSimilarNotes = async (noteId) => {
  const response = await fetch(`/api/semantic-search/similar/${noteId}?limit=5`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.results;
};
```

### Generate Embeddings for Existing Notes

If you have existing notes without embeddings, call the batch generation endpoint:

```javascript
const generateEmbeddings = async () => {
  const response = await fetch('/api/semantic-search/generate-embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data.message);
};
```

## Performance Considerations

1. **Embedding Generation**: Takes ~1-2 seconds per note due to API calls to Google GenAI
2. **Search Performance**: Very fast once embeddings are generated (milliseconds)
3. **Storage**: Each embedding takes ~6KB of storage (1536 floats × 4 bytes)
4. **Index Tuning**: The IVFFLAT index uses 100 lists by default. Adjust based on your data size:
   - Small datasets (< 1K notes): 10-50 lists
   - Medium datasets (1K-100K notes): 100-1000 lists
   - Large datasets (> 100K notes): 1000+ lists

## Troubleshooting

### Common Issues

1. **"vector" extension not found**
   - Enable the vector extension in Supabase dashboard
   - Ensure your database user has the necessary permissions

2. **Embedding generation fails**
   - Check your `GENAI_API_KEY` environment variable
   - Verify Google GenAI API quota and billing

3. **Search returns no results**
   - Ensure notes have embeddings generated
   - Try lowering the similarity threshold (e.g., 0.5 instead of 0.7)
   - Check that the query is meaningful and not too short

4. **TypeScript errors**
   - Run `npx prisma generate` after schema changes
   - Restart your TypeScript server

### Monitoring

Monitor embedding generation progress by checking the server logs. Each successful embedding generation will log:
```
Generated embedding for note: [noteId]
```

## Advanced Configuration

### Adjusting Similarity Thresholds

- **0.9+**: Very similar content
- **0.8-0.9**: Highly related content
- **0.7-0.8**: Moderately related content
- **0.6-0.7**: Somewhat related content
- **< 0.6**: Loosely related content

### Custom Embedding Models

To use a different embedding model, modify the `generateEmbedding` method in `genai.repository.ts`:

```typescript
const response = await this.genAI.models.embedContent({
  model: "text-embedding-004", // Change this to your preferred model
  contents: [{ parts: [{ text }] }],
});
```

## Security Notes

- All semantic search endpoints require authentication
- Users can only search their own notes
- API keys are properly secured in environment variables
- No sensitive data is logged during embedding generation
