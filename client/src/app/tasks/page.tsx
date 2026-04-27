'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { formatDate, getStatusColor, getPriorityColor, getInitials } from '@/lib/utils';
import { Plus, Search, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const statusOpts = [{ value: '', label: 'All' }, { value: 'Pending', label: 'Pending' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Completed', label: 'Completed' }];
const priorityOpts = [{ value: '', label: 'All' }, { value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Urgent', label: 'Urgent' }];

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'Pending' });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (priority) params.set('priority', priority);
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [page, status, priority]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchTasks(); }, 300); return () => clearTimeout(t); }, [search]);
  useEffect(() => { api.get('/users/list').then(r => setUsers(r.data.data || [])).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/tasks', form); setShowForm(false); fetchTasks(); }
    catch (e: any) { alert(e.response?.data?.message || 'Error'); }
  };

  const completeTask = async (id: string) => {
    await api.put(`/tasks/${id}/complete`);
    fetchTasks();
  };

  const isOverdue = (task: any) => task.status !== 'Completed' && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1><p className="text-sm text-gray-500">Manage team tasks and activities</p></div>
          <Button onClick={() => { setForm({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'Pending' }); setShowForm(true); }}><Plus className="mr-1 h-4 w-4" /> Add Task</Button>
        </div>

        <Card><CardContent className="p-4"><div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
          <Select options={statusOpts} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="w-36" />
          <Select options={priorityOpts} value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }} className="w-36" />
        </div></CardContent></Card>

        <div className="space-y-2">
          {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />) :
          tasks.length === 0 ? <Card><CardContent className="py-12 text-center text-gray-500">No tasks found</CardContent></Card> :
          tasks.map(task => (
            <Card key={task._id} className={`transition-all hover:shadow-md ${isOverdue(task) ? 'border-red-200 dark:border-red-800' : ''} ${task.status === 'Completed' ? 'opacity-60' : ''}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <button onClick={() => task.status !== 'Completed' && completeTask(task._id)}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${task.status === 'Completed' ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 hover:border-green-400 dark:border-gray-600'}`}>
                  {task.status === 'Completed' && <Check className="h-3 w-3" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-gray-900 dark:text-white ${task.status === 'Completed' ? 'line-through' : ''}`}>{task.title}</p>
                  {task.description && <p className="mt-0.5 text-xs text-gray-500 truncate">{task.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</span>
                  {task.dueDate && <span className={`text-xs ${isOverdue(task) ? 'font-semibold text-red-600' : 'text-gray-500'}`}>{formatDate(task.dueDate)}</span>}
                  {task.assignedTo && <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300" title={task.assignedTo.name}>{getInitials(task.assignedTo.name)}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pagination.pages > 1 && <div className="flex items-center justify-between"><p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p><div className="flex gap-1"><Button size="sm" variant="outline" disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button><Button size="sm" variant="outline" disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button></div></div>}

        <Dialog open={showForm} onOpenChange={setShowForm}><DialogContent><DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">Title *</label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
            <div><label className="mb-1 block text-sm font-medium">Description</label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="mb-1 block text-sm font-medium">Assigned To</label><Select options={[{value:'',label:'Unassigned'}, ...users.map(u=>({value:u._id,label:u.name}))]} value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} /></div>
              <div><label className="mb-1 block text-sm font-medium">Due Date</label><Input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
              <div><label className="mb-1 block text-sm font-medium">Priority</label><Select options={priorityOpts.slice(1)} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} /></div>
              <div><label className="mb-1 block text-sm font-medium">Status</label><Select options={statusOpts.slice(1)} value={form.status} onChange={e => setForm({...form, status: e.target.value})} /></div>
            </div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit">Create Task</Button></div>
          </form>
        </DialogContent></Dialog>
      </div>
    </DashboardLayout>
  );
}
