import React from 'react';

export default function Footer(){
  return (
    <footer className="mt-12 border-t bg-white/80">
      <div className="container py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} CampusNet
      </div>
    </footer>
  )
}
