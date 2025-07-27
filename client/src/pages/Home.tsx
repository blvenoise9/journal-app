import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Camera } from 'lucide-react';
import { EntryCard } from '../components/EntryCard.tsx';
import { JournalEntry } from '../types/index.ts';
import { journalAPI } from '../services/api.ts';
import { format } from 'date-fns';

export const Home: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await journalAPI.getAllEntries();
      console.log('Loaded entries:', data);
      setEntries(data);
    } catch (err) {
      setError('Failed to load entries. Please try again.');
      console.error('Error loading entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = (deletedId: string) => {
    setEntries(entries.filter(entry => entry.uuid !== deletedId));
  };

  const getTodayDate = () => {
    return format(new Date(), 'EEEE, MMMM d');
  };

  const todayEntries = entries.filter(entry => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return entry.date === today;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4 bg-black">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={loadEntries}
          className="px-4 py-2 bg-white text-black rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {/* Today's Entry Section */}
      <div className="px-4 py-6">
        <h2 className="text-white text-lg font-medium mb-4">Today's Entry</h2>
        
        {todayEntries.length === 0 ? (
          <Link
            to="/new"
            className="block bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Capture today</p>
                  <p className="text-gray-400 text-sm">{getTodayDate()}</p>
                </div>
              </div>
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          </Link>
        ) : (
          <div className="space-y-3">
            {todayEntries.map((entry) => (
              <EntryCard
                key={entry.uuid}
                entry={entry}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Entries Section */}
      {entries.filter(entry => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return entry.date !== today;
      }).length > 0 && (
        <div className="px-4">
          <h2 className="text-white text-lg font-medium mb-4">Past Entries</h2>
          <div className="space-y-3">
            {entries
              .filter(entry => {
                const today = format(new Date(), 'yyyy-MM-dd');
                return entry.date !== today;
              })
              .map((entry) => {
                console.log('Rendering entry:', entry);
                return (
                  <EntryCard
                    key={entry.uuid}
                    entry={entry}
                    onDelete={handleDeleteEntry}
                  />
                );
              })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="mb-6">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Start capturing</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              Your first memory is waiting to be created
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 