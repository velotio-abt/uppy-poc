import React, { useRef, useEffect, useState } from 'react'
import { useUppyEvent, useUppyState } from '@uppy/react'
import type Uppy from '@uppy/core'
import type { UppyFile } from '@uppy/core'
import { formatFileSize } from '../utils'

interface CustomUploaderProps {
  uppy: Uppy
}

type Meta = Record<string, unknown>
type Body = Record<string, unknown>

const CustomUploader: React.FC<CustomUploaderProps> = ({ uppy }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const files = useUppyState(uppy, (state) => state.files)
  const progress = useUppyState(uppy, (state) => state.totalProgress)

  const isUploading = useUppyState(
    uppy,
    (state) => Object.keys(state.currentUploads).length > 0
  )

  const [previews, setPreviews] = useState<Record<string, string>>({})

  useUppyEvent(uppy, 'complete', (result) => {
    console.log('Upload complete:', result)
  })

  useUppyEvent(uppy, 'error', (error) => {
    console.error('Upload error:', error)
  })

  useEffect(() => {
    return () => {
      uppy.cancelAll()
      // uppy.destroy()
    }
  }, [uppy])

  useEffect(() => {
    // Generate preview URLs for image files
    const urls: Record<string, string> = {}
    Object.values(files).forEach((file) => {
      if (file.type?.startsWith('image/') && file.data instanceof Blob) {
        urls[file.id] = URL.createObjectURL(file.data)
      }
    })
    setPreviews(urls)
  }, [files, uppy])

  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      uppy.addFiles(
        Array.from(files).map((file) => ({
          source: 'Local',
          name: file.name,
          type: file.type,
          data: file,
        }))
      )
    }
  }


  return (
    <div className="max-w-2xl mx-auto p-4 border rounded-md shadow bg-white space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200"
        >
          Select Files
        </button>

        <button
          onClick={() => uppy.upload()}
          disabled={isUploading || Object.keys(files).length === 0}
          className={`px-4 py-2 text-white rounded ${isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isUploading ? 'Uploading...' : 'Start Upload'}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        multiple
        hidden
        onChange={handleAddFiles}
      />

      {Object.keys(files).length === 0 ? (
        <p className="text-sm text-gray-500">No files selected.</p>
      ) : (
        <div className="max-w-2xl mx-auto p-4 border rounded-md shadow bg-white text-gray-900 space-y-4">
          <div className="space-y-2">
            {Object.values(files).map((file: UppyFile<Meta, Body>) => {
              const isImage = file.type?.startsWith('image/')
              const previewUrl = previews[file.id]

              return (
                <div
                  key={file.id}
                  className="flex items-start p-3 border rounded bg-gray-50 space-x-4"
                >
                  {/* File preview */}
                  <div className="w-16 h-16 flex-shrink-0 border rounded overflow-hidden flex items-center justify-center bg-white">
                    {isImage && previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="object-cover w-full h-full cursor-pointer hover:opacity-80"
                      />

                    ) : (
                      <div className="text-xs text-gray-500 text-center px-1">
                        {file.type?.split('/')[1]?.toUpperCase() || 'FILE'}
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold">{file.name}</p>
                    <p className="text-xs text-gray-600">
                      {formatFileSize(file.size as number)} &middot; {file.type || 'Unknown type'}
                    </p>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-blue-500 h-2 rounded transition-all"
                        style={{ width: `${file.progress?.percentage || 0}%` }}
                      ></div>
                    </div>
                    {file.error && (
                      <p className="text-xs text-red-600 mt-1">❌ {file.error}</p>
                    )}
                  </div>

                  {/* File actions */}
                  <div className="ml-4 space-y-1 text-right">
                    {file.error ? (
                      <button
                        onClick={() => uppy.retryUpload(file.id)}
                        className="text-yellow-600 hover:underline text-sm"
                      >
                        Retry
                      </button>
                    ) : (
                      <button
                        onClick={() => uppy.removeFile(file.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">Progress: {Math.round(progress)}%</p>
    </div>
  )
}

export default CustomUploader
