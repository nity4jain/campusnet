import React, { useEffect, useState } from 'react';
import api from '../api';
import ResourceCard from '../components/Resource/ResourceCard';

export default function MyUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.myUploads();
        if (mounted) setUploads(res.resources || []);
      } catch (err) {
        console.error(err);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">My Uploads</h2>
      {loading ? <div className="text-sm text-slate-500">Loading…</div> : (
        uploads.length === 0 ? <div className="text-sm text-slate-600">You don't have any uploads yet.</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uploads.map(r => <ResourceCard key={r._id || r.id} resource={r} />)}
          </div>
        )
      )}
    </section>
  );
}
