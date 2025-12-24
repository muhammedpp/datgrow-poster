const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { customAlphabet } = require('nanoid');
const { findTemplate, addGenerated, findGenerated } = require('../db');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

const generatedDir = path.join(__dirname, '..', '..', 'storage', 'generated');
const postersDir = path.join(__dirname, '..', '..', 'storage', 'posters');
fs.mkdirSync(generatedDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG/PNG allowed'), ok);
  },
  limits: { fileSize: 15 * 1024 * 1024 },
});

const router = express.Router();

router.get('/p/:id', (req, res) => {
  const tpl = findTemplate(req.params.id);
  if (!tpl) return res.status(404).send('Template not found');
  res.render('public', {
    title: 'Generate Your Poster',
    template: tpl,
    posterUrl: `/posters/${tpl.posterFilename}`,
    instructions: 'Upload your photo to generate your personalized poster',
  });
});

router.post('/p/:id/generate', (req, res, next) => {
  // apply rate limiter if available
  if (req.generateLimiter) return req.generateLimiter(req, res, next);
  next();
}, upload.single('photo'), async (req, res) => {
  try {
    const tpl = findTemplate(req.params.id);
    if (!tpl) return res.status(404).send('Template not found');
    if (!req.file) throw new Error('Please upload a JPG or PNG image');

    const posterPath = path.join(postersDir, tpl.posterFilename);
    const poster = sharp(posterPath);
    const posterMeta = await poster.metadata();

    const { x, y, width, height, shape, radius } = tpl.placeholder;

    // Prepare user image: resize to cover placeholder and center crop
    let userImg = sharp(req.file.buffer)
      .resize({ width, height, fit: 'cover', position: 'centre' });

    // Apply mask for circle/rounded
    if (shape === 'circle' || shape === 'rounded') {
      const r = shape === 'circle' ? Math.floor(Math.min(width, height) / 2) : Math.max(0, Number(radius) || 0);
      const maskSvg = shape === 'circle'
        ? `<svg width="${width}" height="${height}"><circle cx="${width/2}" cy="${height/2}" r="${r}" fill="white"/></svg>`
        : `<svg width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" rx="${r}" ry="${r}" fill="white"/></svg>`;
      userImg = userImg
        .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
        .png();
    }

    const userImgBuffer = await userImg.toBuffer();

    // Build composites: user image first, then texts as SVG overlays
    const composites = [
      { input: userImgBuffer, left: x, top: y }
    ];

    // Text overlays
    const textEntries = [];
    if (tpl.text?.fixedText) textEntries.push(tpl.text.fixedText);
    const lineHeight = 64;
    const footerPadding = 24;
    const blockHeight = textEntries.length ? (textEntries.length * lineHeight + footerPadding * 2) : 0;

    if (textEntries.length) {
      const svg = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="${posterMeta.width}" height="${blockHeight}">
        <rect x="0" y="0" width="${posterMeta.width}" height="${blockHeight}" fill="rgba(0,0,0,0.35)"/>
        ${textEntries.map((t, i) => `
          <text x="50%" y="${footerPadding + (i+1)*lineHeight - 20}" text-anchor="middle"
                font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#ffffff" stroke="#000000" stroke-width="1">
            ${escapeXml(t)}
          </text>
        `).join('')}
      </svg>`;
      composites.push({ input: Buffer.from(svg), top: Math.max(0, (posterMeta.height || 0) - blockHeight), left: 0 });
    }

    // Compose final image
    const final = await sharp(posterPath)
      .composite(composites)
      .png()
      .toBuffer();

    const gid = nanoid();
    const outName = `${gid}.png`;
    const outPath = path.join(generatedDir, outName);
    fs.writeFileSync(outPath, final);

    const record = {
      id: gid,
      templateId: tpl.id,
      file: outName,
      createdAt: new Date().toISOString(),
    };
    await addGenerated(record);

    res.redirect(`/g/${gid}`);
  } catch (err) {
    const msg = err?.message || 'Failed to generate poster';
    res.status(400).send(msg);
  }
});

router.get('/g/:id', (req, res) => {
  const g = findGenerated(req.params.id);
  if (!g) return res.status(404).send('Not found');
  const imageUrl = `/generated/${g.file}`;
  const downloadUrl = imageUrl; // direct file link
  const shareUrl = `${getBaseUrl(req)}/g/${g.id}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent('Check out my poster: ' + shareUrl)}`;
  res.render('result', { title: 'Your Poster', imageUrl, downloadUrl, shareUrl, whatsapp });
});

function getBaseUrl(req) {
  const proto = (req.headers['x-forwarded-proto'] || '').toString().split(',')[0] || req.protocol;
  return `${proto}://${req.get('host')}`;
}

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = router;
