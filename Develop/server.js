const express = require('express');
var fs = require('fs')
const savedNotes = require('./db/db.json')
const path = require('path');
const { execArgv } = require('process');
const { NOTINITIALIZED } = require('dns');

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.send(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


const uuid = () => {
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}


// GET request for notes
app.get('/api/notes', (req, res) => {
  // res.json(`${req.method} request received to get notes`);
  res.json(savedNotes)
  console.info(`${req.method} request received to get notes`);
});

// GET request for a single note
app.get('/api/notes/:id/', (req, res) => {
  if(req.body && req.params.id) {
    console.info(`${req.method} request received to get a single note`);
    const noteId = req.params.id;
    for (let i = 0; i < savedNotes.length; i++) {
      const currentNote = savedNotes[i];
      if(currentNote.id === noteId) {
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

  const {title, text} = req.body;
  if(title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    }
    console.log(title, text);
    savedNotes.push(newNote)
    // convert data to a string so we can save it
    const noteString = JSON.stringify(savedNotes, null, '\t');
    
    fs.writeFile(`./db/db.json`, noteString, (err) => {
    err
      ? console.error(err)
      : console.log (
          `Note for ${newNote.title} has been append to JSON file`)
          console.log(noteString);
          res.json(noteString);
       }); 
  } else {
    res.json('Error in posting note');
  }}
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);
