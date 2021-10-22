const express = require("express");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();
let db = require("./db/db");
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => res.json(db));

// POST /api/notes should receive a new note to save on the request body, add it to the db.json
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (req.body) {
    const newNote = {
      title,
      text,
      id:uuidv4()
    };
    db.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(db, null, 4));
    res.json("Data written to db.json");
  } else {
    res.error("Error, unable to write data into db.json");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  db = db.filter(note => note.id != req.params.id)
  console.log(db)
  fs.writeFileSync("./db/db.json", JSON.stringify(db, null, 4))
  return res.status(200).json(db);

});

// GET /notes should return the notes.html file.
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET * should return the index.html file.
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
