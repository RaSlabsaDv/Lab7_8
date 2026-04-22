const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

const DB_PATH = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// --- DB helpers ---
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- Multer config ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
                allowed.test(file.mimetype);
    cb(ok ? null : new Error('Only images allowed'), ok);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// ==================== ROUTES ====================

// GET /inventory — all items
app.get('/inventory', (req, res) => {
  const db = readDB();
  res.json(db.inventory);
});

// GET /inventory/:id — single item
app.get('/inventory/:id', (req, res) => {
  const db = readDB();
  const item = db.inventory.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// GET /inventory/:id/photo — serve photo
app.get('/inventory/:id/photo', (req, res) => {
  const db = readDB();
  const item = db.inventory.find(i => i.id === req.params.id);
  if (!item || !item.photo) return res.status(404).json({ error: 'Photo not found' });
  const photoPath = path.join(UPLOADS_DIR, item.photo);
  if (!fs.existsSync(photoPath)) return res.status(404).json({ error: 'File not found' });
  res.sendFile(photoPath);
});

// POST /register — create item
app.post('/register', upload.single('photo'), (req, res) => {
  const { inventory_name, description } = req.body;
  if (!inventory_name || !inventory_name.trim()) {
    return res.status(400).json({ error: 'inventory_name is required' });
  }
  const db = readDB();
  const newItem = {
    id: uuidv4(),
    inventory_name: inventory_name.trim(),
    description: description?.trim() || '',
    photo: req.file ? req.file.filename : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.inventory.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

// PUT /inventory/:id — update text fields
app.put('/inventory/:id', (req, res) => {
  const { inventory_name, description } = req.body;
  if (!inventory_name || !inventory_name.trim()) {
    return res.status(400).json({ error: 'inventory_name is required' });
  }
  const db = readDB();
  const idx = db.inventory.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.inventory[idx] = {
    ...db.inventory[idx],
    inventory_name: inventory_name.trim(),
    description: description?.trim() || '',
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  res.json(db.inventory[idx]);
});

// PUT /inventory/:id/photo — update photo
app.put('/inventory/:id/photo', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Photo file is required' });
  const db = readDB();
  const idx = db.inventory.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  // Delete old photo
  if (db.inventory[idx].photo) {
    const oldPath = path.join(UPLOADS_DIR, db.inventory[idx].photo);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  db.inventory[idx] = {
    ...db.inventory[idx],
    photo: req.file.filename,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  res.json(db.inventory[idx]);
});

// DELETE /inventory/:id
app.delete('/inventory/:id', (req, res) => {
  const db = readDB();
  const idx = db.inventory.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  // Delete photo file
  if (db.inventory[idx].photo) {
    const photoPath = path.join(UPLOADS_DIR, db.inventory[idx].photo);
    if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
  }

  db.inventory.splice(idx, 1);
  writeDB(db);
  res.status(204).send();
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Warehouse API running on http://localhost:${PORT}`);
});
