'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface MediaUploadProps {
  vaultId: string
  onUploaded: (files: { path: string; url: string }[]) => void
}

interface UploadedFile {
  path: string
  url: string
  name: string
}

export function MediaUpload({ vaultId, onUploaded }: MediaUploadProps) {
  const t = useTranslations('entries')
  const { showToast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (fileList: FileList) => {
    setUploading(true)
    const supabase = createClient()
    const newFiles: UploadedFile[] = []

    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith('image/')) continue
      const path = `${vaultId}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('vault-media').upload(path, file)
      if (error) {
        showToast(error.message, 'error')
        continue
      }
      const { data } = supabase.storage.from('vault-media').getPublicUrl(path)
      newFiles.push({ path, url: data.publicUrl, name: file.name })
    }

    const updated = [...files, ...newFiles]
    setFiles(updated)
    onUploaded(updated.map((f) => ({ path: f.path, url: f.url })))
    setUploading(false)
  }

  const removeFile = async (index: number) => {
    const supabase = createClient()
    const file = files[index]
    await supabase.storage.from('vault-media').remove([file.path])
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onUploaded(updated.map((f) => ({ path: f.path, url: f.url })))
  }

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-amber-400 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
        }}
      >
        {uploading ? (
          <div className="flex justify-center"><LoadingSpinner /></div>
        ) : (
          <>
            <Upload size={32} className="mx-auto mb-2 text-gray-400" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">{t('addPhoto')}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              <button
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Entfernen"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
