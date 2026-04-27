'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = filter === 'unread' ? '?isRead=false&limit=50' : '?limit=50';
      const res = await api.get(`/notifications${params}`);
      setNotifications(res.data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, [filter]);

  const markAsRead = async (id: string) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    fetchNotifications();
  };

  const deleteNotif = async (id: string) => {
    await api.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  const typeIcons: Record<string, string> = {
    lead_assigned: '🎯', task_assigned: '📋', deal_update: '💰', follow_up: '📞',
    task_deadline: '⏰', general: '📢', reminder: '🔔',
  };

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1><p className="text-sm text-gray-500">Stay updated with your latest alerts</p></div>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
              <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-sm ${filter === 'all' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'text-gray-500'}`}>All</button>
              <button onClick={() => setFilter('unread')} className={`px-3 py-1.5 text-sm ${filter === 'unread' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'text-gray-500'}`}>Unread</button>
            </div>
            <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="mr-1 h-4 w-4" /> Mark all read</Button>
          </div>
        </div>

        <div className="space-y-2">
          {loading ? [...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />) :
          notifications.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center py-16">
              <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 text-gray-500">No notifications</p>
            </CardContent></Card>
          ) : notifications.map(n => (
            <Card key={n._id} className={`transition-all hover:shadow-md ${!n.isRead ? 'border-l-4 border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <span className="text-xl">{typeIcons[n.type] || '📢'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{n.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                </div>
                <div className="flex gap-1">
                  {!n.isRead && <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => markAsRead(n._id)} title="Mark as read"><Check className="h-4 w-4" /></Button>}
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => deleteNotif(n._id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
