const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { customAlphabet } = require('nanoid');
const mime = require('mime-types');
const { addTemplate } = require('../db');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

const storageDir = path.join(__dirname, '..', '..', 'storage', 'posters');
fs.mkdirSync(storageDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG/PNG allowed'), ok);
  },
  limits: { fileSize: 15 * 1024 * 1024 },
});

const router = express.Router();

router.get('/', (_req, res) => {
  res.render('admin', { title: 'Admin - Create Poster Template' });
});

router.post('/templates', upload.single('poster'), async (req, res) => {
  try {
    if (!req.file) throw new Error('Poster image is required');

    const id = nanoid();
    const ext = mime.extension(req.file.mimetype) || 'png';
    const filename = `${id}.${ext}`;
    const dest = path.join(storageDir, filename);
    fs.writeFileSync(dest, req.file.buffer);

    const x = Math.max(0, Math.round(Number(req.body.x || 0)));
    const y = Math.max(0, Math.round(Number(req.body.y || 0)));
    const width = Math.max(1, Math.round(Number(req.body.width || 0)));
    const height = Math.max(1, Math.round(Number(req.body.height || 0)));
    const shape = ['square', 'circle', 'rounded'].includes(req.body.shape) ? req.body.shape : 'square';
    const radius = Math.max(0, Math.round(Number(req.body.radius || 0)));
    const programName = (req.body.programName || '').toString().trim();
    const fixedText = (req.body.fixedText || (programName ? `I am participating in ${programName}` : '')).toString().trim();

    const template = {
      id,
      posterFilename: filename,
      placeholder: { x, y, width, height, shape, radius },
      text: { fixedText },
      createdAt: new Date().toISOString(),
    };

    await addTemplate(template);

    res.render('template_saved', {
      title: 'Template Saved',
      template,
      publicUrl: `/p/${id}`,
      posterUrl: `/posters/${filename}`,
    });
  } catch (err) {
    res.status(400).render('admin', {
      title: 'Admin - Create Poster Template',
      error: err.message || String(err),
    });
  }
});

module.exports = router;
