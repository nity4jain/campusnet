import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import ResourceCard from '../components/Resource/ResourceCard';
import { 
  CloudArrowUpIcon,
  PlusIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function MyUploads() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.myUploads();
        if (mounted) setUploads(res.resources || []);
      } catch (err) {
        console.error(err);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Uploads</h1>
              <p className="text-gray-600">Manage your shared resources</p>
            </div>
            <Link 
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              Upload New
            </Link>
          </div>

          {/* Stats Bar */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{uploads.length}</div>
                    <div className="text-sm text-gray-600">Total Resources</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CloudArrowUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {uploads.reduce((acc, r) => acc + (r.downloads || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Downloads</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center">
                    <FolderOpenIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {new Set(uploads.map(r => r.subject)).size}
                    </div>
                    <div className="text-sm text-gray-600">Subjects Covered</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <div className="text-gray-600">Loading your resources...</div>
          </div>
        ) : uploads.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
              <CloudArrowUpIcon className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No uploads yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't shared any resources yet. Start contributing to help your fellow students!
            </p>
            <Link 
              to="/upload"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              Upload Your First Resource
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploads.map(r => (
              <ResourceCard key={r._id || r.id} resource={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
