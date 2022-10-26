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

app.get('/api/notes', (req, res) =>
  res.json(savedNotes)
);

app.post('/api/notes', (req, res) => {
  res.send(savedNotes)
})

app.delete('/api/notes', (req, res) => {
  res.send(savedNotes)
})

// app.put('api/notes', (req, res) => {
//   res.send(savedNotes)
// })

app.get('/api/notes/:note/', (req, res) => {
  const savedNote = req.params.note.toLowerCase();
  for (let i = 0; i < savedNotes.length; i++) {
  if(savedNote === savedNotes[i].note.toLowerCase()){
  return res.json(savedNotes[i]);
  }
}
  return res.json('No match note found');
});



app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);
