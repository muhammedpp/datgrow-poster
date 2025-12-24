#!/usr/bin/env python3
"""
Datgrow Campaign Poster Generator

A tool to generate marketing campaign posters with customizable text, colors, and layouts.
"""

from PIL import Image, ImageDraw, ImageFont
import argparse
import os
from typing import Tuple, Optional


class PosterGenerator:
    """Generate campaign posters with customizable elements."""
    
    def __init__(self, width: int = 1200, height: int = 1600):
        """
        Initialize poster generator.
        
        Args:
            width: Poster width in pixels
            height: Poster height in pixels
        """
        self.width = width
        self.height = height
        
    def create_poster(
        self,
        title: str,
        subtitle: str = "",
        description: str = "",
        background_color: Tuple[int, int, int] = (25, 118, 210),
        text_color: Tuple[int, int, int] = (255, 255, 255),
        accent_color: Tuple[int, int, int] = (255, 193, 7),
        template: str = "modern"
    ) -> Image.Image:
        """
        Create a campaign poster.
        
        Args:
            title: Main title text
            subtitle: Subtitle text
            description: Description or body text
            background_color: RGB tuple for background
            text_color: RGB tuple for text
            accent_color: RGB tuple for accents
            template: Template style (modern, classic, minimal)
            
        Returns:
            PIL Image object
        """
        # Create image
        img = Image.new('RGB', (self.width, self.height), background_color)
        draw = ImageDraw.Draw(img)
        
        # Try to use better fonts, fall back to default if not available
        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
            subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 50)
            desc_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 35)
        except:
            # Fallback to default font
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            desc_font = ImageFont.load_default()
        
        if template == "modern":
            self._draw_modern_template(draw, title, subtitle, description, 
                                      text_color, accent_color, 
                                      title_font, subtitle_font, desc_font)
        elif template == "classic":
            self._draw_classic_template(draw, title, subtitle, description,
                                       text_color, accent_color,
                                       title_font, subtitle_font, desc_font)
        elif template == "minimal":
            self._draw_minimal_template(draw, title, subtitle, description,
                                       text_color, accent_color,
                                       title_font, subtitle_font, desc_font)
        else:
            self._draw_modern_template(draw, title, subtitle, description,
                                      text_color, accent_color,
                                      title_font, subtitle_font, desc_font)
        
        return img
    
    def _draw_modern_template(self, draw, title, subtitle, description,
                             text_color, accent_color, title_font, subtitle_font, desc_font):
        """Draw modern template style."""
        # Draw accent bar at top
        draw.rectangle([0, 0, self.width, 30], fill=accent_color)
        
        # Draw title
        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (self.width - title_width) // 2
        draw.text((title_x, 150), title, fill=text_color, font=title_font)
        
        # Draw decorative line under title
        line_y = 270
        line_width = min(400, title_width + 100)
        line_x1 = (self.width - line_width) // 2
        line_x2 = line_x1 + line_width
        draw.rectangle([line_x1, line_y, line_x2, line_y + 5], fill=accent_color)
        
        # Draw subtitle
        if subtitle:
            subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
            subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
            subtitle_x = (self.width - subtitle_width) // 2
            draw.text((subtitle_x, 350), subtitle, fill=text_color, font=subtitle_font)
        
        # Draw description
        if description:
            self._draw_wrapped_text(draw, description, desc_font, text_color, 
                                   100, 500, self.width - 200)
        
        # Draw accent bar at bottom
        draw.rectangle([0, self.height - 30, self.width, self.height], fill=accent_color)
    
    def _draw_classic_template(self, draw, title, subtitle, description,
                              text_color, accent_color, title_font, subtitle_font, desc_font):
        """Draw classic template style."""
        # Draw border
        border_width = 20
        draw.rectangle([border_width, border_width, 
                       self.width - border_width, self.height - border_width],
                      outline=accent_color, width=10)
        
        # Draw title
        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (self.width - title_width) // 2
        draw.text((title_x, 200), title, fill=text_color, font=title_font)
        
        # Draw subtitle
        if subtitle:
            subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
            subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
            subtitle_x = (self.width - subtitle_width) // 2
            draw.text((subtitle_x, 320), subtitle, fill=text_color, font=subtitle_font)
        
        # Draw description
        if description:
            self._draw_wrapped_text(draw, description, desc_font, text_color,
                                   150, 450, self.width - 300)
    
    def _draw_minimal_template(self, draw, title, subtitle, description,
                              text_color, accent_color, title_font, subtitle_font, desc_font):
        """Draw minimal template style."""
        # Draw small accent element
        draw.ellipse([self.width // 2 - 30, 80, self.width // 2 + 30, 140], 
                    fill=accent_color)
        
        # Draw title
        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (self.width - title_width) // 2
        draw.text((title_x, 200), title, fill=text_color, font=title_font)
        
        # Draw subtitle
        if subtitle:
            subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
            subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
            subtitle_x = (self.width - subtitle_width) // 2
            draw.text((subtitle_x, 320), subtitle, fill=text_color, font=subtitle_font)
        
        # Draw description
        if description:
            self._draw_wrapped_text(draw, description, desc_font, text_color,
                                   150, 450, self.width - 300)
    
    def _draw_wrapped_text(self, draw, text, font, color, x, y, max_width):
        """Draw text with word wrapping."""
        words = text.split()
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font)
            if bbox[2] - bbox[0] <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Draw lines
        line_height = 50
        for i, line in enumerate(lines):
            bbox = draw.textbbox((0, 0), line, font=font)
            line_width = bbox[2] - bbox[0]
            line_x = x + (max_width - line_width) // 2
            draw.text((line_x, y + i * line_height), line, fill=color, font=font)
    
    def save_poster(self, img: Image.Image, output_path: str):
        """
        Save poster to file.
        
        Args:
            img: PIL Image object
            output_path: Path to save the image
        """
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
        img.save(output_path, quality=95)
        print(f"Poster saved to: {output_path}")


