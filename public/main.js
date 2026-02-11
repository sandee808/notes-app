const api = {
  list: () => fetch('/api/notes').then(r => r.json()),
  create: (body) => fetch('/api/notes', {method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}).then(r => r.json()),
  update: (id, body) => fetch(`/api/notes/${id}`, {method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}).then(r => r.json()),
  del: (id) => fetch(`/api/notes/${id}`, {method: 'DELETE'})
};

const listEl = document.getElementById('notes-list');
const form = document.getElementById('note-form');
const titleInput = document.getElementById('note-title');
const contentInput = document.getElementById('note-content');
const idInput = document.getElementById('note-id');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

let notes = [];

function render() {
  listEl.innerHTML = '';
  notes.forEach(n => {
    const li = document.createElement('li');
    li.className = 'note';
    const h = document.createElement('h3');
    h.textContent = n.title;
    const p = document.createElement('p');
    p.textContent = n.content || '';
    const actions = document.createElement('div');
    actions.className = 'actions';
    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.onclick = () => startEdit(n);
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.onclick = async () => { await api.del(n.id); await load(); };
    actions.appendChild(edit);
    actions.appendChild(del);
    li.appendChild(h);
    li.appendChild(p);
    li.appendChild(actions);
    listEl.appendChild(li);
  });
}

async function load() {
  notes = await api.list();
  render();
}

function resetForm() {
  idInput.value = '';
  titleInput.value = '';
  contentInput.value = '';
  submitBtn.textContent = 'Add Note';
  cancelBtn.classList.add('hidden');
}

function startEdit(note) {
  idInput.value = note.id;
  titleInput.value = note.title;
  contentInput.value = note.content || '';
  submitBtn.textContent = 'Update Note';
  cancelBtn.classList.remove('hidden');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = idInput.value && Number(idInput.value);
  const payload = { title: titleInput.value.trim(), content: contentInput.value.trim() };
  if (!payload.title) return alert('Title is required');
  if (id) {
    await api.update(id, payload);
  } else {
    await api.create(payload);
  }
  resetForm();
  await load();
});

cancelBtn.addEventListener('click', () => resetForm());

load();
