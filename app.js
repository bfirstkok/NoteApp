/* =============================================
   📝 บันทึกของฉัน - Notes App
   เก็บข้อมูลใน LocalStorage
   ============================================= */

const STORAGE_KEY = 'my_notes_v1';

// ─── State ───────────────────────────────────
let notes = loadNotes();
let activeId = null;
let saveTimer = null;

// ─── DOM refs ────────────────────────────────
const noteList       = document.getElementById('note-list');
const editorWrapper  = document.getElementById('editor-wrapper');
const emptyState     = document.getElementById('empty-state');
const noteTitle      = document.getElementById('note-title');
const noteContent    = document.getElementById('note-content');
const noteCategory   = document.getElementById('note-category');
const saveStatus     = document.getElementById('save-status');
const wordCount      = document.getElementById('word-count');
const noteDate       = document.getElementById('note-date');
const noteCountEl    = document.getElementById('note-count');
const searchInput    = document.getElementById('search');
const filterCategory = document.getElementById('filter-category');
const colorPicker    = document.getElementById('color-picker');
const fontSize       = document.getElementById('font-size');
const textColor      = document.getElementById('text-color');

// ─── Init ─────────────────────────────────────
renderList();
buildCategoryFilter();

if (notes.length > 0) openNote(notes[0].id);

// ─── Event: New Note ──────────────────────────
document.getElementById('btn-new').addEventListener('click', () => {
  const note = createNote();
  notes.unshift(note);
  saveNotes();
  renderList();
  buildCategoryFilter();
  openNote(note.id);
  noteTitle.focus();
});

// ─── Event: Delete ───────────────────────────
document.getElementById('btn-delete').addEventListener('click', () => {
  if (!activeId) return;
  if (!confirm('ต้องการลบบันทึกนี้ใช่ไหม?')) return;
  notes = notes.filter(n => n.id !== activeId);
  saveNotes();
  activeId = null;
  renderList();
  buildCategoryFilter();
  if (notes.length > 0) openNote(notes[0].id);
  else showEmpty();
});

// ─── Event: Title change ─────────────────────
noteTitle.addEventListener('input', () => scheduleSave());

// ─── Event: Content change ───────────────────
noteContent.addEventListener('input', () => {
  scheduleSave();
  updateWordCount();
});

// ─── Event: Category change ──────────────────
noteCategory.addEventListener('change', () => scheduleSave());

// ─── Event: Search ───────────────────────────
searchInput.addEventListener('input', renderList);

// ─── Event: Filter Category ──────────────────
filterCategory.addEventListener('change', renderList);

// ─── Event: Format buttons ───────────────────
document.querySelectorAll('.format-bar button[data-cmd]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.execCommand(btn.dataset.cmd, false, null);
    noteContent.focus();
    scheduleSave();
  });
});

// ─── Event: Font size ────────────────────────
fontSize.addEventListener('change', () => {
  document.execCommand('fontSize', false, fontSize.value);
  noteContent.focus();
  scheduleSave();
});

// ─── Event: Text color ───────────────────────
textColor.addEventListener('input', () => {
  document.execCommand('foreColor', false, textColor.value);
  noteContent.focus();
  scheduleSave();
});

// ─── Event: Color picker ─────────────────────
colorPicker.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    colorPicker.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (activeId) {
      const note = getNote(activeId);
      note.color = btn.dataset.color;
      noteContent.style.background = note.color;
      scheduleSave();
    }
  });
});

// ─── Event: Export ───────────────────────────
document.getElementById('btn-export').addEventListener('click', () => {
  const json = JSON.stringify(notes, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notes_backup_${formatDateFile(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// ─── Event: Import ───────────────────────────
document.getElementById('btn-import').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!Array.isArray(imported)) throw new Error('รูปแบบไฟล์ไม่ถูกต้อง');
      const confirmed = confirm(`พบ ${imported.length} บันทึก — ต้องการรวมกับข้อมูลที่มีอยู่ไหม?\n(กด Cancel เพื่อแทนที่ทั้งหมด)`);
      if (confirmed) {
        const existingIds = new Set(notes.map(n => n.id));
        imported.forEach(n => { if (!existingIds.has(n.id)) notes.push(n); });
      } else {
        notes = imported;
      }
      saveNotes();
      renderList();
      buildCategoryFilter();
      if (notes.length > 0) openNote(notes[0].id);
      alert('นำเข้าสำเร็จ!');
    } catch (err) {
      alert('ไม่สามารถอ่านไฟล์ได้: ' + err.message);
    }
  };
  reader.readAsText(file, 'UTF-8');
  e.target.value = '';
});

// ─── Core Functions ───────────────────────────

