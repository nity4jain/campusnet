import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function Upload() {
  const navigate = useNavigate();
  const fileInput = useRef();
  const [fields, setFields] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
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
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <CloudArrowUpIcon className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Upload Resource</h1>
          <p className="text-gray-600 text-lg">Share your knowledge with the campus community</p>
        </div>

        <form 
          onSubmit={e => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => setLoading(false), 1300);
          }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* Resource Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
              Resource Details
            </h2>
            
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  placeholder="e.g., Machine Learning Lecture Notes" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  onChange={e => setFields(f => ({...f, title: e.target.value}))} 
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    required 
                    placeholder="e.g., Artificial Intelligence" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    onChange={e => setFields(f => ({...f, subject: e.target.value}))} 
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  placeholder="Provide a brief description of the resource..." 
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                  onChange={e => setFields(f => ({...f, description: e.target.value}))}
                />
              </div>

              {/* Department and Year - Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select 
                      required 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white appearance-none cursor-pointer"
                      defaultValue="" 
                      onChange={e => setFields(f => ({...f, department: e.target.value}))}
                    >
                      <option value="" disabled>Select Department</option>
                      <option value="CSE">Computer Science & Engineering</option>
                      <option value="AI/ML">AI & Machine Learning</option>
                      <option value="ECE">Electronics & Communication</option>
                      <option value="EEE">Electrical & Electronics</option>
                      <option value="MECH">Mechanical Engineering</option>
                      <option value="CIVIL">Civil Engineering</option>
                    </select>
                  </div>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select 
                      required 
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white appearance-none cursor-pointer"
                      defaultValue="" 
                      onChange={e => setFields(f => ({...f, year: e.target.value}))}
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowUpTrayIcon className="w-5 h-5 text-indigo-600" />
              Upload File
            </h2>

            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                ref={fileInput} 
                onChange={handleFileChange}
              />
              
              {!selectedFile ? (
                <div className="pointer-events-none">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                    <CloudArrowUpIcon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Drop your file here, or <span className="text-indigo-600">browse</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: PDF, DOC, DOCX, PPT, PPTX, TXT (Max 50MB)
                  </p>
                </div>
              ) : (
                <div className="pointer-events-none">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500 mb-4">{formatFileSize(selectedFile.size)}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium z-20"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Remove File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="w-5 h-5" />
                  Upload Resource
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Upload Guidelines
          </h3>
          <ul className="text-sm text-indigo-800 space-y-1.5 ml-7">
            <li>• Ensure the resource is appropriate and useful for fellow students</li>
            <li>• Provide clear and accurate titles and descriptions</li>
            <li>• Only upload content you have the right to share</li>
            <li>• Check for duplicate resources before uploading</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
