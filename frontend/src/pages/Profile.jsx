import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api';
import { 
  UserCircleIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  XCircleIcon,
  IdentificationIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const navigate = useNavigate();
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
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
              {initials}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{displayName}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-indigo-100">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <AcademicCapIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.role || 'Student'}</span>
                </div>
                {(user.department || user.degree || user.branch) && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <BuildingOffice2Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {user.department || `${user.degree || ''} ${user.branch || ''}`.trim()}
                    </span>
                  </div>
                )}
                {user.year && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium">Year {user.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <UserCircleIcon className="w-6 h-6 text-indigo-600" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <EnvelopeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-600">Email</div>
                  </div>
                  <div className="font-semibold text-gray-900 ml-13">{user.email || '—'}</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-600">Phone</div>
                  </div>
                  <div className="font-semibold text-gray-900 ml-13">{user.phone || '—'}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <IdentificationIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-600">Student ID</div>
                  </div>
                  <div className="font-semibold text-gray-900 ml-13">{user.student_id || '—'}</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <HomeModernIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-600">Hostel</div>
                  </div>
                  <div className="font-semibold text-gray-900 ml-13">
                    {user.is_hosteller ? (user.hostel || 'Yes') : 'Not a hosteller'}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <CheckBadgeIcon className="w-6 h-6 text-indigo-600" />
                Privacy Settings
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  {user.consent_for_contact ? (
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircleIcon className="w-6 h-6 text-red-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">Contact Consent</div>
                    <div className="text-sm text-gray-600">
                      {user.consent_for_contact 
                        ? 'You allow others to contact you via your posts' 
                        : 'Contact information is private'}
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  user.consent_for_contact 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {user.consent_for_contact ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Activity Stats */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                Activity Stats
              </h4>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <CloudArrowUpIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-600">Uploads</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.uploads}</div>
                  <div className="text-sm text-gray-600 mt-1">Resources shared</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <ArrowDownTrayIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-600">Downloads</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stats.downloads}</div>
                  <div className="text-sm text-gray-600 mt-1">Total downloads</div>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <div className="text-center">
                <div className="text-5xl mb-3">🏆</div>
                <div className="font-bold text-gray-900 mb-1">
                  {stats.uploads >= 10 ? 'Super Contributor' : 
                   stats.uploads >= 5 ? 'Active Contributor' : 
                   stats.uploads >= 1 ? 'Contributor' : 'New Member'}
                </div>
                <div className="text-sm text-gray-600">
                  {stats.uploads >= 10 ? 'You\'re making a huge impact!' : 
                   stats.uploads >= 5 ? 'Keep up the great work!' : 
                   stats.uploads >= 1 ? 'Great start!' : 'Upload your first resource!'}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
