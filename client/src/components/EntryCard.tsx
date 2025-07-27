import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Heart, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { JournalEntry } from '../types/index.ts';
import { journalAPI } from '../services/api.ts';

interface EntryCardProps {
  entry: JournalEntry;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const EntryCard: React.FC<EntryCardProps> = ({ 
  entry, 
  onDelete, 
  showActions = true 
}) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await journalAPI.deleteEntry(entry.uuid);
        onDelete?.(entry.uuid);
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Parse the date string manually to avoid timezone issues
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      return format(date, 'MMM d, yyyy');
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

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const entryDate = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
      return formatDate(dateString);
    } catch {
      return formatDate(dateString);
    }
  };

  // Get all image URLs for this entry
  const imageUrls = journalAPI.getImageUrls(entry);
  const hasImages = imageUrls.length > 0;

  return (
    <Link to={`/entry/${entry.uuid}`} className="block">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:bg-gray-800 transition-colors">
        {/* Images */}
        {hasImages && (
          <div className="relative">
            {imageUrls.length === 1 ? (
              // Single image display
              <div className="h-48">
                <img
                  src={imageUrls[0]}
                  alt="Journal entry"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              // Multiple images grid
              <div className="grid grid-cols-2 gap-1 h-48">
                {imageUrls.slice(0, 4).map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Journal entry ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Show count overlay on last image if there are more than 4 */}
                    {index === 3 && imageUrls.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-medium">
                          +{imageUrls.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Timestamp overlay */}
            <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {formatTime(entry.time)}
            </div>
            
            {/* Multiple images indicator */}
            {imageUrls.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {imageUrls.length} photos
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          {entry.title && (
            <h3 className="text-white font-medium mb-2">
              {entry.title}
            </h3>
          )}

          {/* Text content */}
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {truncateContent(entry.content)}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{getTimeAgo(entry.created_at)}</span>
            <span>{formatDate(entry.date)}</span>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="flex items-center space-x-1 text-gray-500 hover:text-white transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">0</span>
                </button>
                
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="flex items-center space-x-1 text-gray-500 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">0</span>
                </button>
              </div>

              <div className="flex items-center space-x-1">
                <Link
                  to={`/edit/${entry.uuid}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 text-gray-500 hover:text-white rounded transition-colors"
                  title="Edit entry"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(); }}
                  className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}; 