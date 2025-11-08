import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import api from '../api';

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ uploads: 0, downloads: 0 });

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      if (!user) return;
      try {
        const res = await api.myUploads();
        const uploads = (res.resources || []).length;
        const downloads = (res.resources || []).reduce((acc, r) => acc + (r.downloads || 0), 0);
        if (mounted) setStats({ uploads, downloads });
      } catch (err) {
        // ignore errors for stats
      }
    }
    loadStats();
    return () => { mounted = false };
  }, [user]);

  if (!user) return null;

  const displayName = user.full_name || user.name || user.username || user.email;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand to-accent flex items-center justify-center text-white text-2xl">{(displayName || 'U')[0]}</div>
          <div>
            <h3 className="text-xl font-semibold">{displayName}</h3>
            <div className="text-sm text-slate-600">{user.role || 'Student'} • {user.department || `${user.degree || ''} ${user.branch || ''}`.trim()}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded">
            <div className="text-sm text-slate-500">Student ID</div>
            <div className="font-medium">{user.student_id || '—'}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded">
            <div className="text-sm text-slate-500">Phone</div>
            <div className="font-medium">{user.phone || '—'}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded">
            <div className="text-sm text-slate-500">Hostel</div>
            <div className="font-medium">{user.is_hosteller ? (user.hostel || '—') : 'Not a hosteller'}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded">
            <div className="text-sm text-slate-500">Consent to contact</div>
            <div className="font-medium">{user.consent_for_contact ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      <aside className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold mb-3">Activity Stats</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">Resources Uploaded</div>
            <div className="font-medium">{stats.uploads}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">Downloads</div>
            <div className="font-medium">{stats.downloads}</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
