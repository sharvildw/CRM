'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard, Users, UserCheck, Handshake, CheckSquare,
  Calendar, BarChart3, Bell, Settings, ChevronLeft, ChevronRight,
  MessageSquare, Zap
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
  { name: 'Leads', href: '/leads', icon: Zap, roles: ['Admin', 'Manager', 'Sales Executive'] },
  { name: 'Customers', href: '/customers', icon: UserCheck, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
  { name: 'Deals', href: '/deals', icon: Handshake, roles: ['Admin', 'Manager', 'Sales Executive'] },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
  { name: 'Calendar', href: '/calendar', icon: Calendar, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
  { name: 'Communications', href: '/communications', icon: MessageSquare, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['Admin', 'Manager'] },
  { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['Admin', 'Manager', 'Sales Executive', 'Support Agent'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['Admin'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNav = navigation.filter(item =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-900",
      collapsed ? "w-[68px]" : "w-[250px]"
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Nexus CRM</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
            <span className="text-sm font-bold text-white">N</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-indigo-600 dark:text-indigo-400")} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
