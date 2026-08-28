-- Vector similarity search RPC used by lib/documents/rag.ts
-- Filters strictly by chatbot_id so one chatbot can never retrieve another's chunks.
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_count INT,
  filter JSONB DEFAULT '{}'
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chatbot_id UUID,
  content TEXT,
  metadata JSONB,
  chunk_index INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.chatbot_id,
    document_chunks.content,
    document_chunks.metadata,
    document_chunks.chunk_index,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE document_chunks.chatbot_id = (filter->>'chatbot_id')::uuid
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
