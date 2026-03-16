"use client"

import { useEffect, useState } from "react"
import { api } from "../../lib/api"
import { FileText, Upload, Trash2, ExternalLink, File, Image as ImageIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface DocumentManagerProps {
  entityId: string
  entityType: "LEAD" | "DEAL" | "PROJECT"
}

export function DocumentManager({ entityId, entityType }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [entityId, entityType])

  async function loadDocuments() {
    try {
      const res = await api.get(`/documents?entityType=${entityType}&entityId=${entityId}`)
      setDocuments(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // In a real app, we'd upload to S3 and get a URL
      // For now, we simulate by sending the file name as the URL
      const payload = {
        name: file.name,
        url: `https://s3.amazonaws.com/propertyflow-bucket/${Date.now()}-${file.name}`,
        type: file.type.includes("image") ? "IMAGE" : "DOCUMENT",
        entityId,
        entityType
      }

      await api.post("/documents", payload)
      loadDocuments()
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this document?")) return
    try {
      await api.delete(`/documents/${id}`)
      setDocuments(documents.filter(d => d.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-sm text-slate-400 py-4">Loading documents...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Documents</h3>
        <label className="cursor-pointer">
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-100">
            <Upload className="w-3 h-3" />
            {uploading ? "Uploading..." : "Upload"}
          </div>
        </label>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
          <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No documents yet</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 bg-white rounded border border-slate-200 flex items-center justify-center shrink-0">
                  {doc.type === "IMAGE" ? <ImageIcon className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-orange-500" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase">{doc.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-slate-600 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => handleDelete(doc.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
