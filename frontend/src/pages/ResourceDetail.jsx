import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResource } from '../api';
import Button from '../components/UI/Button';

export default function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);

  useEffect(() => {
    let mounted = true;
    getResource(id)
      .then(res => {
        if (!mounted) return;
        const payload = res.resource || res;
        setResource(payload || null);
      })
      .catch(() => { if (mounted) setResource(null); });
    return () => { mounted = false };
  }, [id]);

  if (!resource) return <div className="text-sm text-slate-500">Loading...</div>;

  const fileHref = resource.fileUrl || resource.file_url || resource.fileUrl;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-semibold">{resource.title}</h2>
        <div className="text-sm text-slate-500">{resource.year}</div>
      </div>
      <div className="mt-3 text-sm text-slate-600">
        <div><strong>Department:</strong> {resource.department || '—'}</div>
        <div><strong>Subject:</strong> {resource.subject || '—'}</div>
        <div className="mt-3 prose-custom">{resource.description}</div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <a href={fileHref || '#'} target="_blank" rel="noreferrer"><Button variant="primary">Open File</Button></a>
        <Link to={`/comments/${id}`} className="text-sm text-slate-600 hover:underline">View Comments</Link>
      </div>
    </div>
  );
}
