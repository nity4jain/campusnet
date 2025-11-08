import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  HandRaisedIcon,
  ShoppingBagIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  HomeModernIcon,
  UserGroupIcon,
  EllipsisHorizontalCircleIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../auth/AuthContext';

const categories = [
  { 
    key: 'sharing', 
    title: 'Sharing Auto', 
    emoji: '🔁',
    icon: ChatBubbleLeftRightIcon,
    color: 'from-blue-500 to-cyan-500',
    description: 'Share rides and save money'
  },
  { 
    key: 'papers', 
    title: 'Previous Papers/Notes', 
    emoji: '📄',
    icon: DocumentTextIcon,
    color: 'from-purple-500 to-pink-500',
    description: 'Access exam papers, notes & solutions'
  },
  { 
    key: 'borrow', 
    title: 'Borrow / Lend', 
    emoji: '🤝',
    icon: HandRaisedIcon,
    color: 'from-green-500 to-emerald-500',
    description: 'Lend or borrow items'
  },
  { 
    key: 'laundry', 
    title: 'Lost Laundry', 
    emoji: '🧺',
    icon: ShoppingBagIcon,
    color: 'from-orange-500 to-amber-500',
    description: 'Find your mixed laundry'
  },
  { 
    key: 'faculty', 
    title: 'Faculty Cabins', 
    emoji: '🏫',
    icon: AcademicCapIcon,
    color: 'from-indigo-500 to-blue-500',
    description: 'Locate faculty cabin details'
  },
  { 
    key: 'ffcs', 
    title: 'FFCS', 
    emoji: '📝',
    icon: CalendarDaysIcon,
    color: 'from-rose-500 to-pink-500',
    description: 'Course registration help'
  },
  { 
    key: 'hostel', 
    title: 'Hostel Issues', 
    emoji: '🏨',
    icon: HomeModernIcon,
    color: 'from-teal-500 to-cyan-500',
    description: 'Report & discuss hostel issues'
  },
  { 
    key: 'alumni', 
    title: 'Alumni Help', 
    emoji: '🎓',
    icon: UserGroupIcon,
    color: 'from-violet-500 to-purple-500',
    description: 'Connect with alumni'
  },
  { 
    key: 'others', 
    title: 'Others', 
    emoji: '🔧',
    icon: EllipsisHorizontalCircleIcon,
    color: 'from-gray-500 to-slate-500',
    description: 'General discussions'
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.full_name || user?.name || user?.username || 'Student';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <SparklesIcon className="w-8 h-8" />
                <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {firstName}!</h1>
              </div>
              <p className="text-indigo-100 text-lg">
                Explore campus communities and stay connected with your peers
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-sm text-gray-600">Communities</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="text-2xl font-bold text-indigo-600">Active</div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">Live</div>
            <div className="text-sm text-gray-600">Discussions</div>
          </div>
        </div>

        {/* Categories Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campus Communities</h2>
          <p className="text-gray-600">Join conversations that matter to you</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(c => {
            const IconComponent = c.icon;
            return (
              <Link 
                key={c.key} 
                to={`/chat/${c.key}`} 
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1"
              >
                {/* Color Stripe */}
                <div className={`h-2 bg-gradient-to-r ${c.color}`}></div>
                
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${c.color} rounded-xl shadow-lg`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl">{c.emoji}</div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {c.description}
                  </p>

                  {/* Action */}
                  <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:gap-2 gap-1 transition-all">
                    <span>Open Chat</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-700">
                Can't find what you're looking for? Join the "Others" community or reach out to campus support.
              </p>
            </div>
            <Link 
              to="/chat/others"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Discussion
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
