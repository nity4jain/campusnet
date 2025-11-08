import React from 'react';
import clsx from 'clsx';

export default function Button({ children, variant = 'primary', className = '', ...props }){
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition';
  const variants = {
    primary: 'bg-gradient-to-r from-brand to-accent text-white px-4 py-2 shadow-sm hover:opacity-95',
    outline: 'border px-3 py-1 text-slate-700 hover:bg-slate-50',
    ghost: 'px-2 py-1 text-slate-700 hover:bg-slate-100'
  }
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>{children}</button>
  )
}
