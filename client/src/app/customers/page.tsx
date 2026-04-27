'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/lib/api';
import { formatDate, getStatusColor, getInitials, formatCurrency } from '@/lib/utils';
import { Plus, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const statusOpts = [{ value: '', label: 'All' }, { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }, { value: 'Churned', label: 'Churned' }];
const industryOpts = [{ value: '', label: 'All Industries' }, { value: 'Technology', label: 'Technology' }, { value: 'Healthcare', label: 'Healthcare' }, { value: 'Finance', label: 'Finance' }, { value: 'Education', label: 'Education' }, { value: 'Manufacturing', label: 'Manufacturing' }, { value: 'Retail', label: 'Retail' }, { value: 'Real Estate', label: 'Real Estate' }, { value: 'Consulting', label: 'Consulting' }, { value: 'Marketing', label: 'Marketing' }, { value: 'Legal', label: 'Legal' }, { value: 'Other', label: 'Other' }];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', company: '', contactPerson: '', email: '', phone: '', industry: 'Technology', status: 'Active', accountManager: '', website: '' });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (industry) params.set('industry', industry);
      const res = await api.get(`/customers?${params}`);
      setCustomers(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, [page, status, industry]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchCustomers(); }, 300); return () => clearTimeout(t); }, [search]);
  useEffect(() => { api.get('/users/list').then(r => setUsers(r.data.data || [])).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) await api.put(`/customers/${editingCustomer._id}`, form);
      else await api.post('/customers', form);
      setShowForm(false); setEditingCustomer(null); fetchCustomers();
    } catch (e: any) { alert(e.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id: string) => { if (confirm('Archive this customer?')) { await api.delete(`/customers/${id}`); fetchCustomers(); } };

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1><p className="text-sm text-gray-500">Manage your customer relationships</p></div>
          <Button onClick={() => { setEditingCustomer(null); setForm({ name: '', company: '', contactPerson: '', email: '', phone: '', industry: 'Technology', status: 'Active', accountManager: '', website: '' }); setShowForm(true); }}><Plus className="mr-1 h-4 w-4" /> Add Customer</Button>
        </div>

        <Card><CardContent className="p-4"><div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
          <Select options={statusOpts} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="w-36" />
          <Select options={industryOpts} value={industry} onChange={e => { setIndustry(e.target.value); setPage(1); }} className="w-44" />
        </div></CardContent></Card>

        <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Customer</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Industry</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Account Manager</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Revenue</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Created</th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
        </tr></thead><tbody>
          {loading ? [...Array(5)].map((_, i) => <tr key={i} className="border-b border-gray-100 dark:border-gray-800">{[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" /></td>)}</tr>) :
          customers.length === 0 ? <tr><td colSpan={7} className="py-12 text-center text-gray-500">No customers found</td></tr> :
          customers.map(c => (
            <tr key={c._id} className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
              <td className="px-4 py-3"><p className="font-medium text-gray-900 dark:text-white">{c.name}</p><p className="text-xs text-gray-500">{c.email}</p></td>
              <td className="px-4 py-3"><Badge variant="secondary">{c.industry}</Badge></td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(c.status)}`}>{c.status}</span></td>
              <td className="px-4 py-3">{c.accountManager ? <div className="flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{getInitials(c.accountManager.name)}</div><span className="text-sm">{c.accountManager.name}</span></div> : '-'}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(c.totalRevenue || 0)}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(c.createdAt)}</td>
              <td className="px-4 py-3"><div className="flex justify-end gap-1">
                <Link href={`/customers/${c._id}`}><Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></Link>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingCustomer(c); setForm({ name: c.name, company: c.company||'', contactPerson: c.contactPerson||'', email: c.email||'', phone: c.phone||'', industry: c.industry, status: c.status, accountManager: c.accountManager?._id||'', website: c.website||'' }); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDelete(c._id)}><Trash2 className="h-4 w-4" /></Button>
              </div></td>
            </tr>
          ))}
        </tbody></table></div>
        {pagination.pages > 1 && <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700"><p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p><div className="flex gap-1"><Button size="sm" variant="outline" disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button><Button size="sm" variant="outline" disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button></div></div>}
        </Card>

        <Dialog open={showForm} onOpenChange={setShowForm}><DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingCustomer ? 'Edit' : 'Add'} Customer</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium">Name *</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div><label className="mb-1 block text-sm font-medium">Company</label><Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Contact Person</label><Input value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Email</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Phone</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Website</label><Input value={form.website} onChange={e => setForm({...form, website: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Industry</label><Select options={industryOpts.slice(1)} value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Status</label><Select options={statusOpts.slice(1)} value={form.status} onChange={e => setForm({...form, status: e.target.value})} /></div>
            <div className="col-span-2"><label className="mb-1 block text-sm font-medium">Account Manager</label><Select options={[{value:'',label:'Unassigned'}, ...users.map(u=>({value:u._id,label:u.name}))]} value={form.accountManager} onChange={e => setForm({...form, accountManager: e.target.value})} /></div>
          </div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit">{editingCustomer ? 'Update' : 'Create'}</Button></div></form>
        </DialogContent></Dialog>
      </div>
    </DashboardLayout>
  );
}
