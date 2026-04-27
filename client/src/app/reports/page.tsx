'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Download, TrendingUp, Users, Target, BarChart2, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#ef4444', '#f59e0b', '#06b6d4'];

export default function ReportsPage() {
  const [leadConversion, setLeadConversion] = useState<any[]>([]);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [salesPerformance, setSalesPerformance] = useState<any[]>([]);
  const [dealStages, setDealStages] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [taskCompletion, setTaskCompletion] = useState<any[]>([]);
  const [customerGrowth, setCustomerGrowth] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [wonVsLost, setWonVsLost] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [lc, ls, sp, ds, rev, tc, cg, tp, wl] = await Promise.all([
          api.get('/reports/lead-conversion'), api.get('/reports/lead-sources'),
          api.get('/reports/sales-performance'), api.get('/reports/deal-stages'),
          api.get('/reports/revenue'), api.get('/reports/task-completion'),
          api.get('/reports/customer-growth'), api.get('/reports/top-performers'),
          api.get('/reports/won-vs-lost'),
        ]);
        setLeadConversion(lc.data.data || []);
        setLeadSources(ls.data.data || []);
        setSalesPerformance(sp.data.data || []);
        setDealStages(ds.data.data || []);
        setRevenue(rev.data.data || []);
        setTaskCompletion(tc.data.data || []);
        setCustomerGrowth(cg.data.data || []);
        setTopPerformers(tp.data.data || []);
        setWonVsLost(wl.data.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(r => Object.values(r).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
  };

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1><p className="text-sm text-gray-500">Business intelligence and insights</p></div>
          <Button variant="outline" onClick={() => window.print()}><Download className="mr-1 h-4 w-4" /> Export</Button>
        </div>

        {loading ? <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">{[...Array(6)].map((_, i) => <Card key={i}><CardContent className="p-6"><div className="h-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" /></CardContent></Card>)}</div> : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Lead Conversion Funnel */}
            <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-indigo-500" /> Lead Conversion</CardTitle><Button size="sm" variant="ghost" onClick={() => exportCSV(leadConversion.map(l => ({status: l._id, count: l.count})), 'lead-conversion')}><Download className="h-3 w-3" /></Button></CardHeader><CardContent>
              <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadConversion.map(l => ({ status: l._id, count: l.count }))}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="#9ca3af" /><YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" /><Tooltip /><Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer></div>
            </CardContent></Card>

            {/* Lead Sources */}
            <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><PieIcon className="h-5 w-5 text-purple-500" /> Lead Sources</CardTitle><Button size="sm" variant="ghost" onClick={() => exportCSV(leadSources.map(s => ({source: s._id, total: s.count, won: s.won})), 'lead-sources')}><Download className="h-3 w-3" /></Button></CardHeader><CardContent>
              <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={leadSources.map(s => ({ name: s._id, value: s.count }))} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                  {leadSources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer></div>
            </CardContent></Card>

            {/* Revenue Trends */}
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /> Monthly Revenue</CardTitle></CardHeader><CardContent>
              <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue.map(r => ({ month: r._id, revenue: r.revenue }))}>
                  <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" /><YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} /><Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Revenue']} /><Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#rev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer></div>
            </CardContent></Card>

            {/* Deal Stages */}
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5 text-orange-500" /> Deal Distribution</CardTitle></CardHeader><CardContent>
              <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%">
                <BarChart data={dealStages.map(s => ({ stage: s._id, count: s.count, value: s.totalValue }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="stage" tick={{ fontSize: 10 }} stroke="#9ca3af" /><YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" /><Tooltip /><Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer></div>
            </CardContent></Card>

            {/* Task Completion */}
            <Card><CardHeader><CardTitle>Task Completion</CardTitle></CardHeader><CardContent>
              <div className="h-[280px]"><ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={taskCompletion.map(t => ({ name: t._id, value: t.count }))} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                  {taskCompletion.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer></div>
            </CardContent></Card>

            {/* Won vs Lost */}
            <Card><CardHeader><CardTitle>Won vs Lost Deals</CardTitle></CardHeader><CardContent>
              <div className="flex items-center justify-center gap-8 py-8">
                {wonVsLost.map(d => (
                  <div key={d._id} className="text-center">
                    <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${d._id === 'Closed Won' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <span className={`text-2xl font-bold ${d._id === 'Closed Won' ? 'text-green-600' : 'text-red-600'}`}>{d.count}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{d._id}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(d.value)}</p>
                  </div>
                ))}
              </div>
            </CardContent></Card>
          </div>

          {/* Top Performers */}
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-500" /> Top Sales Performers</CardTitle></CardHeader><CardContent>
            <div className="space-y-3">
              {topPerformers.map((p, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-700' : 'bg-gray-300'}`}>{i + 1}</div>
                  <div className="flex-1"><p className="font-medium text-gray-900 dark:text-white">{p.name}</p><p className="text-xs text-gray-500">{p.deals} deals closed</p></div>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(p.revenue)}</p>
                </div>
              ))}
              {topPerformers.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No data yet</p>}
            </div>
          </CardContent></Card>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}
