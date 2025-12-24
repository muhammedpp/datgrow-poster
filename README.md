# Poster Generator Platform

A web-based platform where an admin configures a poster template once, and users generate personalized posters via a shareable link.

## Features
- Admin uploads a common poster and defines a photo placeholder (x, y, width, height, shape: square/circle/rounded, radius)
- Optional fixed text (e.g., "I am participating in [Program Name]")
- Public link per template for users to:
  - Upload photo (JPG/PNG)
  - Optional fields: Name, City, Member ID, Email
  - Auto resize + center crop + shape mask; merge with background and text
- Instant preview, download, and share link; WhatsApp share button

## Tech
- Node.js, Express, EJS
- Sharp for image processing
- Multer for uploads
- Lowdb (JSON) for simple storage

## Quick Start

```bash
# Install dependencies
npm install

# Run in dev mode (auto-reload)
npm run dev

# Or run normally
npm start
```

Open http://localhost:3000/admin to create a template.

## Environment
Copy `.env.example` to `.env` and adjust as needed.

- `PORT`: Server port
- SMTP variables (optional): enable email delivery if you implement SMTP in your environment

## Storage
- Posters: `storage/posters/`
- Generated: `storage/generated/`
- DB: `storage/db.json`

## Notes
- Images are limited to 15MB and must be JPG/PNG
- Uploaded photo must be at least the size of the placeholder
- Aspect ratio differences are center-cropped to fit
- Rounded shape uses the configured radius; circle uses a full circular mask