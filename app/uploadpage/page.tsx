"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button';

export default function Uploadpage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleUpload() {
    setSuccess(null)
    setLoading(true)
    try {
      // Simulate upload delay
      await new Promise((r) => setTimeout(r, 1200))
      setSuccess('File uploaded successfully')
    } catch (e) {
      setSuccess('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>User upload</h1>
      <p>Welcome to your uploadpage!</p>
      <div>
        <Button variant="default" onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading…' : 'Upload File'}
        </Button>
      </div>

      {success && (
        <p className="mt-3 text-sm text-muted-foreground">{success}</p>
      )}
    </div>
  )
}
