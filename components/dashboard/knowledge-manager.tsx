'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Upload, FileText, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { Chatbot, Document } from '@/lib/types';
import { cn } from '@/lib/cn';

const STATUS_LABEL: Record<Document['status'], string> = {
  uploading: 'Uploading...',
  processing: 'Processing...',
  indexing: 'Building knowledge index...',
  ready: 'Ready',
  failed: "Couldn't process this document",
};

function StatusBadge({ status }: { status: Document['status'] }) {
  if (status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400">
        <CheckCircle2 className="w-3.5 h-3.5" /> {STATUS_LABEL[status]}
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
        <XCircle className="w-3.5 h-3.5" /> {STATUS_LABEL[status]}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      <Loader2 className="w-3.5 h-3.5 animate-spin" /> {STATUS_LABEL[status]}
    </span>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function KnowledgeManager({
  chatbots,
  initialDocuments,
}: {
  chatbots: Chatbot[];
  initialDocuments: Document[];
}) {
  const [selectedChatbotId, setSelectedChatbotId] = useState(chatbots[0]?.id ?? '');
  const [documents, setDocuments] = useState(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visibleDocuments = documents.filter((d) => d.chatbot_id === selectedChatbotId);

  async function refreshDocuments() {
    const res = await fetch(`/api/documents?chatbotId=${selectedChatbotId}`);
    if (res.ok) {
      const data = await res.json();
      setDocuments((prev) => [
        ...data.documents,
        ...prev.filter((d) => d.chatbot_id !== selectedChatbotId),
      ]);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedChatbotId) return;

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatbotId', selectedChatbotId);

      const res = await fetch('/api/documents/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to upload document');
      } else {
        await refreshDocuments();
      }
    } catch {
      setError('Failed to upload document');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  }

  if (chatbots.length === 0) {
    return (
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-slate-600 dark:text-slate-400">Upload and manage documents for your chatbot</p>
        </div>
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Create a chatbot first, then come back here to upload its knowledge.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-slate-600 dark:text-slate-400">Upload and manage documents for your chatbot</p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedChatbotId} onChange={(e) => setSelectedChatbotId(e.target.value)}>
            {chatbots.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload document</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm">
              {error}
            </div>
          )}
          <label
            className={cn(
              'flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-10 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors',
              uploading && 'opacity-60 pointer-events-none'
            )}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" aria-hidden="true" />
            ) : (
              <Upload className="w-6 h-6 text-slate-400" aria-hidden="true" />
            )}
            <span className="text-sm font-medium" aria-live="polite">
              {uploading ? 'Uploading and indexing...' : 'Click to upload PDF, TXT, or Markdown'}
            </span>
            <span className="text-xs text-slate-500">Max 10MB</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </CardContent>
      </Card>

      {visibleDocuments.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                Upload your PDFs, documentation, FAQs, and other knowledge sources to train your chatbot.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {visibleDocuments.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{doc.filename}</p>
                      <p className="text-xs text-slate-500">
                        {formatSize(doc.size)} · {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                      {doc.status === 'failed' && doc.error_message && (
                        <p className="text-xs text-red-600 mt-1">{doc.error_message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <StatusBadge status={doc.status} />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => handleDelete(doc.id)}
                      aria-label={`Delete ${doc.filename}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