def parse_color(color_str: str) -> Tuple[int, int, int]:
    """
    Parse color string to RGB tuple.
    
    Args:
        color_str: Color in format "r,g,b" or hex "#RRGGBB"
        
    Returns:
        RGB tuple
    """
    if color_str.startswith('#'):
        # Hex color
        color_str = color_str.lstrip('#')
        return tuple(int(color_str[i:i+2], 16) for i in (0, 2, 4))
    else:
        # RGB format
        return tuple(map(int, color_str.split(',')))


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Generate campaign posters for Datgrow marketing campaigns'
    )
    
    parser.add_argument('title', help='Main title for the poster')
    parser.add_argument('--subtitle', default='', help='Subtitle text')
    parser.add_argument('--description', default='', help='Description or body text')
    parser.add_argument('--output', '-o', default='poster.png', 
                       help='Output file path (default: poster.png)')
    parser.add_argument('--width', type=int, default=1200, 
                       help='Poster width in pixels (default: 1200)')
    parser.add_argument('--height', type=int, default=1600,
                       help='Poster height in pixels (default: 1600)')
    parser.add_argument('--bg-color', default='25,118,210',
                       help='Background color as R,G,B or #RRGGBB (default: 25,118,210)')
    parser.add_argument('--text-color', default='255,255,255',
                       help='Text color as R,G,B or #RRGGBB (default: 255,255,255)')
    parser.add_argument('--accent-color', default='255,193,7',
                       help='Accent color as R,G,B or #RRGGBB (default: 255,193,7)')
    parser.add_argument('--template', choices=['modern', 'classic', 'minimal'],
                       default='modern', help='Poster template style (default: modern)')
    
    args = parser.parse_args()
    
    # Parse colors
    bg_color = parse_color(args.bg_color)
    text_color = parse_color(args.text_color)
    accent_color = parse_color(args.accent_color)
    
    # Generate poster
    generator = PosterGenerator(args.width, args.height)
    img = generator.create_poster(
        title=args.title,
        subtitle=args.subtitle,
        description=args.description,
        background_color=bg_color,
        text_color=text_color,
        accent_color=accent_color,
        template=args.template
    )
    
    # Save poster
    generator.save_poster(img, args.output)


if __name__ == '__main__':
    main()
