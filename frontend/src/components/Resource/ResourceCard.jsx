import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  UserCircleIcon, 
  CalendarIcon,
  BookOpenIcon,
  ArrowRightIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  HandThumbDownIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';

export default function ResourceCard({ resource, onVote }){
  const id = resource._id || resource.id;
  const uploadedBy = resource.uploaded_by?.username || resource.uploaded_by?.full_name || 'Anonymous';
  const commentCount = resource.comment_count || 0;
  const votes = resource.votes || 0;
  const [userVote, setUserVote] = useState(resource.userVote || null); // 'up' or 'down' or null
  const [localVotes, setLocalVotes] = useState(votes);

  // Get subject color
  const getSubjectColor = (subject) => {
    const colors = {
      'AI': 'from-purple-500 to-pink-500',
      'ML': 'from-blue-500 to-cyan-500',
      'DSA': 'from-green-500 to-teal-500',
      'Web': 'from-orange-500 to-red-500',
      'Database': 'from-indigo-500 to-purple-500',
    }
    return colors[subject] || 'from-gray-500 to-gray-600'
  }

  const handleVote = (e, voteType) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    let newVotes = localVotes;
    let newUserVote = voteType;

    // If clicking the same vote, remove it
    if (userVote === voteType) {
      newUserVote = null;
      newVotes = voteType === 'up' ? localVotes - 1 : localVotes + 1;
    } else if (userVote) {
      // Switching from one vote to another
      newVotes = voteType === 'up' ? localVotes + 2 : localVotes - 2;
    } else {
      // New vote
      newVotes = voteType === 'up' ? localVotes + 1 : localVotes - 1;
    }

    setUserVote(newUserVote);
    setLocalVotes(newVotes);
    
    // Call parent callback if provided
    if (onVote) {
      onVote(id, voteType, newUserVote);
    }
  }

  return (
    <Link 
      to={`/resource/${id}`} 
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] transform"
    >
      {/* Header with gradient */}
      <div className={`h-2 bg-gradient-to-r ${getSubjectColor(resource.subject)}`}></div>
      
      <div className="p-6">
        {/* Subject Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
            <BookOpenIcon className="w-3.5 h-3.5" />
            {resource.subject || 'General'}
          </span>
          {resource.year && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              {resource.year}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {resource.description || 'No description available'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {uploadedBy[0]?.toUpperCase() || 'A'}
              </div>
              <span className="font-medium">{uploadedBy}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Voting */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
              <button
                onClick={(e) => handleVote(e, 'up')}
                className={`p-1 rounded transition-colors ${
                  userVote === 'up' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <HandThumbUpIcon className="w-4 h-4" />
              </button>
              <span className={`text-sm font-semibold min-w-[20px] text-center ${
                localVotes > 0 ? 'text-green-600' : localVotes < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {localVotes}
              </span>
              <button
                onClick={(e) => handleVote(e, 'down')}
                className={`p-1 rounded transition-colors ${
                  userVote === 'down' 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <HandThumbDownIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Comments */}
            {commentCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span>{commentCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="mt-4 flex items-center text-indigo-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View Details</span>
          <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
