import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Database from "better-sqlite3";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8866;
const db = new Database("database.db");

// Server test
app.get("/", (req, res) => {
  res.send("Server is live");
  res.status(200);
});

// Get messages from our databases
app.get("/messages", (req, res) => {
  try {
    // Get a message by it's id (messages?id=1)
    if (req.query.id) {
      //res.status(200).send("You sent a query");
      let message = db.prepare(`SELECT * FROM messages WHERE id = ?`).all(req.query.id);
      res.status(200).json({ response: message });
      return;
    }
    // Get all messages in the database
    let messages = db.prepare(`SELECT * FROM messages`).all();
    res.status(200).json({ response: messages });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Add a new message to the database
// req.body =
// {
// "username": ""
// "message": ""
// "likes": ""
// "userPhoto": ""
// }
app.post("/messages", (req, res) => {
  try {
    const username = req.body.username;
    const message = req.body.message;
    const likes = req.body.likes;
    const userPhoto = req.body.userPhoto;

    // Run SQL statement to insert new message - ??'s are replaced by values in .run (username, message, likes, userPhoto)
    const newMessage = db
      .prepare(`INSERT INTO messages (username, message, likes, userPhoto) VALUES (?,?,?,?)`)
      .run(username, message, likes, userPhoto);
    res.status(200).json({ response: newMessage });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Update message in the database
app.put("/messages/:id", (req, res) => {
  console.log(req.params, req.body);
  try {
    const id = req.params.id;
    const username = req.body.username;
    const message = req.body.message;
    const likes = req.body.likes;
    const userPhoto = req.body.userPhoto;

    const updateMessage = db
      .prepare(`UPDATE messages SET username = ?, message = ?, likes = ?, userPhoto = ? WHERE id = ?`)
      .run(username, message, likes, userPhoto, id);
    res.status(200).json({ response: updateMessage });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Delete message from database
app.delete("/messages/:id", (req, res) => {
  try {
    const id = req.params.id;
    const deletedMessage = db.prepare(`DELETE FROM messages WHERE id = ?`).run(id);
    res.status(200).json({ response: deletedMessage });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Server listening on defined port
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
