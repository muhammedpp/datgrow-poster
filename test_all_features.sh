#!/bin/bash
# Comprehensive test script for all poster generator features

echo "=== Datgrow Campaign Poster Generator - Feature Test ==="
echo ""

# Test 1: Basic poster with just title
echo "Test 1: Basic poster (title only)"
python poster_generator.py "Simple Title" --output test_outputs/basic.png
echo ""

# Test 2: Modern template with full text
echo "Test 2: Modern template (full text)"
python poster_generator.py "Innovation 2024" \
  --subtitle "Leading the Future" \
  --description "Join us for groundbreaking announcements and product reveals" \
  --template modern \
  --output test_outputs/modern_full.png
echo ""

# Test 3: Classic template with hex colors
echo "Test 3: Classic template (hex colors)"
python poster_generator.py "Gala Night" \
  --subtitle "An Evening of Elegance" \
  --template classic \
  --bg-color "#2C3E50" \
  --text-color "#ECF0F1" \
  --accent-color "#E74C3C" \
  --output test_outputs/classic_hex.png
echo ""

# Test 4: Minimal template with RGB colors
echo "Test 4: Minimal template (RGB colors)"
python poster_generator.py "Less is More" \
  --subtitle "Minimalist Design" \
  --template minimal \
  --bg-color "240,240,240" \
  --text-color "50,50,50" \
  --accent-color "0,150,136" \
  --output test_outputs/minimal_rgb.png
echo ""

# Test 5: Custom dimensions
echo "Test 5: Custom dimensions (800x1200)"
python poster_generator.py "Custom Size" \
  --width 800 \
  --height 1200 \
  --output test_outputs/custom_size.png
echo ""

# Test 6: Long description wrapping
echo "Test 6: Long text wrapping"
python poster_generator.py "Annual Summit" \
  --subtitle "2024 Conference" \
  --description "This is a long description that will test the text wrapping functionality. The system should automatically wrap text to multiple lines when it exceeds the maximum width of the poster." \
  --output test_outputs/long_text.png
echo ""

echo "=== All tests completed! ==="
echo "Check test_outputs/ directory for generated posters."
