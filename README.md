# Knowly - Turn Your Company Knowledge Into An AI Support Agent

A modern SaaS application that allows companies to upload documents and create AI-powered chatbots using Retrieval-Augmented Generation (RAG). The chatbot can be embedded on websites and provides instant, accurate answers based on uploaded knowledge.

## 🚀 Features

### Core Features
- **AI Chatbot Builder** - Create multiple AI chatbots with customizable system prompts and branding
- **Document Management** - Upload PDFs, TXT, and Markdown files. Documents are automatically chunked and indexed
- **Retrieval-Augmented Generation (RAG)** - Answers are based on your company knowledge, not hallucinations
- **Chat Interface** - Clean, ChatGPT-like interface with conversation history and streaming responses
- **Embeddable Widget** - Add a floating chat widget to any website with a simple code snippet
- **Analytics** - Track usage, top questions, and performance metrics
- **Multi-Plan Pricing** - Free, Pro, and Business plans with feature gating
- **Enterprise Security** - Row-Level Security (RLS) ensures data isolation between users

### Technical Highlights
- ✅ Built with Next.js 16 (App Router) + React 19 + TypeScript
- ✅ Tailwind CSS 4 with custom design tokens
- ✅ Supabase for authentication, database, and storage
- ✅ OpenAI API for embeddings and chat
- ✅ pgvector for vector search
- ✅ Server-side rendering and server actions
- ✅ Row-Level Security (RLS) for data protection
- ✅ Production-ready error handling and validation

## 📋 Project Structure

```
app/
├── page.tsx                 # Landing page
├── login/page.tsx          # Login page
├── signup/page.tsx         # Signup page
├── api/
│   ├── auth/               # Authentication endpoints
│   ├── chat/               # Chat API with RAG
│   └── documents/          # Document upload endpoint
└── dashboard/              # Protected dashboard routes
    ├── page.tsx            # Dashboard overview
    ├── knowledge/          # Document management
    ├── chatbot/            # Chatbot management
    ├── embed/              # Widget embed code
    ├── analytics/          # Usage analytics
    ├── billing/            # Billing management
    └── settings/           # Account settings

lib/
├── ai/                     # OpenAI integration
├── documents/              # Document processing & RAG
├── supabase/              # Database clients
├── billing/               # Billing configuration
└── types.ts               # TypeScript types

components/
└── ui/                    # Reusable UI components

supabase/
└── migrations/            # Database schema
```

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- React Hook Form
- Zod (validation)
- Lucide React (icons)

### Backend
- Next.js Server Actions & Route Handlers
- Supabase Auth
- PostgreSQL with pgvector
- Row-Level Security (RLS)

### AI/ML
- OpenAI API
  - `text-embedding-3-small` for embeddings
  - `gpt-4o-mini` for chat responses
- pgvector for similarity search

### Billing
- Stripe (test mode) or mock billing system

### State Management
- Server Components (default)
- React hooks for client state
- Minimal Zustand for widget state

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Setup Steps

1. **Clone the repository**
```bash
git clone <repo-url>
cd testing-paralect
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `OPENAI_API_KEY` - OpenAI API key
- `NEXT_PUBLIC_APP_URL` - Application URL (default: http://localhost:3000)

For Stripe test billing, also set:
- `STRIPE_SECRET_KEY` - Stripe test secret key
- `STRIPE_WEBHOOK_SECRET` - signing secret for `/api/billing/webhook`
- `STRIPE_PRICE_PRO` - recurring monthly test Price ID for Pro
- `STRIPE_PRICE_BUSINESS` - recurring monthly test Price ID for Business

4. **Set up Supabase**

   a. Create a new Supabase project at https://supabase.com
   
   b. Run the database migrations:
   - Go to Supabase Dashboard > SQL Editor
   - Create a new query
   - Copy and paste contents of `supabase/migrations/001_initial_schema.sql`
   - Run the query
   
   c. Configure Storage (optional):
   - Create a `documents` bucket in Storage
   - Set it to private
   - Add upload/download policies for authenticated users
   
   d. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions

5. **Set up OpenAI**
   - Get your API key from https://platform.openai.com/api-keys
   - Add it to `.env.local` as `OPENAI_API_KEY`

6. **Run the development server**
```bash
npm run dev
```

7. **Open http://localhost:3000**

### Stripe test billing

Create monthly recurring Products and Prices for Pro and Business in the Stripe test dashboard. Copy their Price IDs into `.env.local`. Add a webhook endpoint at `/api/billing/webhook` and subscribe it to `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.

