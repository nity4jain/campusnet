import React, { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../auth/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';

const registerSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  username: z.string().min(1, 'Username required'),
  password: z.string().min(6, 'Password must be 6+ characters'),
  student_id: z.string().min(1, 'Student ID required'),
  phone: z.string().min(6, 'Phone required'),
  is_hosteller: z.boolean().optional(),
  hostel: z.string().optional(),
  degree: z.string().optional(),
  branch: z.string().optional(),
  year: z.number().optional(),
  consent_for_contact: z.boolean().optional()
})

export default function Register({ onSuccess }) {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [phone, setPhone] = useState('')
  const [isHosteller, setIsHosteller] = useState(false)
  const [hostel, setHostel] = useState('')
  const [degree, setDegree] = useState('')
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState(1)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState(null)

  if (user) return <Navigate to="/dashboard" />

  async function submit(e) {
    e.preventDefault()
    setError(null)
    const parsed = registerSchema.safeParse({ full_name: fullName, email, username, password, student_id: studentId, phone, is_hosteller: isHosteller, hostel, degree, branch, year: parseInt(year), consent_for_contact: consent })
    if (!parsed.success) {
      setError(parsed.error.errors.map(x => x.message).join(', '))
      return
    }
    try {
      const res = await register({ email, username, password, full_name: fullName, student_id: studentId, phone, is_hosteller: isHosteller, hostel, degree, branch, year: parseInt(year), consent_for_contact: consent })
      if (res && res.token) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || JSON.stringify(err))
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Create your account</h2>
        <form onSubmit={submit} className="space-y-3">
          <input placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={isHosteller} onChange={e => setIsHosteller(e.target.checked)} className="w-4 h-4" /> I am a hosteller</label>
          </div>
          {isHosteller && <input placeholder="Hostel (e.g. H-4)" value={hostel} onChange={e => setHostel(e.target.value)} className="w-full px-3 py-2 border rounded-md" />}
          <input placeholder="Degree (e.g. B.Tech)" value={degree} onChange={e => setDegree(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <input placeholder="Branch (e.g. AI)" value={branch} onChange={e => setBranch(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <input placeholder="Year (1/2/3/4)" type="number" value={year} onChange={e => setYear(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="w-4 h-4" /> Allow sharing my contact details with posts</label>

          <div>
            <Button variant="primary" className="w-full" type="submit">Register</Button>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="text-sm text-slate-600">Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link></div>
        </form>
      </div>
    </div>
  )
}
