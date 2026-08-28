'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Plus, Pencil, Trash2, ExternalLink, X } from 'lucide-react';
import type { Chatbot } from '@/lib/types';

const chatbotFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  systemPrompt: z.string().max(4000).optional().or(z.literal('')),
  welcomeMessage: z.string().max(300).optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color like #4f46e5'),
});

type ChatbotFormValues = z.infer<typeof chatbotFormSchema>;

export function ChatbotManager({ initialChatbots }: { initialChatbots: Chatbot[] }) {
  const [chatbots, setChatbots] = useState(initialChatbots);
  const [editing, setEditing] = useState<Chatbot | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChatbotFormValues>({
    resolver: zodResolver(chatbotFormSchema),
    defaultValues: {
      name: '',
      description: '',
      systemPrompt:
        "You are a helpful customer support assistant. Answer questions using the provided company knowledge. If the answer cannot be found in the provided knowledge, say that you don't know. Never invent company policies, prices or facts.",
      welcomeMessage: 'Hello! How can I help you?',
      primaryColor: '#4f46e5',
    },
  });

  function openCreate() {
    setEditing(null);
    setFormError('');
    reset({
      name: '',
      description: '',
      systemPrompt:
        "You are a helpful customer support assistant. Answer questions using the provided company knowledge. If the answer cannot be found in the provided knowledge, say that you don't know. Never invent company policies, prices or facts.",
      welcomeMessage: 'Hello! How can I help you?',
      primaryColor: '#4f46e5',
    });
    setShowForm(true);
  }

  function openEdit(chatbot: Chatbot) {
    setEditing(chatbot);
    setFormError('');
    reset({
      name: chatbot.name,
      description: chatbot.description ?? '',
      systemPrompt: chatbot.system_prompt ?? '',
      welcomeMessage: chatbot.welcome_message ?? '',
      primaryColor: chatbot.primary_color ?? '#4f46e5',
    });
    setShowForm(true);
  }

  async function onSubmit(values: ChatbotFormValues) {
    setFormError('');
    const isEdit = Boolean(editing);
    const url = isEdit ? `/api/chatbots/${editing!.id}` : '/api/chatbots';
    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || 'Something went wrong');
      return;
    }

    if (isEdit) {
      setChatbots((prev) => prev.map((c) => (c.id === data.chatbot.id ? data.chatbot : c)));
    } else {
      setChatbots((prev) => [data.chatbot, ...prev]);
    }

    setShowForm(false);
    setEditing(null);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/chatbots/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setChatbots((prev) => prev.filter((c) => c.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chatbots</h1>
          <p className="text-slate-600 dark:text-slate-400">Create and manage your AI chatbots</p>
        </div>
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          New Chatbot
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editing ? 'Edit Chatbot' : 'New Chatbot'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} aria-label="Close form">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm">
                  {formError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Acme Support" {...register('name')} />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="AI assistant for customer support" {...register('description')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemPrompt">Instructions</Label>
                <Textarea id="systemPrompt" rows={4} {...register('systemPrompt')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome message</Label>
                <Input id="welcomeMessage" {...register('welcomeMessage')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary color</Label>
                <Input id="primaryColor" className="w-32" placeholder="#4f46e5" {...register('primaryColor')} />
                {errors.primaryColor && <p className="text-sm text-red-600">{errors.primaryColor.message}</p>}
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={isSubmitting}>
                  {editing ? 'Save Changes' : 'Create Chatbot'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {chatbots.length === 0 && !showForm ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No chatbots yet</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                Create your first chatbot and start helping your customers.
              </p>
              <Button className="gap-2" onClick={openCreate}>
                <Plus className="w-4 h-4" />
                Create Chatbot
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chatbots.map((chatbot) => (
            <Card key={chatbot.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: chatbot.primary_color || '#4f46e5' }}
                  >
                    {chatbot.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle>{chatbot.name}</CardTitle>
                    <p className="text-xs text-slate-500 mt-1 capitalize">{chatbot.status}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {chatbot.description || 'No description'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/chat?chatbotId=${chatbot.id}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <ExternalLink className="w-3.5 h-3.5" /> Test
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(chatbot)}>
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    loading={deletingId === chatbot.id}
                    onClick={() => handleDelete(chatbot.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
