import sqlite3 from "sqlite3";
import { hashPassword } from "./PasswordUtils.js";

const DBSOURCE = "DataScience.sqlite";

const CREATE_DETAIL_QUERY =
  "INSERT INTO data_science (name, email, phone, organization, nature_of_work, description,    data_collection_method, data_format, data_update_frequency, ethics_approval, collaboration, financial_support ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

const CREATE_USER_QUERY =
  "INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)";

const CREATE_RECEPIENT_QUERY =
  "INSERT INTO recepients (first_name, last_name, email) VALUES (?,?,?)";

const UPDATE_RECEPIENT_QUERY =
  "UPDATE recepients set first_name= ?, last_name = ?, email = ? WHERE id = ?";

const DELETE_RECEPIENT_QUERY = "DELETE from recepients WHERE id = ?";

const SEARCH_USER_BY_EMAIL =
  "SELECT first_name, last_name, email, password FROM users WHERE email= ?";

const SEARCH_RECEPIENT_BY_EMAIL =
  "SELECT first_name, last_name, email FROM recepients WHERE email= ?";

const CREATE_USERS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name text,
    last_name text,
    email text UNIQUE,
    password text
    )`;

const CREATE_RECEPIENTS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS recepients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name text,
      last_name text,
      email text UNIQUE
      )`;

const CREATE_DETAILS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS data_science (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text,
    organization text,
    email text,
    phone text,
    nature_of_work text,
    description text,
    data_collection_method text,
    data_format text,
    data_update_frequency text,
    ethics_approval text,
    collaboration text,
    financial_support text,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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
};

const DEFAULT_RECEPIENT = {
  first_name: process.env.DEFAULT_USER_FIRST_NAME,
  last_name: process.env.DEFAULT_USER_LAST_NAME,
  email: process.env.DEFAULT_RECEPIENT,
};

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
    createRecepientsTable(db);
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
  console.log("Creating user table");
  databaseObject.run(CREATE_USERS_TABLE_QUERY, function (err, result) {
    if (err) {
      dbErrorHandler(err);
      return;
    }
    console.log("Creating user table - Completed");

    createDefaultUser(databaseObject);
  });
};

/**
 * Creates recepients table and adds default recepient
 * @param  databaseObject
 * @returns
 */
const createRecepientsTable = (databaseObject) => {
  console.log("Creating recepients table");
  databaseObject.run(CREATE_RECEPIENTS_TABLE_QUERY, function (err, result) {
    if (err) {
      dbErrorHandler(err);
      return;
    }
    console.log("Creating recepients table - Completed");

    createDefaultRecepient(databaseObject);
  });
};
/**
 * Creates default user if not exists
 * @param {*} databaseObject
 * @returns User with Email - ${DEFAULT_USER.email} already exists.
 */
const createDefaultUser = (databaseObject) => {
  databaseObject.get(
    SEARCH_USER_BY_EMAIL,
    [DEFAULT_USER.email],
    (error, row) => {
      if (row) {
        console.log(`User with Email - ${DEFAULT_USER.email} already exists.`);
        return;
      } else {
        console.log("Creating default user");
        const params = Object.values(DEFAULT_USER);
        databaseObject.run(CREATE_USER_QUERY, params, dbErrorHandler);
        console.log("Creating default user - Completed");
      }
    }
  );
};

const createDefaultRecepient = (databaseObject) => {
  databaseObject.get(
    SEARCH_RECEPIENT_BY_EMAIL,
    [DEFAULT_RECEPIENT.email],
    (error, row) => {
      if (row) {
        console.log(
          `Recepient with Email - ${DEFAULT_RECEPIENT.email} already exists.`
        );
      } else {
        console.log("Creating default recepient");
        const params = Object.values(DEFAULT_RECEPIENT);
        databaseObject.run(CREATE_RECEPIENT_QUERY, params, dbErrorHandler);
        console.log("Creating default recepient - Completed");
      }
    }
  );
};

export {
  db,
  CREATE_DETAIL_QUERY,
  CREATE_RECEPIENT_QUERY,
  UPDATE_RECEPIENT_QUERY,
  DELETE_RECEPIENT_QUERY,
  SEARCH_USER_BY_EMAIL,
};
