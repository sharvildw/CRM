'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { formatDate, getStatusColor, getPriorityColor, getInitials } from '@/lib/utils';
import { Plus, Search, Filter, Eye, Edit, Trash2, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import Link from 'next/link';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' }, { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' }, { value: 'Proposal Sent', label: 'Proposal Sent' },
  { value: 'Negotiation', label: 'Negotiation' }, { value: 'Won', label: 'Won' }, { value: 'Lost', label: 'Lost' },
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' }, { value: 'Referral', label: 'Referral' },
  { value: 'LinkedIn', label: 'LinkedIn' }, { value: 'Cold Call', label: 'Cold Call' },
  { value: 'Email Campaign', label: 'Email Campaign' }, { value: 'Trade Show', label: 'Trade Show' },
  { value: 'Social Media', label: 'Social Media' }, { value: 'Advertisement', label: 'Advertisement' },
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' }, { value: 'Urgent', label: 'Urgent' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', company: '', source: 'Website', status: 'New', priority: 'Medium', assignedTo: '', followUpDate: '', estimatedValue: 0, tags: '' });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (source) params.set('source', source);
      if (priority) params.set('priority', priority);
      const res = await api.get(`/leads?${params}`);
      setLeads(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [page, status, source, priority]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchLeads(); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    api.get('/users/list').then(r => setUsers(r.data.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [], estimatedValue: Number(form.estimatedValue) };
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, data);
      } else {
        await api.post('/leads', data);
      }
      setShowForm(false);
      setEditingLead(null);
      setForm({ fullName: '', email: '', phone: '', company: '', source: 'Website', status: 'New', priority: 'Medium', assignedTo: '', followUpDate: '', estimatedValue: 0, tags: '' });
      fetchLeads();
    } catch (e: any) { alert(e.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this lead?')) return;
    await api.delete(`/leads/${id}`);
    fetchLeads();
  };

  const openEdit = (lead: any) => {
    setEditingLead(lead);
    setForm({
      fullName: lead.fullName, email: lead.email || '', phone: lead.phone || '', company: lead.company || '',
      source: lead.source, status: lead.status, priority: lead.priority, assignedTo: lead.assignedTo?._id || '',
      followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : '', estimatedValue: lead.estimatedValue || 0,
      tags: (lead.tags || []).join(', '),
    });
    setShowForm(true);
  };

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
            <p className="text-sm text-gray-500">Manage and track your sales leads</p>
          </div>
          <Button onClick={() => { setEditingLead(null); setForm({ fullName: '', email: '', phone: '', company: '', source: 'Website', status: 'New', priority: 'Medium', assignedTo: '', followUpDate: '', estimatedValue: 0, tags: '' }); setShowForm(true); }}>
            <Plus className="mr-1 h-4 w-4" /> Add Lead
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
              <Select options={statusOptions} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="w-40" />
              <Select options={sourceOptions} value={source} onChange={e => { setSource(e.target.value); setPage(1); }} className="w-40" />
              <Select options={priorityOptions} value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }} className="w-40" />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Assigned</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                      {[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" /></td>)}
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-gray-500">No leads found</td></tr>
                ) : (
                  leads.map(lead => (
                    <tr key={lead._id} className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{lead.fullName}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{lead.company || '-'}</td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(lead.status)}`}>{lead.status}</span></td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(lead.priority)}`}>{lead.priority}</span></td>
                      <td className="px-4 py-3"><Badge variant="secondary">{lead.source}</Badge></td>
                      <td className="px-4 py-3">
                        {lead.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                              {getInitials(lead.assignedTo.name)}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{lead.assignedTo.name}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(lead.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Link href={`/leads/${lead._id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                          </Link>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(lead)}><Edit className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(lead._id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages} ({pagination.total} total)</p>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </Card>

        {/* Add/Edit Lead Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1 block text-sm font-medium">Full Name *</label><Input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required /></div>
                <div><label className="mb-1 block text-sm font-medium">Email</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm font-medium">Phone</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm font-medium">Company</label><Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm font-medium">Source</label><Select options={sourceOptions.slice(1)} value={form.source} onChange={e => setForm({...form, source: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm font-medium">Status</label><Select options={statusOptions.slice(1)} value={form.status} onChange={e => setForm({...form, status: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm font-medium">Priority</label><Select options={priorityOptions.slice(1)} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm font-medium">Assigned To</label><Select options={[{value:'',label:'Unassigned'}, ...users.map(u=>({value:u._id,label:u.name}))]} value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm font-medium">Follow-up Date</label><Input type="date" value={form.followUpDate} onChange={e => setForm({...form, followUpDate: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm font-medium">Est. Value ($)</label><Input type="number" value={form.estimatedValue} onChange={e => setForm({...form, estimatedValue: Number(e.target.value)})} /></div>
              </div>
              <div><label className="mb-1 block text-sm font-medium">Tags (comma separated)</label><Input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="e.g. Enterprise, Hot Lead" /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">{editingLead ? 'Update' : 'Create'} Lead</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
