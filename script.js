const addBtn = document.getElementById('add');
const clearBtn = document.getElementById('clear');
const darkModeBtn = document.getElementById('dark-mode-btn');
const alert = document.querySelector('.alert');

// Get previously created notes from local storage and create a note element for each one
const notes = JSON.parse(localStorage.getItem('notes'));

if (notes) {
  notes.forEach((note) => addNewNote(note));
}

addBtn.addEventListener('click', () => addNewNote(''));

clearBtn.addEventListener('click', () => clearAllNotes());

function addNewNote(text = '') {
  const note = document.createElement('div');
  note.classList.add('note');

  note.innerHTML = `
    <div class="tools">
        <span class="date"></span>
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>

    <div class="main ${text ? '' : 'hidden'}"></div>
    <textarea class="${text ? 'hidden' : ''}"></textarea>`;
  // ^ add the class of hidden or no class depending on if there's text or not, so that we can switch between the formatted version of the text and the edit mode

  const date = note.querySelector('.date');
  const editBtn = note.querySelector('.edit');
  const deleteBtn = note.querySelector('.delete');
  const main = note.querySelector('.main');
  const textArea = note.querySelector('textarea');

  // Add date at which note is created
  date.innerHTML = new Date(Date.now()).toLocaleString();

  textArea.value = text;
  main.innerHTML = marked(text); // using marked library for the formatted version

  // remove note from DOM and LS
  deleteBtn.addEventListener('click', () => {
    note.remove();
    updateLS();
    alert.textContent = 'Note deleted!';
    displayAlert();
  });

  // toggle between text area (where we can type) and formatted, protected saved version of the note
  editBtn.addEventListener('click', () => {
    main.classList.toggle('hidden');
    textArea.classList.toggle('hidden');
  });

  // Overwrite text previously saved to a note and save that new text
  textArea.addEventListener('input', (e) => {
    const { value } = e.target; // same as e.target.value

    main.innerHTML = marked(value);

    updateLS();
  });

  document.body.appendChild(note);
}

// clear all notes
function clearAllNotes() {
  const notes = document.querySelectorAll('.note');
  notes.forEach((note) => note.remove());
  updateLS();
  alert.textContent = 'All notes deleted!';
  displayAlert();
}

function displayAlert() {
  alert.style.opacity = '1';
  setTimeout(() => {
    alert.style.opacity = '0';
  }, 2000);
}

function updateLS() {
  // add value of each note to empty notes array
  const notesText = document.querySelectorAll('textarea');

  const notes = [];

  notesText.forEach((note) => notes.push(note.value));
  // console.log(notes) // if we made one note with "Item1" in it and a second with "Item2", the array will be ["Item1", "Item2"]

  localStorage.setItem('notes', JSON.stringify(notes));
}

// Dark mode
darkModeBtn.addEventListener('click', () => {
  const html = document.querySelector('html');
  html.classList.toggle('dark');
  darkModeBtn.classList.toggle('dark-mode');
});
