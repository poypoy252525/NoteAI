-- CreateIndex
CREATE INDEX IF NOT EXISTS "note_embedding_idx" ON "Note" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
