import React, { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../auth/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon,
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const registerSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  username: z.string().min(1, 'Username required'),
  password: z.string().min(6, 'Password must be 6+ characters'),
  student_id: z.string().min(1, 'Student ID required'),
  phone: z.string().min(6, 'Phone required'),
  is_hosteller: z.boolean().optional(),
  hostel: z.string().optional(),
  degree: z.string().optional(),
  branch: z.string().optional(),
  year: z.number().optional(),
  consent_for_contact: z.boolean().optional()
})

export default function Register({ onSuccess }) {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [phone, setPhone] = useState('')
  const [isHosteller, setIsHosteller] = useState(false)
  const [hostel, setHostel] = useState('')
  const [degree, setDegree] = useState('')
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState(1)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState(null)

  if (user) return <Navigate to="/dashboard" />

  async function submit(e) {
    e.preventDefault()
    setError(null)
    const parsed = registerSchema.safeParse({ full_name: fullName, email, username, password, student_id: studentId, phone, is_hosteller: isHosteller, hostel, degree, branch, year: parseInt(year), consent_for_contact: consent })
    if (!parsed.success) {
      setError(parsed.error.errors.map(x => x.message).join(', '))
      return
    }
    try {
      const res = await register({ email, username, password, full_name: fullName, student_id: studentId, phone, is_hosteller: isHosteller, hostel, degree, branch, year: parseInt(year), consent_for_contact: consent })
      if (res && res.token) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || JSON.stringify(err))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl mb-4 shadow-lg">
              <AcademicCapIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join CampusNet</h1>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    placeholder="John Doe" 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                  <input 
                    placeholder="21BCE1234" 
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      placeholder="1234567890" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Account Credentials</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    placeholder="john.doe@vitap.ac.in" 
                    type="email"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input 
                    placeholder="johndoe" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      placeholder="••••••" 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Academic Details</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isHosteller} 
                    onChange={e => setIsHosteller(e.target.checked)} 
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">I am a hosteller</span>
                  </div>
                </label>
              </div>

              {isHosteller && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
                  <input 
                    placeholder="e.g. H-4" 
                    value={hostel} 
                    onChange={e => setHostel(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                  <input 
                    placeholder="B.Tech" 
                    value={degree} 
                    onChange={e => setDegree(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                  <input 
                    placeholder="AI & ML" 
                    value={branch} 
                    onChange={e => setBranch(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={year} 
                    onChange={e => setYear(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={consent} 
                  onChange={e => setConsent(e.target.checked)} 
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
                />
                <span className="text-sm text-gray-700">I consent to share my contact details with my posts and resources</span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Create Account
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
            <ShieldCheckIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-700 font-medium">Your data is secure with us</span>
          </div>
        </div>
      </div>
    </div>
  )
}
