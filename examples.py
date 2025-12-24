#!/usr/bin/env python3
"""
Example script demonstrating different poster generation scenarios.
"""

from poster_generator import PosterGenerator
import os


def create_examples():
    """Create example posters with different styles and configurations."""
    
    # Create output directory
    output_dir = "examples"
    os.makedirs(output_dir, exist_ok=True)
    
    generator = PosterGenerator(width=1200, height=1600)
    
    print("Generating example posters...\n")
    
    # Example 1: Modern Marketing Campaign
    print("1. Creating modern marketing campaign poster...")
    img1 = generator.create_poster(
        title="Launch Your Campaign",
        subtitle="With Datgrow",
        description="Reach your audience with powerful marketing tools and analytics",
        background_color=(25, 118, 210),  # Blue
        text_color=(255, 255, 255),  # White
        accent_color=(255, 193, 7),  # Amber
        template="modern"
    )
    generator.save_poster(img1, f"{output_dir}/modern_campaign.png")
    
    # Example 2: Classic Event Announcement
    print("2. Creating classic event announcement poster...")
    img2 = generator.create_poster(
        title="Annual Gala 2024",
        subtitle="A Night to Remember",
        description="Join us for an evening of networking, entertainment, and celebration",
        background_color=(44, 62, 80),  # Dark blue-grey
        text_color=(255, 255, 255),  # White
        accent_color=(231, 76, 60),  # Red
        template="classic"
    )
    generator.save_poster(img2, f"{output_dir}/classic_event.png")
    
    # Example 3: Minimal Product Launch
    print("3. Creating minimal product launch poster...")
    img3 = generator.create_poster(
        title="Introducing Clarity",
        subtitle="Simple. Powerful. Elegant.",
        description="Experience the next generation of productivity tools designed for modern teams",
        background_color=(236, 239, 241),  # Light grey
        text_color=(55, 71, 79),  # Dark grey
        accent_color=(255, 87, 34),  # Deep orange
        template="minimal"
    )
    generator.save_poster(img3, f"{output_dir}/minimal_product.png")
    
    # Example 4: Bold Sale Campaign
    print("4. Creating bold sale campaign poster...")
    img4 = generator.create_poster(
        title="MEGA SALE",
        subtitle="Up to 70% OFF",
        description="Limited time only! Don't miss out on amazing deals across all categories",
        background_color=(211, 47, 47),  # Red
        text_color=(255, 255, 255),  # White
        accent_color=(255, 235, 59),  # Yellow
        template="modern"
    )
    generator.save_poster(img4, f"{output_dir}/sale_campaign.png")
    
    # Example 5: Professional Conference
    print("5. Creating professional conference poster...")
    img5 = generator.create_poster(
        title="Tech Summit 2024",
        subtitle="Innovation & Future",
        description="Connect with industry leaders and explore cutting-edge technologies",
        background_color=(33, 33, 33),  # Dark grey
        text_color=(255, 255, 255),  # White
        accent_color=(0, 188, 212),  # Cyan
        template="classic"
    )
    generator.save_poster(img5, f"{output_dir}/conference.png")
    
    print(f"\n✓ All example posters created in '{output_dir}/' directory!")
    print("\nExample files:")
    print("  - modern_campaign.png")
    print("  - classic_event.png")
    print("  - minimal_product.png")
    print("  - sale_campaign.png")
    print("  - conference.png")


if __name__ == '__main__':
    create_examples()
