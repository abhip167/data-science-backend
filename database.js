import sqlite3 from "sqlite3";
import { hashPassword } from "./PasswordUtils.js";

const DBSOURCE = "DataScience.sqlite";

const CREATE_DETAIL_QUERY =
  "INSERT INTO data_science (name, email, phone, nature_of_work, description) VALUES (?,?,?,?,?)";

const CREATE_USER_QUERY =
  "INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)";

const SEARCH_USER_BY_EMAIL = "SELECT first_name, last_name, email, password FROM users WHERE email= ?";

const CREATE_USERS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name text,
    last_name text,
    email text UNIQUE,
    password text
    )`;

const CREATE_DETAILS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS data_science (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    email text,
    phone text,
    nature_of_work text,
    description text
    )`;

const CREATE_FILES_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS data_science_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name text,
    description text,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES data_science(id)
    )`;

const DEFAULT_USER = {
  first_name: process.env.DEFAULT_USER_FIRST_NAME,
  last_name: process.env.DEFAULT_USER_LAST_NAME,
  email: process.env.DEFAULT_USER_EMAIL,
  password: hashPassword(process.env.DEFAULT_USER_PASSWORD),
}

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
    createUsersTable(db);
  }
});

const createDetailsTable = (databaseObject) =>
  databaseObject.run(CREATE_DETAILS_TABLE_QUERY, dbErrorHandler);
const createFilesTable = (databaseObject) =>
  databaseObject.run(CREATE_FILES_TABLE_QUERY, dbErrorHandler);

/**
 * Creates users table and adds default user
 * @param  databaseObject 
 * @returns 
 */
const createUsersTable = (databaseObject) => {
  console.log("Creating user table")
  databaseObject.run(CREATE_USERS_TABLE_QUERY, function (err, result) {
    if (err) {
      dbErrorHandler()
      return;
    }
    console.log("Creating user table - Completed")

    createDefaultUser(databaseObject);
  });
}


const createDefaultUser =  (databaseObject) => {

  databaseObject.get(SEARCH_USER_BY_EMAIL, [DEFAULT_USER.email], (error, row) => {
    if (row) {
      console.log(`User with Email - ${DEFAULT_USER.email} already exists.`)

    } else {
      console.log("Creating default user")
      const params = Object.values(DEFAULT_USER);
      databaseObject.run(CREATE_USER_QUERY, params, dbErrorHandler)
      console.log("Creating default user - Completed")
    }

  })


}

export { db, CREATE_DETAIL_QUERY, SEARCH_USER_BY_EMAIL };
