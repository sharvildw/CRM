'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { formatDate, getPriorityColor } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      try {
        const res = await api.get(`/calendar/events?start=${start.toISOString()}&end=${end.toISOString()}`);
        setEvents(res.data.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchEvents();
  }, [currentDate]);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(e => {
      const ed = new Date(e.date);
      return ed.getDate() === day && ed.getMonth() === date.getMonth() && ed.getFullYear() === date.getFullYear();
    });
  };

  const typeColors: Record<string, string> = { task: 'bg-blue-500', meeting: 'bg-purple-500', 'follow-up': 'bg-orange-500' };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1><p className="text-sm text-gray-500">View tasks, meetings, and follow-ups</p></div>
          <div className="flex items-center gap-3">
            <Button size="icon" variant="outline" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
            <h2 className="min-w-[160px] text-center text-lg font-semibold text-gray-900 dark:text-white">{monthName}</h2>
            <Button size="icon" variant="outline" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-2">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-px">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="p-2 text-center text-xs font-semibold text-gray-500 uppercase">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 dark:bg-gray-700">
              {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 dark:bg-gray-900" />)}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

                return (
                  <div key={day} className={`min-h-[100px] bg-white p-1.5 dark:bg-gray-800 ${isToday ? 'ring-2 ring-inset ring-indigo-500' : ''}`}>
                    <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>{day}</div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map(e => (
                        <div key={e.id} className="flex items-center gap-1 rounded px-1 py-0.5 text-[10px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 truncate">
                          <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${typeColors[e.type] || 'bg-gray-400'}`} />
                          <span className="truncate">{e.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && <p className="text-[10px] text-gray-400 pl-1">+{dayEvents.length - 3} more</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalIcon className="h-5 w-5 text-indigo-500" /> Upcoming Events</CardTitle></CardHeader><CardContent>
          <div className="space-y-2">
            {events.filter(e => new Date(e.date) >= new Date()).slice(0, 10).map(e => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${typeColors[e.type] || 'bg-gray-400'}`} />
                  <div><p className="text-sm font-medium text-gray-900 dark:text-white">{e.title}</p><p className="text-xs text-gray-500">{formatDate(e.date)}</p></div>
                </div>
                <Badge variant="secondary">{e.type}</Badge>
              </div>
            ))}
            {events.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No events this month</p>}
          </div>
        </CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
