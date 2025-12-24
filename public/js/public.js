(() => {
  const fileInput = document.getElementById('userPhoto');
  const genBtn = document.getElementById('genBtn');
  const ph = window.__APP__.placeholder || { width: 0, height: 0 };

  console.log('Public page loaded. Placeholder:', ph);

  fileInput.addEventListener('change', async () => {
    genBtn.disabled = true;
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    console.log('File selected:', file.name, file.type, file.size);
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      console.log('Invalid file type:', file.type);
      alert('Please upload a PNG or JPG image.');
      fileInput.value = '';
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      console.log('File too large:', file.size);
      alert('File too large. Max 15MB.');
      fileInput.value = '';
      return;
    }
    console.log('Image validation passed. Enabling button.');
    genBtn.disabled = false;
  });

  function getImageDims(file){
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url); };
      img.onerror = reject;
      img.src = url;
    });
  }
})();
