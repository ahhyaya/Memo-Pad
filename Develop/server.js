// Dependencies
const express = require('express');
var fs = require('fs')
const savedNotes = require('./db/db.json')
const path = require('path');
const { execArgv } = require('process');
const { NOTINITIALIZED } = require('dns');

const app = express();

// conect PORT to heroku or local host 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Memo-Pad is running on port ${ PORT }`);
});

// set midware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route for root page
app.get('/', (req, res) => res.send(path.join(__dirname, '/public/index.html')));

// route for /notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// generate note id 
const uuid = () => {
  const id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  return id;
}

// GET request for notes
app.get('/api/notes', (req, res) => {
  res.json(savedNotes)
  console.info(`${req.method} request received to get notes`);
});


// GET request for a single note
app.get('/api/notes/:note_id/', (req, res) => {
  if (req.body && req.params.note_id) {
    console.info(`${req.method} request received to get a single note`);
    const noteId = req.params.note_id;
    console.log(noteId)
    for (let i = 0; i < savedNotes.length; i++) {
      const currentNote = savedNotes[i];
      if (currentNote.note_id === noteId) {
        res.json(currentNote);
        return;
      }
    }
    res.json('Note ID not found');
  }
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    }
    console.log(newNote)

    console.log(title, text);
    savedNotes.push(newNote)

    // convert data to a string so we can save it
    const noteString = JSON.stringify(savedNotes, null, '\t');

    fs.writeFile(`./db/db.json`, noteString, (err) => {
      err
        ? console.error(err)
        : console.log(
          `Note for ${newNote.title} has been added to JSON file`)
      console.log(noteString);
      res.json(noteString);
    });
  } else {
    res.json('Error in posting note');
  }
});


// delete a single note by note id
app.delete('/api/notes/:note_id', (req, res) => {
  if (req.params.note_id) {

    console.info(`${req.method} request received to delete a single note`);
    const noteId = req.params.note_id;
    let index = savedNotes.findIndex(note => note.id === noteId);
    const note = savedNotes.splice(index, 1);
    console.log(note)
    const singleNoteString = JSON.stringify(note, null, '\t');
    fs.writeFile(`./db/db.json`, singleNoteString, (err) => {
      err
        ? console.error(err)
        : console.log(
          `Note for ${note.title} has been deleted from JSON file`)
      console.log(note);
      res.json(note);
    });
  } else {
    res.json(`Note has been deleted!`);
    }
});

// return index.html 
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

