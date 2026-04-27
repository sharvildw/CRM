'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/lib/api';
import { formatCurrency, getStatusColor, getInitials } from '@/lib/utils';
import { Plus, GripVertical, List, LayoutGrid } from 'lucide-react';

const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
const stageColors: Record<string, string> = {
  'Prospecting': 'border-t-cyan-500', 'Qualification': 'border-t-purple-500', 'Proposal': 'border-t-indigo-500',
  'Negotiation': 'border-t-orange-500', 'Closed Won': 'border-t-green-500', 'Closed Lost': 'border-t-red-500',
};

export default function DealsPage() {
  const [pipeline, setPipeline] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [draggedDeal, setDraggedDeal] = useState<any>(null);
  const [form, setForm] = useState({ title: '', customer: '', value: 0, probability: 50, expectedCloseDate: '', stage: 'Prospecting', owner: '' });

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const res = await api.get('/deals/pipeline');
      setPipeline(res.data.data || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchPipeline(); }, []);
  useEffect(() => {
    Promise.all([api.get('/customers?limit=100'), api.get('/users/list')]).then(([c, u]) => {
      setCustomers(c.data.data || []);
      setUsers(u.data.data || []);
    }).catch(() => {});
  }, []);

  const handleDragStart = (deal: any) => setDraggedDeal(deal);
  const handleDrop = async (newStage: string) => {
    if (!draggedDeal || draggedDeal.stage === newStage) return;
    try {
      await api.put(`/deals/${draggedDeal._id}/stage`, { stage: newStage });
      fetchPipeline();
    } catch (e) { console.error(e); }
    setDraggedDeal(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/deals', { ...form, value: Number(form.value), probability: Number(form.probability) });
      setShowForm(false);
      fetchPipeline();
    } catch (e: any) { alert(e.response?.data?.message || 'Error'); }
  };

  const totalByStage = (stage: string) => (pipeline[stage] || []).reduce((sum: number, d: any) => sum + d.value, 0);

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deals Pipeline</h1><p className="text-sm text-gray-500">Manage your sales pipeline</p></div>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
              <button onClick={() => setView('kanban')} className={`p-2 ${view === 'kanban' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'text-gray-400'}`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'text-gray-400'}`}><List className="h-4 w-4" /></button>
            </div>
            <Button onClick={() => setShowForm(true)}><Plus className="mr-1 h-4 w-4" /> Add Deal</Button>
          </div>
        </div>

        {/* Kanban Board */}
        {view === 'kanban' ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map(stage => (
              <div key={stage} className="flex w-72 shrink-0 flex-col"
                onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(stage)}>
                <div className={`mb-3 rounded-lg border-t-4 bg-white p-3 shadow-sm dark:bg-gray-800 ${stageColors[stage]}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{stage}</h3>
                    <Badge variant="secondary">{(pipeline[stage] || []).length}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{formatCurrency(totalByStage(stage))}</p>
                </div>
                <div className="flex-1 space-y-2">
                  {loading ? [...Array(2)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />) :
                  (pipeline[stage] || []).map(deal => (
                    <div key={deal._id} draggable onDragStart={() => handleDragStart(deal)}
                      className="cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md active:cursor-grabbing dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{deal.title}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{deal.customer?.name || 'No customer'}</p>
                        </div>
                        <GripVertical className="h-4 w-4 text-gray-300" />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{formatCurrency(deal.value)}</span>
                        {deal.owner && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300" title={deal.owner.name}>
                            {getInitials(deal.owner.name)}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                        <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${deal.probability}%` }} />
                      </div>
                      <p className="mt-1 text-right text-[10px] text-gray-400">{deal.probability}% probability</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Deal</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Value</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Stage</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Probability</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Owner</th>
          </tr></thead><tbody>{stages.flatMap(stage => (pipeline[stage] || []).map(d => (
            <tr key={d._id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{d.title}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{d.customer?.name || '-'}</td>
              <td className="px-4 py-3 text-sm font-semibold text-indigo-600">{formatCurrency(d.value)}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(d.stage)}`}>{d.stage}</span></td>
              <td className="px-4 py-3 text-sm">{d.probability}%</td>
              <td className="px-4 py-3 text-sm">{d.owner?.name || '-'}</td>
            </tr>
          )))}</tbody></table></div></Card>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}><DialogContent><DialogHeader><DialogTitle>New Deal</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="mb-1 block text-sm font-medium">Title *</label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
            <div><label className="mb-1 block text-sm font-medium">Customer</label><Select options={[{value:'',label:'Select...'}, ...customers.map(c=>({value:c._id,label:c.name}))]} value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Value ($) *</label><Input type="number" value={form.value} onChange={e => setForm({...form, value: Number(e.target.value)})} required /></div>
            <div><label className="mb-1 block text-sm font-medium">Probability (%)</label><Input type="number" min={0} max={100} value={form.probability} onChange={e => setForm({...form, probability: Number(e.target.value)})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Expected Close</label><Input type="date" value={form.expectedCloseDate} onChange={e => setForm({...form, expectedCloseDate: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Stage</label><Select options={stages.map(s=>({value:s,label:s}))} value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Owner</label><Select options={[{value:'',label:'Select...'}, ...users.map(u=>({value:u._id,label:u.name}))]} value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} /></div>
          </div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit">Create Deal</Button></div></form>
        </DialogContent></Dialog>
      </div>
    </DashboardLayout>
  );
}
