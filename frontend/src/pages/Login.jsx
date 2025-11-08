import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  AcademicCapIcon,
  ArrowRightIcon,
  UserCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

export default function Login() {
  const { user, loading, error, login } = useAuth();
  const [fields, setFields] = useState({ id: '', password: '' });

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:block space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">CampusNet</h1>
                <p className="text-sm text-gray-600">Secure Campus Repository</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Access your campus digital ecosystem. Share resources, collaborate with peers, and stay connected within your campus community.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheckIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure Access</h3>
                <p className="text-sm text-gray-600">Campus-only Wi-Fi restricted access for your privacy</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-cyan-100">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AcademicCapIcon className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Academic Resources</h3>
                <p className="text-sm text-gray-600">Access notes, assignments, and study materials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl mb-3 shadow-lg">
                <AcademicCapIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">CampusNet</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Sign in to access your campus resources</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); login(fields); }} className="space-y-5">
              {/* Student ID Input */}
              <div>
                <label htmlFor="student-id" className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="student-id"
                    required
                    placeholder="Enter your student ID"
                    value={fields.id}
                    onChange={e => setFields(f => ({ ...f, id: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    required
                    placeholder="Enter your password"
                    type="password"
                    value={fields.password}
                    onChange={e => setFields(f => ({ ...f, password: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Register now
                </Link>
              </p>
            </div>

            {/* Back to Home */}
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

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700 font-medium">Secure Campus Connection</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
