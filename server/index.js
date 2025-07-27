import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const PORT = process.env.PORT || 5002;
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

const app = express();
app.use(cors());
app.use(express.json());
app.use(`/${uploadDir}`, express.static(join(process.cwd(), uploadDir)));

// LowDB setup
const db = new Low(new JSONFile('db.json'), { entries: [] });
await db.read();
if (!db.data) db.data = { entries: [] };

// Helper function to transform entries for frontend
const transformEntry = (entry) => {
  const createdAt = new Date(entry.created_at);
  
  // Use local date instead of UTC to avoid timezone issues
  const year = createdAt.getFullYear();
  const month = String(createdAt.getMonth() + 1).padStart(2, '0');
  const day = String(createdAt.getDate()).padStart(2, '0');
  const hours = String(createdAt.getHours()).padStart(2, '0');
  const minutes = String(createdAt.getMinutes()).padStart(2, '0');
  
  return {
    ...entry,
    uuid: entry.id, // Use id as uuid for consistency
    date: `${year}-${month}-${day}`, // YYYY-MM-DD format using local date
    time: `${hours}:${minutes}`, // HH:MM format using local time
  };
};

// Multer storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Routes
app.get('/api/entries', (_, res) => {
  const transformedEntries = db.data.entries.map(transformEntry);
  res.json(transformedEntries);
});

app.get('/api/entries/:id', (req, res) => {
  const entry = db.data.entries.find(e => e.id === req.params.id);
  if (entry) {
    res.json(transformEntry(entry));
  } else {
    res.status(404).end();
  }
});

app.post('/api/entries', upload.array('images'), async (req, res) => {
  const { title, content } = req.body;
  const image_paths = req.files?.map(f => f.filename) || [];
  const entry = {
    id: nanoid(),
    title,
    content,
    image_paths,
    created_at: new Date().toISOString(),
  };
  db.data.entries.push(entry);
  await db.write();
  res.status(201).json(transformEntry(entry));
});

app.put('/api/entries/:id', upload.array('images'), async (req, res) => {
  const entry = db.data.entries.find(e => e.id === req.params.id);
  if (!entry) return res.status(404).end();
  Object.assign(entry, req.body);
  if (req.files?.length) entry.image_paths = req.files.map(f => f.filename);
  await db.write();
  res.json(transformEntry(entry));
});

app.delete('/api/entries/:id', async (req, res) => {
  db.data.entries = db.data.entries.filter(e => e.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

// Get memories (same date in previous years)
app.get('/api/memories', (req, res) => {
  const today = new Date();
  const todayMonth = today.getMonth() + 1; // getMonth() returns 0-11
  const todayDay = today.getDate();
  
  const memories = db.data.entries.filter(entry => {
    const entryDate = new Date(entry.created_at);
    const entryMonth = entryDate.getMonth() + 1;
    const entryDay = entryDate.getDate();
    const entryYear = entryDate.getFullYear();
    
    // Same month and day, but from previous years
    return entryMonth === todayMonth && 
           entryDay === todayDay && 
           entryYear < today.getFullYear();
  }).map(transformEntry);
  
  res.json(memories);
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
}); 