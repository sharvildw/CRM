'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { Building, Mail, Phone, Globe, MapPin, Save, Users, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, uRes] = await Promise.all([api.get('/settings'), api.get('/users?limit=50')]);
        setSettings(sRes.data.data || {});
        setUsers(uRes.data.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await api.put('/settings', settings); alert('Settings saved!'); }
    catch (e: any) { alert(e.response?.data?.message || 'Error saving'); }
    setSaving(false);
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'theme', label: 'Theme', icon: Palette },
  ];

  return (
    <DashboardLayout>
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1><p className="text-sm text-gray-500">Manage your CRM configuration</p></div>
          <Button onClick={handleSave} disabled={saving}><Save className="mr-1 h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}</Button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <div className="w-48 shrink-0 space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'company' && (
              <Card><CardHeader><CardTitle>Company Profile</CardTitle></CardHeader><CardContent>
                {loading ? <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />)}</div> :
                <div className="space-y-4">
                  <div><label className="mb-1 block text-sm font-medium">Company Name</label><Input value={settings.companyName || ''} onChange={e => setSettings({...settings, companyName: e.target.value})} /></div>
                  <div><label className="mb-1 block text-sm font-medium">Email</label><Input value={settings.companyEmail || ''} onChange={e => setSettings({...settings, companyEmail: e.target.value})} /></div>
                  <div><label className="mb-1 block text-sm font-medium">Phone</label><Input value={settings.companyPhone || ''} onChange={e => setSettings({...settings, companyPhone: e.target.value})} /></div>
                  <div><label className="mb-1 block text-sm font-medium">Website</label><Input value={settings.companyWebsite || ''} onChange={e => setSettings({...settings, companyWebsite: e.target.value})} /></div>
                  <div><label className="mb-1 block text-sm font-medium">Address</label><Input value={settings.companyAddress || ''} onChange={e => setSettings({...settings, companyAddress: e.target.value})} /></div>
                  <div><label className="mb-1 block text-sm font-medium">Currency</label><Input value={settings.currency || 'USD'} onChange={e => setSettings({...settings, currency: e.target.value})} /></div>
                </div>}
              </CardContent></Card>
            )}

            {activeTab === 'users' && (
              <Card><CardHeader><CardTitle>User Management</CardTitle></CardHeader><CardContent>
                <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                </tr></thead><tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{u.role}</span></td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody></table></div>
              </CardContent></Card>
            )}

            {activeTab === 'roles' && (
              <Card><CardHeader><CardTitle>Role Permissions</CardTitle></CardHeader><CardContent>
                <div className="space-y-4">
                  {['Admin', 'Manager', 'Sales Executive', 'Support Agent'].map(role => (
                    <div key={role} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{role}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {role === 'Admin' && 'Full access to all modules, settings, and user management'}
                        {role === 'Manager' && 'Access to all data, reports, and team management'}
                        {role === 'Sales Executive' && 'Access to assigned leads, deals, tasks, and customer data'}
                        {role === 'Support Agent' && 'Access to assigned customers, tasks, and communication logs'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            )}

            {activeTab === 'theme' && (
              <Card><CardHeader><CardTitle>Theme Settings</CardTitle></CardHeader><CardContent>
                <p className="text-sm text-gray-500 mb-4">Theme can be toggled using the sun/moon icon in the top navigation bar.</p>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'system'].map(t => (
                    <button key={t} onClick={() => setSettings({...settings, theme: t})}
                      className={`rounded-lg border-2 p-4 text-center capitalize transition-all ${settings.theme === t ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </CardContent></Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