For local webhook delivery, use the Stripe CLI and set the generated signing secret as `STRIPE_WEBHOOK_SECRET`:

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

Without Stripe keys or Price IDs, the Billing page uses the built-in mock checkout so the demo remains usable.

## 🎯 How It Works

### 1. User Signs Up
- User creates account with email and password
- Supabase creates auth user and profile
- Default free subscription is created

### 2. Create a Chatbot
- User creates a chatbot with name, description, system instructions
- System prompt is customizable to guide AI behavior

### 3. Upload Documents
- User uploads PDF, TXT, or Markdown files
- Documents are parsed and split into chunks
- Embeddings are generated using OpenAI
- Chunks with embeddings are stored in pgvector

### 4. User Asks Question
- Question is embedded using OpenAI
- Vector similarity search finds relevant document chunks
- Context is built from top 5 most relevant chunks
- System prompt + context + history sent to LLM
- Response is streamed back to user
- Sources are included in the response

### 5. Embed on Website
- User copies embed code from dashboard
- Code can be added to any website
- Widget communicates with public API endpoint
- Public endpoint validates chatbot ID and returns chat interface

## 🔐 Security

### Data Protection
- All user data protected by Supabase Row-Level Security (RLS)
- Users can only access their own data (chatbots, documents, conversations)
- Service role key never exposed to browser
- OpenAI API key only used server-side

### Authentication
- Supabase Auth handles user registration and login
- Sessions managed securely with HTTP-only cookies
- Protected routes redirect unauthenticated users to login

### Input Validation
- React Hook Form + Zod for client-side validation
- Server-side validation on all API endpoints
- File type and size validation for uploads
- SQL injection protection via parameterized queries

## 📊 Database Schema

### Core Tables
- **profiles** - User profile data
- **chatbots** - AI chatbot definitions
- **documents** - Uploaded documents metadata
- **document_chunks** - Text chunks with embeddings (pgvector)
- **conversations** - Chat sessions
- **messages** - Chat messages
- **usage** - Monthly usage tracking
- **subscriptions** - Plan information

All tables have RLS enabled for security.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Import project in Vercel
# https://vercel.com/new

# Configure environment variables in Vercel Dashboard
# Deploy!
```

### Docker
```bash
docker build -t knowly .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... knowly
```

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- ✅ User authentication
- ✅ Document upload and processing
- ✅ Chat with RAG
- 🏗️ Pricing and feature gating
- 🏗️ Embed widget
- 🏗️ Analytics

### Phase 2: Polish
- Error handling improvements
- Mobile responsiveness
- Accessibility audit
- Performance optimization

### Phase 3: Scale
- Batch document processing
- Multi-language support
- Advanced analytics
- Team collaboration
- Custom domains

## 📝 API Reference

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "chatbotId": "uuid",
  "message": "How do I get a refund?",
  "conversationId": "uuid" (optional),
  "userId": "uuid" (optional, for anonymous users)
}

Response: Server-sent events with streaming response
```

### Document Upload
```
POST /api/documents/upload
Content-Type: multipart/form-data

- file: File (PDF, TXT, MD)
- chatbotId: string
- userId: string

Response:
{
  "success": true,
  "documentId": "uuid",
  "message": "Document uploaded and processing"
}
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Sign up works
- [ ] Login works
- [ ] Create chatbot
- [ ] Upload document
- [ ] Ask question in chat
- [ ] Verify RAG context is used
- [ ] Test embed code
- [ ] Check analytics
- [ ] Verify pricing limits

### Example Demo Flow
1. Visit http://localhost:3000
2. Sign up with test email
3. Go to Knowledge section, upload a markdown file
4. Go to Chatbot, create a new chatbot
5. Go to Chat, ask a question about the uploaded content
6. Verify the answer is based on the document

## 🆘 Troubleshooting

### "Missing Supabase credentials"
- Check `.env.local` has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Verify credentials match your Supabase project

### "OpenAI API key error"
- Ensure OPENAI_API_KEY is set in `.env.local`
- Verify your OpenAI account has credits
- Check API key is not expired

### "Document processing fails"
- Verify file is valid PDF/TXT/MD
- Check file size is under 10MB
- Ensure pgvector is enabled in Supabase

### "Vector search returns no results"
- Verify documents have been indexed
- Check document status is "ready" in database
- Ensure embeddings were generated (check document_chunks table)

## 📚 Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)

## 📄 License

MIT License - feel free to use this project as a starting point for your own SaaS

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or feedback, please open an issue on GitHub.

---

