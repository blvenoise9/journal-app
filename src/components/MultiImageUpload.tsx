import React, { useState, useRef } from 'react';
import { Camera, X, Plus } from 'lucide-react';

interface MultiImageUploadProps {
  onImagesSelect: (files: File[]) => void;
  currentImages?: string[];
  className?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ 
  onImagesSelect, 
  currentImages = [], 
  className = '' 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newPreviewUrls: string[] = [];
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      newPreviewUrls.push(url);
    });

    const updatedFiles = [...selectedFiles, ...validFiles];
    const updatedPreviewUrls = [...previewUrls, ...newPreviewUrls];

    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviewUrls);
    onImagesSelect(updatedFiles);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    // Revoke the URL to prevent memory leaks
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviewUrls);
    onImagesSelect(updatedFiles);
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  // Cleanup URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const hasImages = previewUrls.length > 0 || currentImages.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {!hasImages ? (
        // Initial upload area
        <button
          type="button"
          onClick={handleAddMore}
          className="w-full h-48 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center space-y-3 text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-all bg-gray-900/50"
        >
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-400">Add photos</p>
            <p className="text-sm text-gray-500">Tap to select multiple images</p>
          </div>
        </button>
      ) : (
        // Image grid with previews
        <div className="space-y-3">
          {/* Current images (from server) */}
          {currentImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {currentImages.map((imageUrl, index) => (
                <div key={`current-${index}`} className="relative aspect-square">
                  <img
                    src={imageUrl}
                    alt={`Current ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                    Saved
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New selected images */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={`preview-${index}`} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1 py-0.5 rounded">
                    New
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add more button */}
          <button
            type="button"
            onClick={handleAddMore}
            className="w-full h-20 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center space-x-2 text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-all bg-gray-900/30"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Add more photos</span>
          </button>
        </div>
      )}

      {/* Image count indicator */}
      {hasImages && (
        <div className="text-center text-xs text-gray-500">
          {currentImages.length > 0 && `${currentImages.length} saved`}
          {currentImages.length > 0 && previewUrls.length > 0 && ' + '}
          {previewUrls.length > 0 && `${previewUrls.length} new`}
          {` photo${(currentImages.length + previewUrls.length) !== 1 ? 's' : ''}`}
        </div>
      )}
    </div>
  );
}; 