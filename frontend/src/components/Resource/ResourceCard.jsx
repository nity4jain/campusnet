import React from 'react';
import { Link } from 'react-router-dom';

export default function ResourceCard({ resource }){
  const id = resource._id || resource.id;
  const uploadedBy = resource.uploaded_by?.username || resource.uploaded_by?.full_name || 'unknown';

  return (
    <Link to={`/resource/${id}`} className="block hover:shadow-lg transition rounded-lg overflow-hidden">
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{resource.title}</h3>
          <div className="text-sm text-slate-500">{resource.year}</div>
        </div>
        <p className="text-sm text-slate-600 mt-2 line-clamp-3">{resource.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div>Subject: {resource.subject}</div>
          <div>By: {uploadedBy}</div>
        </div>
      </div>
    </Link>
  )
}
