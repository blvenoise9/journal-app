import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { JournalEntry } from '../types/index.ts';
import { journalAPI } from '../services/api.ts';

export const Memories: React.FC = () => {
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  const [memoriesEntries, setMemoriesEntries] = useState<JournalEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [selectedDateEntries, setSelectedDateEntries] = useState<JournalEntry[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [entries, memories] = await Promise.all([
        journalAPI.getAllEntries(),
        journalAPI.getMemories()
      ]);
      
      setAllEntries(entries);
      setMemoriesEntries(memories);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntriesForDate = (date: Date): JournalEntry[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    const entries = allEntries.filter(entry => entry.date === dateString);
    
    return entries;
  };

  const generateCalendarDays = (): (Date | null)[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const openEntryModal = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setSelectedDateEntries([]);
    setCurrentImageIndex(0); // Reset to first image
  };

  const openDateEntriesModal = (entries: JournalEntry[]) => {
    setSelectedDateEntries(entries);
    setSelectedEntry(null);
  };

  const nextImage = () => {
    if (selectedEntry) {
      const imageUrls = journalAPI.getImageUrls(selectedEntry);
      if (imageUrls.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
      }
    }
  };

  const prevImage = () => {
    if (selectedEntry) {
      const imageUrls = journalAPI.getImageUrls(selectedEntry);
      if (imageUrls.length > 1) {
        setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
      }
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();
  const today = new Date();

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-center">Memories</h1>
      </div>

      {/* On This Day Section */}
      {memoriesEntries.length > 0 && (
        <div className="px-4 py-6 border-b border-gray-800">
          <h2 className="text-lg font-medium mb-4">On This Day</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {memoriesEntries.map((entry) => {
              const entryYear = parseInt(entry.date.split('-')[0]);
              const yearsAgo = today.getFullYear() - entryYear;
              const imageUrls = journalAPI.getImageUrls(entry);
              
              return (
                <button
                  key={entry.uuid}
                  onClick={() => openEntryModal(entry)}
                  className="flex-shrink-0 w-24 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-800">
                    {imageUrls.length > 0 ? (
                      <img
                        src={imageUrls[0]}
                        alt="Memory"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{entryYear}</div>
                  <div className="text-xs text-gray-500">{yearsAgo} years ago</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar Section */}
      <div className="px-4 py-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h2 className="text-xl font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button
            onClick={goToNextMonth}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm text-gray-500 font-medium">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="p-2"></div>;
            }

            const dayEntries = getEntriesForDate(date);
            const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
            const imageUrls = dayEntries.length > 0 ? journalAPI.getImageUrls(dayEntries[0]) : [];

            return (
              <div key={index} className="relative">
                <button
                  onClick={() => dayEntries.length > 0 && openDateEntriesModal(dayEntries)}
                  className={`w-full aspect-square p-1 rounded-lg transition-colors ${
                    isToday 
                      ? 'bg-white text-black' 
                      : dayEntries.length > 0 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'hover:bg-gray-900'
                  }`}
                >
                  <div className="text-xs font-medium mb-1">{date.getDate()}</div>
                  
                  {dayEntries.length > 0 && (
                    <div className="w-full h-6 rounded overflow-hidden">
                      {imageUrls.length > 0 ? (
                        <img
                          src={imageUrls[0]}
                          alt="Entry"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                      )}
                      
                      {/* Multiple entries indicator */}
                      {dayEntries.length > 1 && (
                        <div className="absolute bottom-0 right-0 bg-white text-black text-xs px-1 rounded-full">
                          {dayEntries.length}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Entry Detail Modal with Image Carousel */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-sm w-full max-h-[80vh] overflow-hidden">
            {/* Image Carousel */}
            {(() => {
              const imageUrls = journalAPI.getImageUrls(selectedEntry);
              const hasImages = imageUrls.length > 0;
              
              if (hasImages) {
                return (
                  <div className="relative">
                    {/* Main Image */}
                    <div className="relative h-64">
                      <img
                        src={imageUrls[currentImageIndex]}
                        alt={`Entry image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Navigation Arrows (only show if multiple images) */}
                      {imageUrls.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      {imageUrls.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          {currentImageIndex + 1} / {imageUrls.length}
                        </div>
                      )}
                    </div>

                    {/* Image Dots Indicator (only show if multiple images) */}
                    {imageUrls.length > 1 && (
                      <div className="flex justify-center space-x-1 py-2 bg-gray-800">
                        {imageUrls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}
            
            <div className="p-4">
              {selectedEntry.title && (
                <h3 className="text-white font-medium mb-2">{selectedEntry.title}</h3>
              )}
              
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {selectedEntry.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{format(parseISO(selectedEntry.created_at), 'MMM d, yyyy')}</span>
                <span>{selectedEntry.time}</span>
              </div>
              
              <button
                onClick={() => setSelectedEntry(null)}
                className="w-full mt-4 py-2 bg-white text-black rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Entries Modal */}
      {selectedDateEntries.length > 0 && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-xl font-bold text-center">
                Entries for {(() => {
                  const [year, month, day] = selectedDateEntries[0].date.split('-').map(Number);
                  const date = new Date(year, month - 1, day);
                  return format(date, 'MMM d, yyyy');
                })()}
              </h3>
            </div>
            <div className="p-4">
              {selectedDateEntries.map((entry) => {
                const imageUrls = journalAPI.getImageUrls(entry);
                return (
                  <div key={entry.uuid} className="mb-4 last:mb-0">
                    <button
                      onClick={() => openEntryModal(entry)}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                          {imageUrls.length > 0 ? (
                            <img
                              src={imageUrls[0]}
                              alt="Entry"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-left">
                            {entry.title || entry.content.slice(0, 30) + (entry.content.length > 30 ? '...' : '')}
                          </h4>
                          <p className="text-gray-400 text-sm">{entry.time}</p>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {(() => {
                          const [year, month, day] = entry.date.split('-').map(Number);
                          const date = new Date(year, month - 1, day);
                          return format(date, 'MMM d, yyyy');
                        })()}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-800">
              <button
                onClick={() => setSelectedDateEntries([])}
                className="w-full py-2 bg-white text-black rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 