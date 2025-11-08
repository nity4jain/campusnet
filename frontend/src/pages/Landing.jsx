import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  UsersIcon,
  WifiIcon,
  ComputerDesktopIcon,
  CircleStackIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* WiFi Requirement Notice Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white py-3 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-sm md:text-base">
            <WifiIcon className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">
              ⚠️ Campus WiFi Required
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-orange-100">
              This application only works on hostel & campus WiFi networks
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <ShieldCheckIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Secure Campus-Only Access</span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            CampusNet
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-indigo-100 max-w-3xl mx-auto">
            A Secure Campus-Only Digital Repository & Networking Platform
          </p>
          <p className="text-lg md:text-xl italic text-indigo-200 mb-12">
            "Connecting Students Within Campus Boundaries"
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6" />
              <span>Wi-Fi Restricted</span>
            </div>
            <div className="flex items-center gap-2">
              <BoltIcon className="w-6 h-6" />
              <span>Modern Interface</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="w-6 h-6" />
              <span>Student-First Design</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/register"
              className="px-8 py-4 bg-cyan-400 hover:bg-cyan-500 text-indigo-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Register Now
            </Link>
            <Link 
              to="/login"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-indigo-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Wave decoration at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16 md:h-24" preserveAspectRatio="none">
            <path 
              fill="#f8fafc" 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* WiFi Requirement Information Box */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <WifiIcon className="w-9 h-9 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    Campus WiFi Access Only
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                      Required
                    </span>
                  </h3>
                  
                  <p className="text-gray-700 mb-4 text-lg">
                    CampusNet is <strong>exclusively accessible through campus and hostel WiFi networks</strong> for enhanced security and privacy. This ensures that all resources and communications remain within the campus community.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="text-sm font-semibold text-indigo-600 mb-1">🏠 Ladies Hostel - 1</div>
                      <div className="text-xs text-gray-600">hfw2.vitap.ac.in</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="text-sm font-semibold text-indigo-600 mb-1">🏛️ Men's Hostel - 2</div>
                      <div className="text-xs text-gray-600">hfw.vitap.ac.in</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="text-sm font-semibold text-indigo-600 mb-1">🏢 Central Block</div>
                      <div className="text-xs text-gray-600">172.18.10.10</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 text-sm text-amber-800">
                      <strong>Important:</strong> The application will not function if accessed from outside the campus WiFi network. You must be connected to your hostel or campus WiFi to use CampusNet.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capstone Project Attribution */}
      <div className="text-center py-4 text-gray-600 bg-gray-50">
        <p className="text-sm">A Capstone Project by VIT-AP University Students</p>
      </div>

      {/* Why CampusNet Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
            Why CampusNet?
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-3xl mx-auto">
            Same secure access, better experience. We've addressed every pain point students face with the current system.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Current DSpace */}
            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircleIcon className="w-8 h-8 text-red-500" />
                <h3 className="text-2xl font-bold text-gray-900">Current DSpace</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircleIcon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Unfriendly and outdated UI</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircleIcon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Rigid system with no improvements</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircleIcon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Poor navigation and search</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircleIcon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Limited collaboration tools</span>
                </li>
              </ul>
            </div>

            {/* CampusNet */}
            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircleIcon className="w-8 h-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">CampusNet</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Modern, intuitive interface</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Flexible and regularly updated</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Enhanced navigation tools</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Built-in collaboration features</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
            Powerful Features
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-3xl mx-auto">
            Everything you need for a seamless campus digital experience
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Exclusive Campus Access</h3>
              <p className="text-gray-600">
                Strictly accessible only via college & hostel Wi-Fi. Private, secure, and student-only - no outsiders can access the platform.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <ComputerDesktopIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Modern Interface</h3>
              <p className="text-gray-600">
                A clean, intuitive UI that students actually enjoy using. Say goodbye to confusing navigation and outdated designs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <CircleStackIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Centralized Repository</h3>
              <p className="text-gray-600">
                All your academic resources, notes, and announcements in one accessible place. Easy to find, easy to share.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <UsersIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Community-Driven</h3>
              <p className="text-gray-600">
                Enable collaboration, peer-to-peer sharing, and discussion. More than just a static file store.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Enhanced Collaboration</h3>
              <p className="text-gray-600">
                Built-in tools for student interaction, group projects, and academic discussions - all within the secure campus network.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <ArrowTrendingUpIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Future-Ready Platform</h3>
              <p className="text-gray-600">
                Architected with scalable and modular technologies. New features like chat, events, and study groups can be added easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Our Vision
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              A Campus-Exclusive Digital Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To design and develop a modern, student-friendly platform accessible only within the college & hostel Wi-Fi network, ensuring security, privacy, and exclusivity while making digital resources and interactions seamless.
            </p>
          </div>

          <div className="space-y-6">
            {/* Vision Point 1 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Enhance Usability</h3>
                  <p className="text-gray-600">
                    Replace the outdated DSpace-like interface with a modern, intuitive UI that students actually enjoy using.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Point 2 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Ensure Secure Access</h3>
                  <p className="text-gray-600">
                    Retain the campus-only Wi-Fi restriction, ensuring exclusivity, just like the current DSpace, but with a much better experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Point 3 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Centralized Knowledge Hub</h3>
                  <p className="text-gray-600">
                    Provide a repository of academic resources, notes, and announcements in one accessible place.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Point 4 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Community-Driven Features</h3>
                  <p className="text-gray-600">
                    Enable collaboration, peer-to-peer sharing, and discussion, making it more than just a static file store.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Point 5 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Future-Ready Platform</h3>
                  <p className="text-gray-600">
                    Architect it with scalable and modular technologies so new features can be added easily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience CampusNet?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
              Join us in revolutionizing the campus digital experience. A secure, modern, and student-friendly platform built by students, for students.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link 
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-400 hover:bg-cyan-500 text-indigo-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                to="/login"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-indigo-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Sign In
              </Link>
            </div>

            <div className="pt-8 border-t border-white/20">
              <p className="text-indigo-200 text-sm">
                Capstone Project by Nitya Jain & Vimedha Chaturvedi
              </p>
              <p className="text-indigo-200 text-sm">
                VIT-AP University
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
