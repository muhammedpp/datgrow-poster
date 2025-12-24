# Datgrow Campaign Poster Generator

A Python tool to generate beautiful marketing campaign posters with customizable text, colors, and layouts.

## Features

- 🎨 Multiple template styles (modern, classic, minimal)
- 🌈 Customizable colors for background, text, and accents
- 📐 Adjustable poster dimensions
- 💬 Support for title, subtitle, and description text
- 🖼️ High-quality PNG output

## Installation

1. Clone the repository:
```bash
git clone https://github.com/muhammedpp/datgrow-poster.git
cd datgrow-poster
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

Generate a simple poster with just a title:

```bash
python poster_generator.py "Launch Your Campaign"
```

This creates `poster.png` in the current directory.

### Advanced Usage

Create a poster with all customization options:

```bash
python poster_generator.py "Summer Sale 2024" \
  --subtitle "Up to 50% Off" \
  --description "Don't miss our biggest sale of the year! Limited time offer." \
  --output campaign_poster.png \
  --template modern \
  --bg-color "#1976D2" \
  --text-color "#FFFFFF" \
  --accent-color "#FFC107"
```

### Command-Line Options

- `title` (required): Main title text for the poster
- `--subtitle`: Subtitle text (optional)
- `--description`: Body text or description (optional)
- `--output`, `-o`: Output file path (default: `poster.png`)
- `--width`: Poster width in pixels (default: 1200)
- `--height`: Poster height in pixels (default: 1600)
- `--bg-color`: Background color as R,G,B or #RRGGBB (default: `25,118,210`)
- `--text-color`: Text color as R,G,B or #RRGGBB (default: `255,255,255`)
- `--accent-color`: Accent color as R,G,B or #RRGGBB (default: `255,193,7`)
- `--template`: Template style - `modern`, `classic`, or `minimal` (default: `modern`)

### Template Styles

#### Modern
Clean and contemporary design with accent bars and centered text.

```bash
python poster_generator.py "Innovation 2024" --template modern
```

#### Classic
Traditional design with decorative borders.

```bash
python poster_generator.py "Grand Opening" --template classic
```

#### Minimal
Simple and elegant with minimal decorative elements.

```bash
python poster_generator.py "Elegance" --template minimal
```

### Color Formats

Colors can be specified in two formats:

1. **RGB format**: `--bg-color "25,118,210"`
2. **Hex format**: `--bg-color "#1976D2"`

## Examples

### Marketing Campaign
```bash
python poster_generator.py "New Product Launch" \
  --subtitle "Coming Soon" \
  --description "Be the first to experience our revolutionary new product" \
  --template modern \
  --output marketing_poster.png
```

### Event Announcement
```bash
python poster_generator.py "Annual Conference 2024" \
  --subtitle "Join Us This December" \
  --description "Network with industry leaders and discover new opportunities" \
  --template classic \
  --bg-color "#2C3E50" \
  --accent-color "#E74C3C" \
  --output event_poster.png
```

### Minimalist Design
```bash
python poster_generator.py "Simplicity" \
  --subtitle "Less is More" \
  --template minimal \
  --bg-color "#ECEFF1" \
  --text-color "#37474F" \
  --accent-color "#FF5722" \
  --output minimal_poster.png
```

## Requirements

- Python 3.6+
- Pillow (PIL) 10.0.0+

## License

This project is open source and available for use in your marketing campaigns.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Author

Muhammad PP
