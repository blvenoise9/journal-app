import axios from 'axios';
import { JournalEntry, NewEntryData, UpdateEntryData } from '../types/index.ts';

declare var process: {
  env: {
    REACT_APP_API_URL?: string;
  };
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const journalAPI = {
  // Get all entries
  getAllEntries: async (): Promise<JournalEntry[]> => {
    const response = await api.get('/entries');
    return response.data;
  },

  // Get entry by ID
  getEntry: async (id: string): Promise<JournalEntry> => {
    const response = await api.get(`/entries/${id}`);
    return response.data;
  },

  // Create new entry (supports multiple images)
  createEntry: async (data: NewEntryData): Promise<JournalEntry> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    formData.append('content', data.content);
    
    // Handle multiple images
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    } else if (data.image) {
      // Backward compatibility for single image
      formData.append('images', data.image);
    }

    const response = await api.post('/entries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update entry (supports multiple images)
  updateEntry: async (id: string, data: UpdateEntryData): Promise<JournalEntry> => {
    const formData = new FormData();
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.content !== undefined) formData.append('content', data.content);
    
    // Handle multiple images
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    } else if (data.image) {
      // Backward compatibility for single image
      formData.append('images', data.image);
    }

    const response = await api.put(`/entries/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete entry
  deleteEntry: async (id: string): Promise<void> => {
    await api.delete(`/entries/${id}`);
  },

  // Get memories (same date in previous years)
  getMemories: async (): Promise<JournalEntry[]> => {
    const response = await api.get('/memories');
    return response.data;
  },

  // Get entries by date
  getEntriesByDate: async (date: string): Promise<JournalEntry[]> => {
    const response = await api.get(`/entries/date/${date}`);
    return response.data;
  },

  // Get image URL (handles both single and multiple images)
  getImageUrl: (imagePath: string): string => {
    return `${API_BASE_URL.replace('/api', '')}/uploads/${imagePath}`;
  },
  
  // Get all image URLs for an entry
  getImageUrls: (entry: JournalEntry): string[] => {
    const urls: string[] = [];
    
    // Handle multiple images (new format)
    if (entry.image_paths && entry.image_paths.length > 0) {
      entry.image_paths.forEach(path => {
        urls.push(`${API_BASE_URL.replace('/api', '')}/uploads/${path}`);
      });
    }
    // Handle single image (backward compatibility)
    else if (entry.image_path) {
      urls.push(`${API_BASE_URL.replace('/api', '')}/uploads/${entry.image_path}`);
    }
    
    return urls;
  },
}; 