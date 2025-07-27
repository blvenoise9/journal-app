import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { JournalEntry } from '../types/index.ts';
import { journalAPI } from '../services/api.ts';

export const EntryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadEntry();
    }
  }, [id]);

  const loadEntry = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await journalAPI.getEntry(id);
      setEntry(data);
      setCurrentImageIndex(0); // Reset to first image
    } catch (err) {
      setError('Failed to load entry. Please try again.');
      console.error('Error loading entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!entry || !window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await journalAPI.deleteEntry(entry.uuid);
      navigate('/');
    } catch (err) {
      alert('Failed to delete entry. Please try again.');
      console.error('Error deleting entry:', err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error || 'Entry not found'}</div>
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

  // Get all image URLs for this entry
  const imageUrls = journalAPI.getImageUrls(entry);
  const hasImages = imageUrls.length > 0;

  const nextImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }
  };

  const prevImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

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
            <span>Back to entries</span>
          </button>

          <div className="flex items-center space-x-2">
            <Link
              to={`/edit/${entry.uuid}`}
              className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
              title="Edit entry"
            >
              <Edit3 className="w-5 h-5" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
              title="Delete entry"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Entry Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Image Carousel */}
        {hasImages && (
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
            {/* Main Image */}
            <div className="relative h-96">
              <img
                src={imageUrls[currentImageIndex]}
                alt={`Journal entry ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows (only show if multiple images) */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {imageUrls.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-2 py-1 rounded-full">
                  {currentImageIndex + 1} / {imageUrls.length}
                </div>
              )}
            </div>

            {/* Image Dots Indicator (only show if multiple images) */}
            {imageUrls.length > 1 && (
              <div className="flex justify-center space-x-2 py-3">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Entry Info */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
          {/* Title */}
          {entry.title && (
            <h1 className="text-2xl font-semibold text-white">
              {entry.title}
            </h1>
          )}

          {/* Metadata */}
          <div className="flex items-center space-x-6 text-gray-400 text-sm border-b border-gray-800 pb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(entry.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{formatTime(entry.time)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {entry.content}
          </div>
        </div>
      </div>
    </div>
  );
}; 