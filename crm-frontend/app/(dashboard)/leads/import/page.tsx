"use client"

import { useState } from "react"
import { api } from "../../../../lib/api"
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "../../../../components/ui/button"

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleImport(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // In a real app, this would be a multipart/form-data request
      // For this implementation, we simulate the backend processing
      const res = await api.post("/bulk-import/leads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setResult(res.data)
      setFile(null)
    } catch (err: any) {
      setError(err.response?.data?.message || "Import failed. Please check the file format.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/leads" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Bulk Lead Import</h1>
          <p className="text-sm text-slate-500">Upload CSV files to import leads in bulk</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleImport} className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">1. Prepare your CSV</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ensure your CSV has the following headers: <br />
              <code className="bg-slate-100 px-1 rounded text-indigo-600 font-mono">fullName, phone, email, budgetMin, budgetMax, propertyType, source</code>
            </p>
            <Button variant="outline" size="sm" className="mt-2 text-[11px] h-7">
              <FileText className="w-3 h-3 mr-1" /> Download Template
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">2. Upload & Import</h3>
            <label 
              className={`
                flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all
                ${file ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:bg-slate-50'}
              `}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className={`w-8 h-8 mb-2 ${file ? 'text-indigo-600' : 'text-slate-300'}`} />
                {file ? (
                  <p className="text-sm font-medium text-indigo-600">{file.name}</p>
                ) : (
                  <>
                    <p className="mb-1 text-sm text-slate-500 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400">CSV files only (Max 5MB)</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
              />
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={!file || loading} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 h-11 text-sm font-bold shadow-lg shadow-indigo-200"
          >
            {loading ? "Processing..." : "Start Import"}
          </Button>
        </form>

        {result && (
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Success!</p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">
                Imported {result.count} leads successfully. 
                They are now visible in your leads list.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800">Import Error</p>
              <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Import Logic</h4>
        <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside">
          <li>Duplicate leads (same phone number) will be skipped.</li>
          <li>Default status will be set to <code className="bg-amber-100/50 px-1 rounded">NEW</code> if not specified.</li>
          <li>All imported leads will be assigned to you as the manager.</li>
        </ul>
      </div>
    </div>
  )
}
