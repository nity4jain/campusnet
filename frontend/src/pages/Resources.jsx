import React, { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import ResourceCard from '../components/Resource/ResourceCard'

export default function Resources({ onSelect }) {
  const [resources, setResources] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    api.listResources().then(res => {
      if (mounted) setResources(res.resources || [])
    }).catch(err => setError(err.message || JSON.stringify(err)))
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Resources</h2>
      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      {resources.length === 0 ? (
        <div className="text-sm text-slate-600">No resources found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(res => {
            const id = res.id || res._id
            return (
              <ResourceCard key={id} resource={res} />
            )
          })}
        </div>
      )}
    </div>
  )
}
