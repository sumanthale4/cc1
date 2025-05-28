import React, { useState, useRef } from 'react';
import { Upload, FileType2, Check, AlertCircle } from 'lucide-react';
import Button from '../UI/Button';

interface FileUploadProps {
  onUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUploadClick = () => {
    if (file) {
      setUploading(true);
      setTimeout(() => {
        onUpload(file);
        setUploading(false);
        setFile(null);
      }, 2000);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
      className={`border-2 border-dashed rounded-xl transition-all duration-300 ${
        isDragging 
          ? 'border-white bg-white/10' 
          : 'border-white/40 hover:border-white'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf"
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center p-8">
        {file ? (
          <>
            <div className="w-16 h-16 mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <FileType2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white">{file.name}</h3>
            <p className="mt-1 text-sm text-indigo-200">
              {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
            </p>
            <div className="mt-6">
              <Button 
                variant="secondary"
                onClick={handleUploadClick}
                disabled={uploading}
                className="bg-white text-indigo-600 hover:bg-indigo-50 transition-colors"
                icon={uploading ? <span className="animate-spin">↻</span> : <Upload className="w-4 h-4" />}
              >
                {uploading ? 'Uploading...' : 'Process Statement'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white">Drop your statement here</h3>
            <p className="mt-2 text-sm text-indigo-200 text-center max-w-sm">
              Drag and drop your PDF statement or click to browse your files
            </p>
            
            {error && (
              <div className="mt-3 text-sm text-red-200 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
            
            <div className="mt-6">
              <Button 
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Select PDF File
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;