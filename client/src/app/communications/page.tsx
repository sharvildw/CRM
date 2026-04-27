'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { formatDate, timeAgo } from '@/lib/utils';
import { Plus, Search, Phone, Mail, Users, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const typeOpts = [{ value: '', label: 'All Types' }, { value: 'Call', label: 'Call' }, { value: 'Email', label: 'Email' }, { value: 'Meeting', label: 'Meeting' }, { value: 'Internal Comment', label: 'Internal Comment' }, { value: 'Follow-up', label: 'Follow-up' }];
const typeIcons: Record<string, any> = { Call: Phone, Email: Mail, Meeting: Users, 'Internal Comment': MessageSquare, 'Follow-up': MessageSquare };

export default function CommunicationsPage() {
  const [comms, setComms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'Call', relatedToType: 'Lead', relatedToId: '', subject: '', description: '', duration: 0, outcome: '' });

  const fetchComms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (type) params.set('type', type);
      const res = await api.get(`/communications?${params}`);
      setComms(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchComms(); }, [page, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/communications', { ...form, duration: Number(form.duration) }); setShowForm(false); fetchComms(); }
    catch (e: any) { alert(e.response?.data?.message || 'Error'); }
  };

  const typeColors: Record<string, string> = { Call: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', Email: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', Meeting: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', 'Internal Comment': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', 'Follow-up': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communications</h1><p className="text-sm text-gray-500">Track all interactions</p></div>
          <Button onClick={() => setShowForm(true)}><Plus className="mr-1 h-4 w-4" /> Log Communication</Button>
        </div>

        <Card><CardContent className="p-4"><div className="flex gap-3">
          <Select options={typeOpts} value={type} onChange={e => { setType(e.target.value); setPage(1); }} className="w-44" />
        </div></CardContent></Card>

        <div className="space-y-3">
          {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />) :
          comms.length === 0 ? <Card><CardContent className="py-12 text-center text-gray-500">No communications found</CardContent></Card> :
          comms.map(c => {
            const Icon = typeIcons[c.type] || MessageSquare;
            return (
              <Card key={c._id} className="transition-all hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColors[c.type] || 'bg-gray-100'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[c.type]}`}>{c.type}</span>
                      {c.subject && <p className="font-medium text-gray-900 dark:text-white">{c.subject}</p>}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{c.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span>{formatDate(c.date)}</span>
                      {c.duration > 0 && <span>{c.duration} min</span>}
                      {c.outcome && <Badge variant="secondary">{c.outcome}</Badge>}
                      {c.createdBy && <span>by {c.createdBy.name}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {pagination.pages > 1 && <div className="flex items-center justify-between"><p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p><div className="flex gap-1"><Button size="sm" variant="outline" disabled={!pagination.hasPrev} onClick={() => setPage(p => p-1)}><ChevronLeft className="h-4 w-4" /></Button><Button size="sm" variant="outline" disabled={!pagination.hasNext} onClick={() => setPage(p => p+1)}><ChevronRight className="h-4 w-4" /></Button></div></div>}

        <Dialog open={showForm} onOpenChange={setShowForm}><DialogContent><DialogHeader><DialogTitle>Log Communication</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="mb-1 block text-sm font-medium">Type</label><Select options={typeOpts.slice(1)} value={form.type} onChange={e => setForm({...form, type: e.target.value})} /></div>
              <div><label className="mb-1 block text-sm font-medium">Related To</label><Select options={[{value:'Lead',label:'Lead'},{value:'Customer',label:'Customer'},{value:'Deal',label:'Deal'}]} value={form.relatedToType} onChange={e => setForm({...form, relatedToType: e.target.value})} /></div>
            </div>
            <div><label className="mb-1 block text-sm font-medium">Subject</label><Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Description *</label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="mb-1 block text-sm font-medium">Duration (min)</label><Input type="number" value={form.duration} onChange={e => setForm({...form, duration: Number(e.target.value)})} /></div>
              <div><label className="mb-1 block text-sm font-medium">Outcome</label><Input value={form.outcome} onChange={e => setForm({...form, outcome: e.target.value})} placeholder="e.g. Positive" /></div>
            </div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit">Log</Button></div>
          </form>
        </DialogContent></Dialog>
      </div>
    </DashboardLayout>
  );
}
