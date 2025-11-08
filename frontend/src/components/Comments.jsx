import React, { useState } from 'react';
import Button from './UI/Button';

export default function Comments() {
  const [comments, setComments] = useState([
    { user: 'Someone', text: 'Great resource!' },
    { user: 'Another', text: 'Helped a lot, thanks.' }
  ]);
  const [input, setInput] = useState('');

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>
      <ul className="space-y-3 mb-4">
        {comments.map((c, i) => (
          <li key={i} className="text-sm"><span className="font-semibold">{c.user}:</span> <span className="ml-2">{c.text}</span></li>
        ))}
      </ul>
      <div className="flex gap-3">
        <input value={input} className="flex-1 px-3 py-2 border rounded-md" onChange={e => setInput(e.target.value)} placeholder="Write a comment..." />
        <Button variant="primary" onClick={() => {
          if (input.trim()) {
            setComments(vals => [...vals, { user: 'You', text: input }]);
            setInput('');
          }
        }}>Add</Button>
      </div>
    </div>
  );
}