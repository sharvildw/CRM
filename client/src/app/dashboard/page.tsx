'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { formatCurrency, timeAgo, getStatusColor } from '@/lib/utils';
import {
  Users, UserCheck, Handshake, CheckSquare, TrendingUp,
  AlertCircle, Clock, DollarSign, Target, Activity,
  ArrowUpRight, ArrowDownRight, Zap, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';

interface DashboardStats {
  totalLeads: number;
  activeCustomers: number;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  pendingTasks: number;
  overdueTasks: number;
  followUpsToday: number;
  monthlyRevenue: number;
  conversionRate: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#22c55e', '#ef4444'];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [dealStages, setDealStages] = useState<any[]>([]);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes, stagesRes, sourcesRes, revenueRes] = await Promise.all([
          api.get('/reports/dashboard'),
          api.get('/activities/recent?limit=8'),
          api.get('/reports/deal-stages'),
          api.get('/reports/lead-sources'),
          api.get('/reports/revenue'),
        ]);
        setStats(statsRes.data.data);
        setActivities(activitiesRes.data.data || []);
        setDealStages(stagesRes.data.data || []);
        setLeadSources(sourcesRes.data.data || []);
        setRevenue(revenueRes.data.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = stats ? [
    { title: 'Total Leads', value: stats.totalLeads, icon: Zap, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20', trend: '+12%', up: true },
    { title: 'Active Customers', value: stats.activeCustomers, icon: UserCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', trend: '+8%', up: true },
    { title: 'Open Deals', value: stats.openDeals, icon: Handshake, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20', trend: '+5%', up: true },
    { title: 'Won Revenue', value: formatCurrency(stats.monthlyRevenue), icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20', trend: '+18%', up: true },
    { title: 'Won Deals', value: stats.wonDeals, icon: Target, color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', trend: '+15%', up: true },
    { title: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'text-cyan-600', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20', trend: '+2.3%', up: true },
    { title: 'Pending Tasks', value: stats.pendingTasks, icon: CheckSquare, color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20', trend: '-3%', up: false },
    { title: 'Overdue Tasks', value: stats.overdueTasks, icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20', trend: '-5%', up: false },
  ] : [];

  const pieData = dealStages.map((s: any) => ({ name: s._id, value: s.count }));

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back! Here&apos;s your business overview.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/leads">
              <Button size="sm" variant="outline"><Plus className="mr-1 h-4 w-4" /> New Lead</Button>
            </Link>
            <Link href="/deals">
              <Button size="sm"><Plus className="mr-1 h-4 w-4" /> New Deal</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse"><CardContent className="p-6"><div className="h-16 rounded bg-gray-200 dark:bg-gray-700" /></CardContent></Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, i) => (
              <Card key={i} className="group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                    </div>
                    <div className={`rounded-lg p-2.5 ${card.bgColor}`}>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    {card.up ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${card.up ? 'text-green-600' : 'text-red-600'}`}>{card.trend}</span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-indigo-500" /> Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenue.map((r: any) => ({ month: r._id, revenue: r.revenue }))}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Deal Stages Pie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Handshake className="h-5 w-5 text-purple-500" /> Deal Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1">
                {pieData.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead Sources + Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Lead Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-blue-500" /> Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadSources.map((s: any) => ({ name: s._id, count: s.count, won: s.won }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-green-500" /> Recent Activity</CardTitle>
              <Link href="/notifications" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">View all</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">No recent activities</p>
                ) : (
                  activities.slice(0, 6).map((act: any) => (
                    <div key={act._id} className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                        <Activity className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-gray-900 dark:text-gray-100">{act.description}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{act.type}</Badge>
                          <span className="text-xs text-gray-400">{timeAgo(act.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Link href="/leads">
                <Button variant="outline" className="w-full justify-start gap-2"><Zap className="h-4 w-4 text-blue-500" /> Add Lead</Button>
              </Link>
              <Link href="/customers">
                <Button variant="outline" className="w-full justify-start gap-2"><UserCheck className="h-4 w-4 text-green-500" /> Add Customer</Button>
              </Link>
              <Link href="/deals">
                <Button variant="outline" className="w-full justify-start gap-2"><Handshake className="h-4 w-4 text-purple-500" /> Add Deal</Button>
              </Link>
              <Link href="/tasks">
                <Button variant="outline" className="w-full justify-start gap-2"><CheckSquare className="h-4 w-4 text-orange-500" /> Add Task</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
