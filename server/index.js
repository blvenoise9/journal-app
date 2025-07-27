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

// Multer storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Routes
app.get('/api/entries', (_, res) => res.json(db.data.entries));

app.get('/api/entries/:id', (req, res) => {
  const entry = db.data.entries.find(e => e.id === req.params.id);
  entry ? res.json(entry) : res.status(404).end();
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
  res.status(201).json(entry);
});

app.put('/api/entries/:id', upload.array('images'), async (req, res) => {
  const entry = db.data.entries.find(e => e.id === req.params.id);
  if (!entry) return res.status(404).end();
  Object.assign(entry, req.body);
  if (req.files?.length) entry.image_paths = req.files.map(f => f.filename);
  await db.write();
  res.json(entry);
});

app.delete('/api/entries/:id', async (req, res) => {
  db.data.entries = db.data.entries.filter(e => e.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
}); 