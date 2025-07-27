import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { MultiImageUpload } from '../components/MultiImageUpload.tsx';
import { journalAPI } from '../services/api.ts';
import { format } from 'date-fns';

export const NewEntry: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await journalAPI.createEntry({
        title: title.trim() || undefined,
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
      });

      navigate('/');
    } catch (err) {
      setError('Failed to create entry. Please try again.');
      console.error('Error creating entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImagesSelect = (files: File[]) => {
    setImages(files);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: format(now, 'EEEE, MMMM d, yyyy'),
      time: format(now, 'h:mm a'),
    };
  };

  const { date } = getCurrentDateTime();

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-medium text-white">New Entry</h1>
            <p className="text-sm text-gray-400">{date}</p>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title... (optional)"
            className="w-full text-lg font-medium placeholder-gray-500 bg-transparent border-none outline-none text-white"
          />
        </div>

        {/* Multiple Image Upload */}
        <div>
          <MultiImageUpload onImagesSelect={handleImagesSelect} />
        </div>

        {/* Content Input */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Share your thoughts, feelings, or what happened..."
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
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {content.length} characters
              {images.length > 0 && ` • ${images.length} photo${images.length !== 1 ? 's' : ''}`}
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
              <span>{loading ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}; 