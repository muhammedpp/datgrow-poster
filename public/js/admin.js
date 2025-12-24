(() => {
  const fileInput = document.getElementById('posterInput');
  const stage = document.getElementById('posterStage');
  const img = document.getElementById('posterPreview');
  const overlay = document.getElementById('phOverlay');
  const saveBtn = document.getElementById('saveBtn');
  const fieldX = document.getElementById('fieldX');
  const fieldY = document.getElementById('fieldY');
  const fieldW = document.getElementById('fieldW');
  const fieldH = document.getElementById('fieldH');
  const radiusInput = document.getElementById('radius');

  let imgNatural = { w: 0, h: 0 };
  let overlayState = { x: 50, y: 50, w: 200, h: 200 };
  let dragging = false, resizing = false, resizeHandle = '';
  let startMouse = { x: 0, y: 0 };
  let startOverlay = { x: 0, y: 0, w: 0, h: 0 };

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      alert('Please select a PNG or JPG image.');
      fileInput.value = '';
      return;
    }
    const url = URL.createObjectURL(file);
    img.onload = () => {
      imgNatural.w = img.naturalWidth;
      imgNatural.h = img.naturalHeight;
      stage.classList.remove('hidden');
      overlay.classList.remove('hidden');
      saveBtn.disabled = false;
      placeOverlayInitial();
    };
    img.src = url;
  });

  function placeOverlayInitial() {
    // default to a centered square occupying 30% of the shortest side
    const display = img.getBoundingClientRect();
    const shortest = Math.min(display.width, display.height);
    const size = Math.max(120, Math.round(shortest * 0.3));
    overlayState.w = size;
    overlayState.h = size;
    overlayState.x = Math.round((display.width - size) / 2);
    overlayState.y = Math.round((display.height - size) / 2);
    updateOverlay();
    syncHiddenFields();
  }

  function updateOverlay() {
    const display = img.getBoundingClientRect();
    overlay.style.left = overlayState.x + 'px';
    overlay.style.top = overlayState.y + 'px';
    overlay.style.width = overlayState.w + 'px';
    overlay.style.height = overlayState.h + 'px';

    // Apply shape border-radius based on radios
    const shape = getShape();
    if (shape === 'circle') overlay.style.borderRadius = '50%';
    else if (shape === 'rounded') overlay.style.borderRadius = (Number(radiusInput.value)||24) + 'px';
    else overlay.style.borderRadius = '0';
  }

  function getShape(){
    const el = document.querySelector('input[name="shape"]:checked');
    return el ? el.value : 'square';
  }

  // Dragging
  overlay.addEventListener('mousedown', (e) => {
    const target = e.target;
    if (target.classList.contains('handle')) {
      resizing = true;
      resizeHandle = [ 'tl','tr','bl','br' ].find(h => target.classList.contains(h));
    } else {
      dragging = true;
    }
    startMouse = { x: e.clientX, y: e.clientY };
    startOverlay = { ...overlayState };
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging && !resizing) return;
    const dx = e.clientX - startMouse.x;
    const dy = e.clientY - startMouse.y;
    const display = img.getBoundingClientRect();
    if (dragging) {
      overlayState.x = clamp(startOverlay.x + dx, 0, display.width - overlayState.w);
      overlayState.y = clamp(startOverlay.y + dy, 0, display.height - overlayState.h);
    } else if (resizing) {
      if (resizeHandle.includes('r')) {
        overlayState.w = clamp(startOverlay.w + dx, 20, display.width - startOverlay.x);
      }
      if (resizeHandle.includes('b')) {
        overlayState.h = clamp(startOverlay.h + dy, 20, display.height - startOverlay.y);
      }
      if (resizeHandle.includes('l')) {
        const newW = clamp(startOverlay.w - dx, 20, startOverlay.w + startOverlay.x);
        const newX = startOverlay.x + (startOverlay.w - newW);
        overlayState.x = clamp(newX, 0, startOverlay.x + startOverlay.w - 20);
        overlayState.w = newW;
      }
      if (resizeHandle.includes('t')) {
        const newH = clamp(startOverlay.h - dy, 20, startOverlay.h + startOverlay.y);
        const newY = startOverlay.y + (startOverlay.h - newH);
        overlayState.y = clamp(newY, 0, startOverlay.y + startOverlay.h - 20);
        overlayState.h = newH;
      }
    }
    updateOverlay();
  });
  window.addEventListener('mouseup', () => {
    if (dragging || resizing) syncHiddenFields();
    dragging = false; resizing = false; resizeHandle = '';
  });

  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function syncHiddenFields() {
    // Convert from displayed CSS pixels to intrinsic image pixels
    const display = img.getBoundingClientRect();
    const scaleX = imgNatural.w / display.width;
    const scaleY = imgNatural.h / display.height;
    fieldX.value = Math.round(overlayState.x * scaleX);
    fieldY.value = Math.round(overlayState.y * scaleY);
    fieldW.value = Math.round(overlayState.w * scaleX);
    fieldH.value = Math.round(overlayState.h * scaleY);
  }

  document.getElementById('adminForm').addEventListener('submit', (e) => {
    // ensure hidden fields are synced
    syncHiddenFields();
  });

  // Update overlay radius based on input when rounded
  document.querySelectorAll('input[name="shape"]').forEach(r => r.addEventListener('change', updateOverlay));
  radiusInput.addEventListener('input', updateOverlay);
})();
