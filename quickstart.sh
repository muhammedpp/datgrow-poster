#!/bin/bash
# Quick start script for generating a campaign poster

# Example 1: Simple poster with just a title
echo "Example 1: Simple poster"
python poster_generator.py "My Campaign"

# Example 2: Full featured poster
echo -e "\nExample 2: Full featured poster"
python poster_generator.py "Launch 2024" \
  --subtitle "Innovation Starts Here" \
  --description "Join us for the biggest product launch of the year" \
  --template modern \
  --output my_poster.png

echo -e "\n✓ Posters generated successfully!"
echo "Check the current directory for your posters."
