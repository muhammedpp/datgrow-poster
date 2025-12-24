require('dotenv').config();
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const { ensureDb } = require('./db');

const app = express();

// Init DB on startup
ensureDb();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
// Serve generated images and posters as static for preview/download
app.use('/generated', express.static(path.join(__dirname, '..', 'storage', 'generated')));
app.use('/posters', express.static(path.join(__dirname, '..', 'storage', 'posters')));

// Rate limiter for generation endpoint
const generateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

// Routes
const adminRouter = require('./routes/admin');
const publicRouter = require('./routes/public');
app.use('/admin', adminRouter);
app.use('/', (req, res, next) => {
  req.generateLimiter = generateLimiter;
  next();
});
app.use('/', publicRouter);

// Home redirect
app.get('/', (_req, res) => res.redirect('/admin'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Poster generator running on http://localhost:${PORT}`);
});
