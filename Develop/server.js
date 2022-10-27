const express = require('express');
var fs = require('fs')
const savedNotes = require('./db/db.json')
const path = require('path');
const { execArgv } = require('process');
const { NOTINITIALIZED } = require('dns');
const util = require('util');

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

const uuid = () => {
  const id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  return id;
}

// GET request for notes
app.get('/api/notes', (req, res) => {
  // res.json(`${req.method} request received to get notes`);
  res.json(savedNotes)
  console.info(`${req.method} request received to get notes`);
});

// const readNote = util.promisify(fs.readFile);

// const readAndAppend = (text, savedNotes) => {
//   fs.readFile(savedNotes, 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     }else {
//       const parseData = JSON.parse(data);
//       parseData.push(text);
//       writeToFile(savedNotes, parseData);
//     }
//   })
// }

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
    // readAndAppend(newNote, './db/db.json');

    console.log(title, text);
    savedNotes.push(newNote)
    // convert data to a string so we can save it
    const noteString = JSON.stringify(savedNotes, null, '\t');

    fs.writeFile(`./db/db.json`, noteString, (err) => {
      err
        ? console.error(err)
        : console.log(
          `Note for ${newNote.title} has been append to JSON file`)
      console.log(noteString);
      res.json(noteString);
    });
  } else {
    res.json('Error in posting note');
  }
}
);

app.delete('/:id', (req, res) => res.json(`Note deleted!`));

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);
