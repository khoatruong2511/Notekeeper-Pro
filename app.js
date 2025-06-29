let notes = [];
let editingNoteId = null;

function loadNotes() {
    const savedNotes = localStorage.getItem('quickNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNote(event) {
    event.preventDefault();

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (editingNoteId) {
        // Update existing note
        const noteIndex = notes.findIndex(note => note.id === editingNoteId);
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        };
    } else {
        // Add new note
        notes.unshift({
            id: generateId(),
            title: title,
            content: content
        });
    }

    console.log('Note saved:', { title, content, editingNoteId });
    editingNoteId = null; // Reset editing state
    closeNoteDialog();
    saveNotes();
    renderNotes();
}

function generateId() {
    return Date.now().toString()
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    console.log('Notes now:', notes);
    renderNotes();
}

function saveNotes() {
    localStorage.setItem('quickNotes', JSON.stringify(notes));
}

function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');
    let noNotes = notes.length === 0;
    console.log('noNotes:', noNotes);
    if (noNotes) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <h2>No Notes Yet</h2>
                <p>Create your first note now!</p>
                <button class="add-note-btn" onclick="openNoteDialog()">+ Add your first note</button>
            </div>
        `;
    } else {
        // Render notes
        notesContainer.innerHTML = notes.map(note => `
            <div class="note-card">
                <h3 class="note-title">${note.title}</h3>
                <p class="note-content">${note.content}</p>
                <div class="note-actions">
                    <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function openNoteDialog(noteId = null) {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if (noteId) {
        // Edit existing note
        const noteToEdit = notes.find(n => n.id === noteId);
        editingNoteId = noteId;
        document.getElementById('dialogTitle').textContent = 'Edit Note';
        titleInput.value = noteToEdit.title;
        contentInput.value = noteToEdit.content;
    } else {
        // Create new note
        editingNoteId = null;
        document.getElementById('dialogTitle').textContent = 'Add New Note';
        titleInput.value = '';
        contentInput.value = '';
    }

    dialog.showModal();
    titleInput.focus();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙';
}

function applyStoredTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggleBtn').textContent = '☀️';
    }
}

function closeNoteDialog() {
    const dialog = document.getElementById('noteDialog');
    dialog.close();
}

document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    notes = loadNotes();
    renderNotes();
    console.log('Notes loaded:', notes);

    document.getElementById('noteForm').addEventListener('submit', saveNote);
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);   
    document.getElementById('noteDialog').addEventListener('click', function (event) {
        if (event.target === this) {
            closeNoteDialog();
        }
    });
});