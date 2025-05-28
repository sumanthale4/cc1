import React, { useState, useRef } from 'react';
import { Upload, FileType2, Check, AlertCircle } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';

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
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return false;
    }
    
    // Check file size (10MB max)
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
      // Simulate upload process
      setTimeout(() => {
        onUpload(file);
        setUploading(false);
        setFile(null);
      }, 2000);
    }
  };

  return (
    <Card className="mb-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf"
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center">
          {file ? (
            <>
              <div className="w-12 h-12 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <FileType2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
              </p>
              <div className="mt-4">
                <Button 
                  variant="primary" 
                  onClick={handleUploadClick}
                  disabled={uploading}
                  icon={uploading ? <span className="animate-spin">↻</span> : <Upload className="w-4 h-4" />}
                >
                  {uploading ? 'Uploading...' : 'Upload Statement'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Upload Credit Card Statement</h3>
              <p className="mt-1 text-sm text-gray-500">Drag and drop your PDF statement or click to browse</p>
              
              {error && (
                <div className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select PDF File
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FileUpload;