# Supabase Setup Guide

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project

## Steps

### 1. Set up environment variables

Copy your Supabase URL and anon key to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Create tables and enable extensions

1. Go to the Supabase dashboard
2. Navigate to the SQL Editor
3. Click "New Query"
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL editor and run it

### 3. Enable pgvector extension

The migration script includes `CREATE EXTENSION IF NOT EXISTS vector;`, which should enable it. If you need to enable it manually:

1. Go to the SQL Editor
2. Run: `CREATE EXTENSION IF NOT EXISTS vector;`

### 4. Enable Email Signup

1. Go to Project Settings > Authentication > Providers
2. Make sure Email is enabled
3. Configure email settings if needed

### 5. Configure Storage

1. Go to Storage
2. Create a new bucket called `documents`
3. Set the bucket to private (not public)
4. Add the following policy to allow authenticated users to upload:

```sql
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'documents');

CREATE POLICY "Users can read their documents" ON storage.objects
  FOR SELECT
  USING (auth.role() = 'authenticated' AND bucket_id = 'documents');

CREATE POLICY "Users can delete their documents" ON storage.objects
  FOR DELETE
  USING (auth.role() = 'authenticated' AND bucket_id = 'documents');
```

## Database Schema

The schema includes:

- **profiles**: User profile information
- **chatbots**: AI chatbot definitions
- **documents**: Uploaded documents
- **document_chunks**: Text chunks from documents with embeddings
- **conversations**: Chat conversations
- **messages**: Messages in conversations
- **usage**: Monthly usage tracking
- **subscriptions**: User subscription plans

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## Vector Search

The `document_chunks` table includes a `embedding` column (vector/1536) for storing OpenAI embeddings. The migration creates an IVFFLAT index for efficient similarity search.

To perform a vector search:

```sql
SELECT * FROM document_chunks
WHERE chatbot_id = $1
ORDER BY embedding <-> $2
LIMIT 5;
```
