'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { formatDate, getStatusColor, getInitials, formatCurrency, timeAgo } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, Building, Globe, MapPin, MessageSquare, Activity, Handshake } from 'lucide-react';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [comms, setComms] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, dRes, aRes, commRes] = await Promise.all([
          api.get(`/customers/${id}`),
          api.get(`/deals?customer=${id}`),
          api.get(`/activities?relatedToType=Customer&relatedToId=${id}&limit=15`),
          api.get(`/communications?relatedToType=Customer&relatedToId=${id}&limit=10`),
        ]);
        setCustomer(cRes.data.data);
        setDeals(dRes.data.data || []);
        setActivities(aRes.data.data || []);
        setComms(commRes.data.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const addNote = async () => {
    if (!note.trim()) return;
    await api.post(`/customers/${id}/notes`, { text: note });
    setNote('');
    const res = await api.get(`/customers/${id}`);
    setCustomer(res.data.data);
  };

  if (loading) return <DashboardLayout><div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" /></div></DashboardLayout>;
  if (!customer) return <DashboardLayout><p className="text-center text-gray-500">Customer not found</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h1><p className="text-sm text-gray-500">{customer.company}</p></div>
          <span className={`ml-4 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(customer.status)}`}>{customer.status}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card><CardHeader><CardTitle>Customer Information</CardTitle></CardHeader><CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium dark:text-white">{customer.email || '-'}</p></div></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium dark:text-white">{customer.phone || '-'}</p></div></div>
                <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Website</p><p className="text-sm font-medium dark:text-white">{customer.website || '-'}</p></div></div>
                <div className="flex items-center gap-2"><Building className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Industry</p><p className="text-sm font-medium dark:text-white">{customer.industry}</p></div></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Address</p><p className="text-sm font-medium dark:text-white">{customer.address?.city ? `${customer.address.city}, ${customer.address.state}` : '-'}</p></div></div>
                <div><p className="text-xs text-gray-500">Total Revenue</p><p className="text-lg font-bold text-green-600">{formatCurrency(customer.totalRevenue || 0)}</p></div>
              </div>
            </CardContent></Card>

            {/* Deals */}
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Handshake className="h-5 w-5 text-purple-500" /> Deals ({deals.length})</CardTitle></CardHeader><CardContent>
              {deals.length === 0 ? <p className="text-center text-sm text-gray-500 py-4">No deals</p> :
              <div className="space-y-2">{deals.map(d => (
                <div key={d._id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <div><p className="font-medium text-gray-900 dark:text-white">{d.title}</p><p className="text-xs text-gray-500">{formatCurrency(d.value)}</p></div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(d.stage)}`}>{d.stage}</span>
                </div>
              ))}</div>}
            </CardContent></Card>

            {/* Notes */}
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-indigo-500" /> Notes</CardTitle></CardHeader><CardContent>
              <div className="mb-4 flex gap-2"><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." rows={2} className="flex-1" /><Button onClick={addNote} disabled={!note.trim()}>Add</Button></div>
              <div className="space-y-3">{(customer.notes || []).slice().reverse().map((n: any, i: number) => (
                <div key={i} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"><p className="text-sm text-gray-700 dark:text-gray-300">{n.text}</p><p className="mt-1 text-xs text-gray-400">{n.createdBy?.name} · {timeAgo(n.createdAt)}</p></div>
              ))}</div>
            </CardContent></Card>
          </div>

          <div className="space-y-6">
            <Card><CardHeader><CardTitle>Account Manager</CardTitle></CardHeader><CardContent>
              {customer.accountManager ? <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{getInitials(customer.accountManager.name)}</div><div><p className="font-medium dark:text-white">{customer.accountManager.name}</p><p className="text-xs text-gray-500">{customer.accountManager.role}</p></div></div> : <p className="text-sm text-gray-500">Unassigned</p>}
            </CardContent></Card>

            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-green-500" /> Recent Activity</CardTitle></CardHeader><CardContent>
              <div className="space-y-3">{activities.slice(0, 8).map(a => (
                <div key={a._id} className="flex gap-3 border-l-2 border-indigo-200 pl-3 dark:border-indigo-800"><div><p className="text-sm text-gray-700 dark:text-gray-300">{a.description}</p><p className="text-xs text-gray-400">{timeAgo(a.createdAt)}</p></div></div>
              ))}{activities.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No activity</p>}</div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Communications</CardTitle></CardHeader><CardContent>
              <div className="space-y-2">{comms.slice(0, 5).map(c => (
                <div key={c._id} className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50"><div className="flex items-center gap-2"><Badge variant="secondary">{c.type}</Badge><span className="text-xs text-gray-400">{formatDate(c.date)}</span></div><p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{c.description}</p></div>
              ))}{comms.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No communications</p>}</div>
            </CardContent></Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
