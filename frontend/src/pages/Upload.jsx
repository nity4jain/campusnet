import React, { useRef, useState } from 'react';
import Button from '../components/UI/Button';

export default function Upload() {
  const fileInput = useRef();
  const [fields, setFields] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-6"><h2 className="text-xl font-semibold">Upload Resource</h2></div>
      <form className="bg-white p-6 rounded-lg shadow-sm space-y-4" onSubmit={e => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1300);
      }}>
        <input required placeholder="Title" className="w-full px-3 py-2 border rounded-md" onChange={e => setFields(f => ({...f, title: e.target.value}))} />
        <input required placeholder="Subject" className="w-full px-3 py-2 border rounded-md" onChange={e => setFields(f => ({...f, subject: e.target.value}))} />
        <select required className="w-full px-3 py-2 border rounded-md" defaultValue="" onChange={e => setFields(f => ({...f, department: e.target.value}))}>
          <option value="">Department</option>
          <option value="CSE">CSE</option>
          <option value="AI/ML">AI/ML</option>
        </select>
        <select required className="w-full px-3 py-2 border rounded-md" defaultValue="" onChange={e => setFields(f => ({...f, year: e.target.value}))}>
          <option value="">Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
        </select>
        <input type="file" className="w-full" ref={fileInput} onChange={e => setSelectedFile(e.target.files[0])} />
        <div className="flex items-center gap-3">
          <Button variant="primary">{loading ? 'Uploading…' : 'Upload'}</Button>
          {selectedFile && <div className="text-sm text-slate-600">Selected: {selectedFile.name}</div>}
        </div>
      </form>
    </section>
  );
}
