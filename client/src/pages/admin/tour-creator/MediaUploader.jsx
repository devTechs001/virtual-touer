import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X, Check, AlertCircle } from 'lucide-react';

const MediaUploader = ({ onUpload, accept = 'image/*', maxSize = 10 * 1024 * 1024 }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onUpload, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-primary-500 bg-primary-500/10'
          : error
          ? 'border-red-500/50 bg-red-500/5'
          : 'border-dark-600 hover:border-dark-500 hover:bg-dark-800/50'
      }`}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-dark-300">Uploading...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-400">{error}</p>
          <p className="text-sm text-dark-500 mt-2">Click or drop to try again</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-dark-400" />
          </div>
          <p className="text-white font-medium mb-1">
            {isDragActive ? 'Drop the file here' : 'Upload Panorama Image'}
          </p>
          <p className="text-sm text-dark-500">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-dark-600 mt-2">
            Recommended: 4096x2048px equirectangular image
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;