'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { formatDate, getStatusColor, getPriorityColor, getInitials, formatCurrency, timeAgo } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, Building, Calendar, Tag, UserPlus, MessageSquare, Activity } from 'lucide-react';

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const [leadRes, actRes] = await Promise.all([
          api.get(`/leads/${id}`),
          api.get(`/activities?relatedToType=Lead&relatedToId=${id}&limit=20`),
        ]);
        setLead(leadRes.data.data);
        setActivities(actRes.data.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchLead();
  }, [id]);

  const addNote = async () => {
    if (!note.trim()) return;
    try {
      await api.post(`/leads/${id}/notes`, { text: note });
      setNote('');
      const res = await api.get(`/leads/${id}`);
      setLead(res.data.data);
    } catch (e) { console.error(e); }
  };

  const convertToCustomer = async () => {
    if (!confirm('Convert this lead to a customer?')) return;
    try {
      await api.post(`/leads/${id}/convert`);
      router.push('/customers');
    } catch (e: any) { alert(e.response?.data?.message || 'Error'); }
  };

  if (loading) return <DashboardLayout><div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" /></div></DashboardLayout>;
  if (!lead) return <DashboardLayout><p className="text-center text-gray-500">Lead not found</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.fullName}</h1>
              <p className="text-sm text-gray-500">{lead.company || 'No company'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {lead.status !== 'Won' && lead.status !== 'Lost' && (
              <Button variant="success" onClick={convertToCustomer}><UserPlus className="mr-1 h-4 w-4" /> Convert to Customer</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Lead Info */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Lead Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium dark:text-white">{lead.email || '-'}</p></div></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium dark:text-white">{lead.phone || '-'}</p></div></div>
                  <div className="flex items-center gap-2"><Building className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Company</p><p className="text-sm font-medium dark:text-white">{lead.company || '-'}</p></div></div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Follow-up</p><p className="text-sm font-medium dark:text-white">{lead.followUpDate ? formatDate(lead.followUpDate) : '-'}</p></div></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(lead.status)}`}>{lead.status}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(lead.priority)}`}>{lead.priority}</span>
                  <Badge variant="secondary">{lead.source}</Badge>
                  {lead.estimatedValue > 0 && <Badge variant="outline">{formatCurrency(lead.estimatedValue)}</Badge>}
                </div>
                {lead.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {lead.tags.map((tag: string, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"><Tag className="h-3 w-3" />{tag}</span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-indigo-500" /> Notes</CardTitle></CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-2">
                  <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." rows={2} className="flex-1" />
                  <Button onClick={addNote} disabled={!note.trim()}>Add</Button>
                </div>
                <div className="space-y-3">
                  {(lead.notes || []).slice().reverse().map((n: any, i: number) => (
                    <div key={i} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{n.text}</p>
                      <p className="mt-1 text-xs text-gray-400">{n.createdBy?.name || 'Unknown'} · {timeAgo(n.createdAt)}</p>
                    </div>
                  ))}
                  {(!lead.notes || lead.notes.length === 0) && <p className="text-center text-sm text-gray-400 py-4">No notes yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Assigned To</CardTitle></CardHeader>
              <CardContent>
                {lead.assignedTo ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {getInitials(lead.assignedTo.name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{lead.assignedTo.name}</p>
                      <p className="text-xs text-gray-500">{lead.assignedTo.role}</p>
                    </div>
                  </div>
                ) : <p className="text-sm text-gray-500">Unassigned</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-green-500" /> Activity Timeline</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.slice(0, 10).map((act: any) => (
                    <div key={act._id} className="flex gap-3 border-l-2 border-indigo-200 pl-3 dark:border-indigo-800">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{act.description}</p>
                        <p className="text-xs text-gray-400">{timeAgo(act.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No activity yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
