import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChatBubbleLeftIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  HeartIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function Comments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([
    { id: 1, user: 'Someone', text: 'Great resource!', timestamp: new Date(Date.now() - 3600000), likes: 5, liked: false },
    { id: 2, user: 'Another', text: 'Helped a lot, thanks.', timestamp: new Date(Date.now() - 7200000), likes: 3, liked: false }
  ]);
  const [input, setInput] = useState('');

  const handleLike = (id) => {
    setComments(comments.map(c => 
      c.id === id 
        ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
        : c
    ));
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ChatBubbleLeftIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Comments</h3>
              <p className="text-gray-600">{comments.length} comment{comments.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
              <div className="text-5xl mb-4">💬</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">No comments yet</h4>
              <p className="text-gray-600">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((c) => (
              <div 
                key={c.id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 border border-gray-100 group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                    {c.user[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* User Info */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{c.user}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ClockIcon className="w-3 h-3" />
                          {formatTimeAgo(c.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Comment Text */}
                    <p className="text-gray-700 leading-relaxed mb-3">{c.text}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(c.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                          c.liked 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {c.liked ? (
                          <HeartSolidIcon className="w-5 h-5" />
                        ) : (
                          <HeartIcon className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">{c.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserCircleIcon className="w-5 h-5 text-indigo-600" />
            Add a comment
          </h4>
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
              Y
            </div>
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <textarea
                value={input} 
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                onChange={e => setInput(e.target.value)} 
                placeholder="Write a comment..." 
                rows={3}
              />
              <button
                onClick={() => {
                  if (input.trim()) {
                    setComments(vals => [...vals, { 
                      id: Date.now(), 
                      user: 'You', 
                      text: input, 
                      timestamp: new Date(),
                      likes: 0,
                      liked: false 
                    }]);
                    setInput('');
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg self-start"
              >
                <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}