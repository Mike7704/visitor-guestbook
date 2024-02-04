import Database from "better-sqlite3";

// Seed our database with some initial data

// Hook up our database.db to get methods
const db = new Database("database.db");

// Executes SQL query
db.exec(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    message TEXT,
    likes INTEGER,
    userPhoto TEXT
)`);

// Insert test data to database
db.exec(`
    INSERT into messages (username, message, likes, userPhoto)
    VALUES
    ('Yoda', 'Do, or do not. There is no try.', 0, 'https://i.pinimg.com/236x/65/16/96/6516965696fd9baf29f93eaa960cee48.jpg'),
    ('Homer Simpson', 'hmm...donuts 🍩', 0, 'https://i.pinimg.com/236x/13/66/11/136611a058d2fde8974f84bdc2e1b309.jpg'),
    ('Peter Griffin', 'I have an idea so smart that my head would explode if I even began to know what I’m talking about.', 0, 'https://i.pinimg.com/236x/0c/3c/b8/0c3cb8012f92f53b297c5ee06120d13f.jpg')
`);
