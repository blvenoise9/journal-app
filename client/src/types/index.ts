export interface JournalEntry {
  id: number;
  uuid: string;
  title?: string;
  content: string;
  image_path?: string;
  image_paths?: string[]; // New field for multiple images
  created_at: string;
  date: string;
  time: string;
}

export interface NewEntryData {
  title?: string;
  content: string;
  image?: File;
  images?: File[]; // New field for multiple images
}

export interface UpdateEntryData {
  title?: string;
  content?: string;
  image?: File;
  images?: File[]; // New field for multiple images
} 