const API = 'http://localhost:3000';
const MAX_SIZE_MB = 5;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

const fileInput   = document.getElementById('file');
const fileNameEl  = document.getElementById('file-name');
const statusEl    = document.getElementById('status');
const uploadBtn   = document.getElementById('uploadBtn');
const dropArea    = document.getElementById('dropArea');

// ── File selection ────────────────────────────────────────────────
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  fileNameEl.textContent = file ? file.name : '';
  setStatus('');
});

// ── Drag & drop ───────────────────────────────────────────────────
['dragenter', 'dragover'].forEach(evt =>
  dropArea.addEventListener(evt, (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
  })
);

['dragleave', 'drop'].forEach(evt =>
  dropArea.addEventListener(evt, (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
  })
);

dropArea.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files;
    fileNameEl.textContent = file.name;
    setStatus('');
  }
});

// Click on drop area triggers file picker (except buttons/labels)
dropArea.addEventListener('click', (e) => {
  if (!e.target.closest('label') && !e.target.closest('input')) {
    fileInput.click();
  }
});

// ── Upload ────────────────────────────────────────────────────────
uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) return alert('Selecciona un archivo primero');
  if (!ALLOWED.includes(file.type)) return alert('Solo se permiten JPG, PNG o WEBP');
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return alert('El archivo supera los 5 MB');

  setStatus('busy', 'ti-loader', 'Subiendo...');
  uploadBtn.disabled = true;

  try {
    const res = await fetch(`${API}/api/upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type, sizeBytes: file.size })
    });
    const { uploadUrl, error } = await res.json();
    if (error) { setStatus('err', 'ti-alert-circle', error); return; }

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });

    setStatus('ok', 'ti-circle-check', 'Imagen subida correctamente');
    fileNameEl.textContent = '';
    fileInput.value = '';
    loadGallery();
  } catch {
    setStatus('err', 'ti-alert-circle', 'Error al subir la imagen');
  } finally {
    uploadBtn.disabled = false;
  }
});

// ── Gallery ───────────────────────────────────────────────────────
async function loadGallery() {
  const res = await fetch(`${API}/api/images`);
  const items = await res.json();
  const gallery = document.getElementById('gallery');
  const count   = document.getElementById('count');

  count.textContent = `${items.length} archivo${items.length !== 1 ? 's' : ''}`;

  if (items.length === 0) {
    gallery.innerHTML = `
      <div class="empty">
        <i class="ti ti-photo-off"></i>
        No hay imágenes aún
      </div>`;
    return;
  }

  gallery.innerHTML = items.map((item, idx) => {
    const name = item.key.split('/').pop();
    const size = item.size > 1024 * 1024
      ? (item.size / 1024 / 1024).toFixed(1) + ' MB'
      : Math.round(item.size / 1024) + ' KB';

    return `
      <div class="card" style="animation-delay:${idx * 40}ms">
        <div class="card-img-wrap">
          <img src="${item.url}" alt="${name}" loading="lazy">
          <div class="card-overlay">
            <button class="del-btn" onclick="del('${item.key}')">
              <i class="ti ti-trash"></i> Eliminar
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="card-name" title="${name}">${name}</div>
          <div class="card-size">${size}</div>
        </div>
      </div>`;
  }).join('');
}

async function del(key) {
  if (!confirm('¿Eliminar esta imagen?')) return;
  await fetch(`${API}/api/images/${encodeURIComponent(key)}`, { method: 'DELETE' });
  loadGallery();
}

// ── Helpers ───────────────────────────────────────────────────────
function setStatus(type = '', icon = '', msg = '') {
  statusEl.className = 'status-bar' + (type ? ' ' + type : '');
  statusEl.innerHTML = msg
    ? `<i class="ti ${icon}"></i> ${msg}`
    : '';
}

loadGallery();
