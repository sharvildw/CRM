'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { getInitials } from '@/lib/utils';
import { User, Mail, Phone, Building, Save, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', department: user?.department || '', bio: user?.bio || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true); setMessage(''); setError('');
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.data);
      setMessage('Profile updated successfully');
    } catch (e: any) { setError(e.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError('Passwords do not match'); return; }
    setChangingPassword(true); setMessage(''); setError('');
    try {
      await api.put('/auth/change-password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setMessage('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e: any) { setError(e.response?.data?.message || 'Error'); }
    setChangingPassword(false);
  };

  return (
    <DashboardLayout>
      <div className="animate-slide-in mx-auto max-w-2xl space-y-6">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1><p className="text-sm text-gray-500">Manage your personal information</p></div>

        {message && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">{message}</div>}
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}

        {/* Avatar */}
        <Card><CardContent className="flex items-center gap-6 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white">
            {user ? getInitials(user.name) : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="mt-1 inline-flex rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{user?.role}</span>
          </div>
        </CardContent></Card>

        {/* Edit Profile */}
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-indigo-500" /> Personal Information</CardTitle></CardHeader><CardContent>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">Full Name</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Phone</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Department</label><Input value={form.department} onChange={e => setForm({...form, department: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Bio</label><Textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} /></div>
            <Button onClick={handleSave} disabled={saving}><Save className="mr-1 h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </CardContent></Card>

        {/* Change Password */}
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-red-500" /> Change Password</CardTitle></CardHeader><CardContent>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">Current Password</label><Input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">New Password</label><Input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} /></div>
            <div><label className="mb-1 block text-sm font-medium">Confirm New Password</label><Input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} /></div>
            <Button variant="destructive" onClick={handlePasswordChange} disabled={changingPassword}>
              {changingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
