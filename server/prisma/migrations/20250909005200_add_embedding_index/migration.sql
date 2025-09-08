-- CreateIndex
CREATE INDEX IF NOT EXISTS "note_embedding_idx" ON "Note" USING hnsw (embedding vector_cosine_ops) WITH (lists = 100);
