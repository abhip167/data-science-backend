import sqlite3 from "sqlite3";

const DBSOURCE = "DataScience.sqlite";

const CREATE_DETAIL_QUERY =
  "INSERT INTO data_science (name, email, phone, nature_of_work, description) VALUES (?,?,?, ?, ?)";

const CREATE_DETAILS_TABLE_QUERY = `CREATE TABLE data_science (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    email text,
    phone text,
    nature_of_work text,
    description text,
    )`;

const CREATE_FILES_TABLE_QUERY = `CREATE TABLE data_science_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name text,
    description text,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY(user_id) REFERENCES data_science(id)
    )`;

const dbErrorHandler = (err) => (err ? console.log(err) : null);

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    dbErrorHandler();
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    createDetailsTable(db);
    createFilesTable(db);
  }
});

const createDetailsTable = (databaseObject) =>
  databaseObject.run(CREATE_DETAILS_TABLE_QUERY, dbErrorHandler);
const createFilesTable = (databaseObject) =>
  databaseObject.run(CREATE_FILES_TABLE_QUERY, dbErrorHandler);

export { db, CREATE_DETAIL_QUERY };
