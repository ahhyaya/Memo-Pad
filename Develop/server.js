const express = require('express');
var fs = require('fs')
const savedNotes = require('./db/db.json')
const path = require('path');
const { execArgv } = require('process');

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.send(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Get request for a single note
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
}







app.post('/api/notes', (req, res, next) => {
  const newNote = new savedNotes({
    header: req.headers,
    body: req.body
  });
  savedNotes.push(newNote).then(
    () => {
      res.status(201).json({
        message: 'Note saved!'
      });
    }
  ).catch(
    (err) => {
      res.status(400).json({
        err:err
      })
    }
  )
})

// app.delete('/api/notes', (req, res) => {
//   res.send(savedNotes)
// })

const handleRequest = (req, res) => {
  fs.readFile(`${__dirname}/notes.html`, (err,data) => {
    if(err) throw err;
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(data)
  });
};


// app.put('api/notes', (req, res) => {
//   res.send(savedNotes)
// })





app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);
