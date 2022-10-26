const express = require('express');
var fs = require('fs')
const savedNotes = require('./db/db.json')

const app = express();
const PORT = 3001;
const path = require('path');

app.use(express.static('public'));

// app.get('/', (req, res) => res.send('Static assets!'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('api/notes', (req, res) =>
  res.json(savedNotes)
);

app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);
