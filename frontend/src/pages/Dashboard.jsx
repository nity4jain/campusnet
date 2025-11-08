import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { key: 'sharing', title: 'Sharing Auto', emoji: '🔁' },
  { key: 'papers', title: 'Recent/Previous Papers', emoji: '📄' },
  { key: 'borrow', title: 'Borrow / Lend', emoji: '🤝' },
  { key: 'laundry', title: 'Lost / Mixed Laundry', emoji: '🧺' },
  { key: 'faculty', title: 'Faculty Cabin Details', emoji: '🏫' },
  { key: 'ffcs', title: 'FFCS', emoji: '📝' },
  { key: 'hostel', title: 'Hostel Issues', emoji: '🏨' },
  { key: 'alumni', title: 'Alumni Help', emoji: '🎓' },
  { key: 'others', title: 'Others', emoji: '🔧' }
];

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <Link key={c.key} to={`/chat/${c.key}`} className="block bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <div className="text-xl">{c.emoji} {c.title}</div>
            <div className="text-sm text-slate-500 mt-2">Open chat for {c.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
