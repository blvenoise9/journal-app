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
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Entry not found</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/entry/${id}`)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Journal Entry</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo (optional)
            </label>
            <ImageUpload 
              onImageSelect={handleImageSelect} 
              currentImage={currentImageUrl}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today?"
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-vertical"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/entry/${id}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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