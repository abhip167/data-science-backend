import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import busyBoy from "connect-busboy";
import path from "path";
import fs from "fs-extra";

import { validate, userValidationRules } from "./validator.js";

import { db, CREATE_DETAIL_QUERY } from "./database.js";

const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

// Configure file upload middleware
app.use(
  busyBoy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  })
);

const uploadPath = path.join(process.cwd(), "fu/"); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

app.get("/", (req, res) => {
  res.status(403);
});

app.get("/details", (req, res) => {
  const sql = "select * from data_science";
  db.all(sql, [], function (err, rows) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      rows,
    });
  });
});

app.post("/details", userValidationRules(), validate, (req, res) => {
  console.log(req.body);
  const { name, email, phone, natureOfWork, description } = req.body;
  const params = [name, email, phone, natureOfWork, description, "[null]"];

  db.run(CREATE_DETAIL_QUERY, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      id: this.lastID,
    });
  });
});

/**
 * Create route /upload which handles the post request
 */
app.route("/upload").post((req, res, next) => {
  req.pipe(req.busboy); // Pipe it trough busboy

  req.busboy.on("file", (fieldname, file, filename) => {
    console.log(filename);
    console.log(fieldname);

    // Create a write stream of the new file
    const fstream = fs.createWriteStream(
      path.join(uploadPath, filename.filename)
    );
    // Pipe it trough
    file.pipe(fstream);

    // On finish of the upload
    fstream.on("close", () => {
      console.log(`Upload of '${filename.filename}' finished`);
      res.json({
        message: "success",
        id: 0,
      });
    });
  });
});

app.listen(3000);
console.log("Server started at", 3000);
