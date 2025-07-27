import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload.tsx';
import { JournalEntry } from '../types/index.ts';
import { journalAPI } from '../services/api.ts';

export const EditEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingEntry, setLoadingEntry] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEntry();
    }
  }, [id]);

  const loadEntry = async () => {
    if (!id) return;
    
    try {
      setLoadingEntry(true);
      const data = await journalAPI.getEntry(id);
      setEntry(data);
      setTitle(data.title || '');
      setContent(data.content);
      if (data.image_path) {
        setCurrentImageUrl(journalAPI.getImageUrl(data.image_path));
      }
    } catch (err) {
      setError('Failed to load entry. Please try again.');
      console.error('Error loading entry:', err);
    } finally {
      setLoadingEntry(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !id) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await journalAPI.updateEntry(id, {
        title: title.trim() || undefined,
        content: content.trim(),
        image: image || undefined,
      });

      navigate(`/entry/${id}`);
    } catch (err) {
      setError('Failed to update entry. Please try again.');
      console.error('Error updating entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (file: File | null) => {
    setImage(file);
    if (file) {
      setCurrentImageUrl(undefined); // Clear current image when new one is selected
    }
  };

  if (loadingEntry) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">Entry not found</div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/entry/${id}`)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-medium text-white">Edit Entry</h1>
            <p className="text-sm text-gray-400">Update your thoughts</p>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title..."
            className="w-full text-lg font-medium placeholder-gray-500 bg-transparent border-none outline-none text-white"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Photo (optional)
          </label>
          <ImageUpload 
            onImageSelect={handleImageSelect} 
            currentImage={currentImageUrl}
          />
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today?"
            rows={10}
            className="w-full text-white placeholder-gray-500 bg-transparent border-none outline-none resize-none leading-relaxed"
            required
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate(`/entry/${id}`)}
            className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {content.length} characters
            </div>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="inline-flex items-center space-x-2 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}; 