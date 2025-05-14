// src/components/Current.tsx
import React, { useState, useEffect } from 'react'
import { api } from '../api/axios'

export default function Current() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get('/auth/profile')
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Unknown error')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading profile…</p>
  if (error)     return <p style={{ color: 'red' }}>Error: {(error as Error).message}</p>
  if (!data)     return <p style={{ color: 'yellow' }}>Error: no data</p>

  return (
    <pre
      style={{
        padding: 16,
        background: '#f4f4f4',
        borderRadius: 4,
        overflowX: 'auto',
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}