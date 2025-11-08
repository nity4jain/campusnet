import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getResource } from '../api';
import { 
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  CalendarIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  EyeIcon,
  HandThumbUpIcon,
  HandThumbDownIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';

const subjectColors = {
  'Mathematics': 'from-blue-500 to-cyan-500',
  'Physics': 'from-purple-500 to-pink-500',
  'Chemistry': 'from-green-500 to-emerald-500',
  'Computer Science': 'from-indigo-500 to-blue-500',
  'Engineering': 'from-orange-500 to-amber-500',
  'default': 'from-gray-500 to-slate-500'
};

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(null); // 'up' or 'down' or null

  useEffect(() => {
    let mounted = true;
    getResource(id)
      .then(res => {
        if (!mounted) return;
        const payload = res.resource || res;
        setResource(payload || null);
        setVotes(payload?.votes || 0);
        setUserVote(payload?.userVote || null);
        setLoading(false);
      })
      .catch(() => { 
        if (mounted) {
          setResource(null);
          setLoading(false);
        }
      });
    return () => { mounted = false };
  }, [id]);

  const handleVote = (voteType) => {
    let newVotes = votes;
    let newUserVote = voteType;

    // If clicking the same vote, remove it
    if (userVote === voteType) {
      newUserVote = null;
      newVotes = voteType === 'up' ? votes - 1 : votes + 1;
    } else if (userVote) {
      // Switching from one vote to another
      newVotes = voteType === 'up' ? votes + 2 : votes - 2;
    } else {
      // New vote
      newVotes = voteType === 'up' ? votes + 1 : votes - 1;
    }

    setUserVote(newUserVote);
    setVotes(newVotes);
    
    // TODO: Call API to save vote
    // api.voteResource(id, voteType)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4 mx-auto"></div>
          <div className="text-gray-600">Loading resource...</div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resource not found</h2>
          <p className="text-gray-600 mb-6">The resource you're looking for doesn't exist.</p>
          <Link 
            to="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const fileHref = resource.fileUrl || resource.file_url || resource.fileUrl;
  const subjectColor = subjectColors[resource.subject] || subjectColors.default;
  const uploaderName = resource.uploaded_by?.full_name || resource.uploaded_by?.username || resource.uploader || 'Anonymous';
  const uploaderInitial = uploaderName[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Subject Color Stripe */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Color Stripe */}
          <div className={`h-3 bg-gradient-to-r ${subjectColor}`}></div>

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">
                  {resource.title}
                </h1>
                <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  <CalendarIcon className="w-4 h-4" />
                  Year {resource.year}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${subjectColor} text-white rounded-lg shadow-md`}>
                  <BookOpenIcon className="w-5 h-5" />
                  <span className="font-medium">{resource.subject || 'General'}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                  <BuildingLibraryIcon className="w-5 h-5" />
                  <span className="font-medium">{resource.department || '—'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {resource.description && (
              <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">{resource.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <EyeIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Views</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{resource.views || 0}</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownTrayIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Downloads</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{resource.downloads || 0}</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <ChatBubbleLeftIcon className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Comments</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{resource.comment_count || 0}</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
                <div className="flex items-center gap-2 mb-2">
                  <HandThumbUpIcon className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-600">Votes</span>
                </div>
                <div className={`text-2xl font-bold ${votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {votes > 0 ? '+' : ''}{votes}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <AcademicCapIcon className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Year</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{resource.year || '—'}</div>
              </div>
            </div>

            {/* Uploader Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {uploaderInitial}
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Uploaded by</div>
                  <div className="font-semibold text-gray-900 text-lg">{uploaderName}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Voting Section */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                <button
                  onClick={() => handleVote('up')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    userVote === 'up' 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                  }`}
                >
                  <HandThumbUpIcon className="w-5 h-5" />
                  Upvote
                </button>
                <span className={`text-xl font-bold px-3 ${
                  votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {votes > 0 ? '+' : ''}{votes}
                </span>
                <button
                  onClick={() => handleVote('down')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    userVote === 'down' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                  }`}
                >
                  <HandThumbDownIcon className="w-5 h-5" />
                  Downvote
                </button>
              </div>

              <a 
                href={fileHref || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Download Resource
              </a>
              <Link 
                to={`/comments/${id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all duration-200 shadow-md"
              >
                <ChatBubbleLeftIcon className="w-5 h-5" />
                View Comments ({resource.comment_count || 0})
              </Link>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Having issues?</h3>
              <p className="text-sm text-gray-600">
                If you encounter any problems with this resource, please report it to help maintain quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
