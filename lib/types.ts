// Types for the application
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Chatbot {
  id: string;
  user_id: string;
  name: string;
  description: string;
  system_prompt: string;
  welcome_message: string;
  primary_color: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  chatbot_id: string;
  user_id: string;
  filename: string;
  storage_path: string;
  file_type: string;
  status: 'uploading' | 'processing' | 'indexing' | 'ready' | 'failed';
  size: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  chatbot_id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
  chunk_index: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  chatbot_id: string;
  user_id?: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  created_at: string;
}

export interface Usage {
  id: string;
  user_id: string;
  period: string;
  questions_count: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: 'active' | 'canceled' | 'expired';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}
