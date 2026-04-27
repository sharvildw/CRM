'use client';

import { useAuth } from '@/lib/auth';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Search, Bell, Moon, Sun, ChevronDown, LogOut, User, Settings
} from 'lucide-react';
import Link from 'next/link';
import { getInitials, timeAgo } from '@/lib/utils';

export default function TopBar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [countRes, notifRes] = await Promise.all([
          api.get('/notifications/unread-count'),
          api.get('/notifications?limit=5'),
        ]);
        setUnreadCount(countRes.data.data.count);
        setNotifications(notifRes.data.data || []);
      } catch (e) { /* ignore */ }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads, customers, deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-700"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg p-2.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="relative rounded-lg p-2.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <Link href="/notifications" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                  onClick={() => setShowNotifications(false)}>
                  View all
                </Link>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-sm text-gray-500">No notifications</p>
                ) : (
                  notifications.map((notif: any) => (
                    <div key={notif._id} className={`border-b border-gray-100 p-3 last:border-0 dark:border-gray-700 ${!notif.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{notif.message}</p>
                      <p className="mt-1 text-xs text-gray-400">{timeAgo(notif.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
              {user ? getInitials(user.name) : 'U'}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-fade-in">
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => setShowProfileMenu(false)}>
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => setShowProfileMenu(false)}>
                <Settings className="h-4 w-4" /> Settings
              </Link>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
