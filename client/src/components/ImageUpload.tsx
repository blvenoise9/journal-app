import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  currentImage, 
  className = '' 
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-80 object-cover rounded-2xl"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-3 right-3 p-2 bg-black/70 text-white rounded-full hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full h-48 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center space-y-3 text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-all bg-gray-900/50"
        >
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-400">Add a photo</p>
            <p className="text-sm text-gray-500">Tap to capture or upload</p>
          </div>
        </button>
      )}
    </div>
  );
}; 