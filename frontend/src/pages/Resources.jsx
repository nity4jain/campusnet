import React, { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import ResourceCard from '../components/Resource/ResourceCard'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PlusIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function Resources({ onSelect }) {
  const [resources, setResources] = useState([])
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [sortBy, setSortBy] = useState('votes') // 'votes', 'recent', 'title'
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    api.listResources().then(res => {
      if (mounted) {
        // Initialize votes if not present
        const resourcesWithVotes = (res.resources || []).map(r => ({
          ...r,
          votes: r.votes || 0,
          userVote: null // This would come from backend based on logged-in user
        }))
        setResources(resourcesWithVotes)
      }
    }).catch(err => setError(err.message || JSON.stringify(err)))
    return () => { mounted = false }
  }, [])

  // Handle voting
  const handleVote = (resourceId, voteType, newUserVote) => {
    // Update local state
    setResources(prev => prev.map(r => {
      if ((r._id || r.id) === resourceId) {
        return { ...r, userVote: newUserVote }
      }
      return r
    }))
    
    // TODO: Call API to save vote
    // api.voteResource(resourceId, voteType)
  }

  // Get unique subjects for filter
  const subjects = ['all', ...new Set(resources.map(r => r.subject).filter(Boolean))]

  // Filter resources based on search and subject
  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject
    
    return matchesSearch && matchesSubject
  })

  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'votes':
        return (b.votes || 0) - (a.votes || 0) // Highest votes first
      case 'recent':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="container pt-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-2 transition-colors group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 mb-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="w-7 h-7" />
                </div>
                <h1 className="text-4xl font-bold">Resources</h1>
              </div>
              <p className="text-indigo-100 text-lg">
                Discover and share academic resources with your campus community
              </p>
            </div>
            <Link 
              to="/upload"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              Upload Resource
            </Link>
          </div>
        </div>
      </div>

      <div className="container pb-12">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white appearance-none cursor-pointer"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <AcademicCapIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white appearance-none cursor-pointer"
              >
                <option value="votes">Most Recommended</option>
                <option value="recent">Most Recent</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing <span className="font-semibold text-indigo-600">{sortedResources.length}</span> {sortedResources.length === 1 ? 'resource' : 'resources'}
              {sortBy === 'votes' && <span className="ml-1 text-green-600">(sorted by recommendations)</span>}
            </span>
            {(searchQuery || selectedSubject !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSubject('all')
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Mobile Upload Button */}
        <Link 
          to="/upload"
          className="md:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          Upload
        </Link>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Resources Grid */}
        {sortedResources.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <AcademicCapIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedSubject !== 'all' ? 'No resources found' : 'No resources yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedSubject !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to share a resource with the community!'}
            </p>
            {!searchQuery && selectedSubject === 'all' && (
              <Link 
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="w-5 h-5" />
                Upload Your First Resource
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResources.map(resource => (
              <ResourceCard 
                key={resource._id || resource.id} 
                resource={resource}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