function createNote() {
  return {
    id: Date.now().toString(),
    title: '',
    content: '',
    category: 'ทั่วไป',
    color: '#ffffff',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function getNote(id) {
  return notes.find(n => n.id === id);
}

function openNote(id) {
  activeId = id;
  const note = getNote(id);
  if (!note) return;

  emptyState.hidden = true;
  editorWrapper.hidden = false;

  noteTitle.value    = note.title;
  noteContent.innerHTML = note.content;
  noteCategory.value = note.category || 'ทั่วไป';
  noteContent.style.background = note.color || '#ffffff';

  // Highlight color btn
  colorPicker.querySelectorAll('.color-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.color === (note.color || '#ffffff'));
  });

  noteDate.textContent = `แก้ไขล่าสุด: ${formatDate(note.updatedAt)}`;
  updateWordCount();
  setSaveStatus('saved');

  // Active list item
  document.querySelectorAll('.note-item').forEach(el =>
    el.classList.toggle('active', el.dataset.id === id)
  );
}

function showEmpty() {
  editorWrapper.hidden = true;
  emptyState.hidden = false;
}

function scheduleSave() {
  setSaveStatus('saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCurrentNote, 600);
}

function saveCurrentNote() {
  if (!activeId) return;
  const note = getNote(activeId);
  if (!note) return;
  note.title     = noteTitle.value.trim() || 'ไม่มีหัวข้อ';
  note.content   = noteContent.innerHTML;
  note.category  = noteCategory.value;
  note.updatedAt = new Date().toISOString();
  saveNotes();
  renderList();
  noteDate.textContent = `แก้ไขล่าสุด: ${formatDate(note.updatedAt)}`;
  setSaveStatus('saved');
}

function setSaveStatus(state) {
  if (state === 'saving') {
    saveStatus.textContent = '⏳ กำลังบันทึก...';
    saveStatus.className = 'saving';
  } else {
    saveStatus.textContent = '✅ บันทึกแล้ว';
    saveStatus.className = 'saved';
  }
}

function updateWordCount() {
  const text = noteContent.innerText || '';
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  wordCount.textContent = `${chars} ตัวอักษร / ${words} คำ`;
}

function renderList() {
  const query    = searchInput.value.trim().toLowerCase();
  const catFilter = filterCategory.value;

  let filtered = notes.filter(n => {
    const matchCat = !catFilter || n.category === catFilter;
    const matchQ   = !query ||
      (n.title || '').toLowerCase().includes(query) ||
      stripHtml(n.content).toLowerCase().includes(query);
    return matchCat && matchQ;
  });

  noteList.innerHTML = '';
  filtered.forEach(note => {
    const li = document.createElement('li');
    li.className = 'note-item' + (note.id === activeId ? ' active' : '');
    li.dataset.id = note.id;

    const preview = stripHtml(note.content).slice(0, 60) || '(ไม่มีเนื้อหา)';
    const colorDot = note.color && note.color !== '#ffffff'
      ? `<div class="note-item-color" style="background:${note.color}"></div>` : '';

    li.innerHTML = `
      <div class="note-item-title">${escapeHtml(note.title || 'ไม่มีหัวข้อ')}</div>
      <div class="note-item-meta">
        <span>${note.category || 'ทั่วไป'}</span>
        <span>${formatDate(note.updatedAt)}</span>
      </div>
      <div class="note-item-preview">${escapeHtml(preview)}</div>
      ${colorDot}
    `;
    li.addEventListener('click', () => {
      if (activeId && activeId !== note.id) saveCurrentNote();
      openNote(note.id);
    });
    noteList.appendChild(li);
  });

  noteCountEl.textContent = `${filtered.length} / ${notes.length} บันทึก`;
}

function buildCategoryFilter() {
  const current = filterCategory.value;
  const cats = ['', ...new Set(notes.map(n => n.category).filter(Boolean))];
  filterCategory.innerHTML = '';
  const labels = { '': '📂 ทุกหมวด', 'ทั่วไป': '📂 ทั่วไป', 'งาน': '💼 งาน',
    'ส่วนตัว': '👤 ส่วนตัว', 'ไอเดีย': '💡 ไอเดีย', 'สิ่งที่ต้องทำ': '✅ สิ่งที่ต้องทำ' };
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = labels[c] || c;
    if (c === current) opt.selected = true;
    filterCategory.appendChild(opt);
  });
}

// ─── Storage ──────────────────────────────────

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ─── Helpers ──────────────────────────────────

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('th-TH', { day:'2-digit', month:'short', year:'numeric' })
    + ' ' + d.toLocaleTimeString('th-TH', { hour:'2-digit', minute:'2-digit' });
}

function formatDateFile(d) {
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}
