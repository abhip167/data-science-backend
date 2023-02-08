import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import busyBoy from "connect-busboy";
import path from "path";
import fs from "fs-extra";
import cors from "cors";
import jwt from "jsonwebtoken";

import auth from "./middleware/auth.js";

import {
  validate,
  userValidationRules,
  recepientValidationRules,
} from "./validator.js";

import {
  db,
  CREATE_DETAIL_QUERY,
  SEARCH_USER_BY_EMAIL,
  CREATE_RECEPIENT_QUERY,
  UPDATE_RECEPIENT_QUERY,
  DELETE_RECEPIENT_QUERY,
} from "./database.js";
import { sendAnEmail } from "./sendEmail.js";
import { comparePassword } from "./PasswordUtils.js";

const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(compression());

// Configure file upload middleware
app.use(
  busyBoy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  })
);

const uploadPath = path.join(process.cwd(), "data-files/"); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

app.get("/", (req, res) => {
  res.status(403);
});

app.get("/details", auth, (req, res) => {
  const sql =
    "select name, email, phone, nature_of_work, description, STRFTIME('%d/%m/%Y, %H:%M', timestamp) as timestamp from data_science";
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
  const params = [name, email, phone, natureOfWork, description];

  db.run(CREATE_DETAIL_QUERY, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    db.all("select email from recepients", [], function (err, rows) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        id: this.lastID,
      });

      const recepients = rows.map((row) => row.email);

      sendAnEmail({
        recepients,
        name,
        email,
        phone,
        natureOfWork,
        description,
      });
    });
  });
});

app.get("/recepients", auth, (req, res) => {
  const sql = "select * from recepients";
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

app.post(
  "/recepients",
  auth,
  recepientValidationRules(),
  validate,
  (req, res) => {
    console.log(req.body);
    const { first_name, last_name, email } = req.body;
    const params = [first_name, last_name, email];

    db.run(CREATE_RECEPIENT_QUERY, params, function (err, result) {
      if (err) {
        const { errno, message, code } = err;
        res.status(400).json({ error: { errno, message, code } });
        return;
      }
      res.json({
        message: "success",
        id: this.lastID,
      });
    });
  }
);

app.patch(
  "/recepients/:id",
  auth,
  recepientValidationRules(),
  validate,
  (req, res) => {
    console.log(req.body);
    const { first_name, last_name, email } = req.body;
    const params = [first_name, last_name, email, req.params.id];

    db.run(UPDATE_RECEPIENT_QUERY, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
      });
    });
  }
);

app.delete("/recepients/:id", auth, validate, (req, res) => {
  console.log(req.body);
  const params = [req.params.id];

  db.run(DELETE_RECEPIENT_QUERY, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } else if (this.changes == 0) {
      res
        .status(400)
        .json({ error: `Recepient with id ${req.params.id} not found` });
      return;
    }
    res.json({
      message: "success",
      id: this.lastID,
    });
  });
});

/**
 * User Login API - Login is only allowed for internal members.
 * In order to create new user create directly in the database as that was discussed in the meeting.
 */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Email and password are required.");
    }

    db.get(SEARCH_USER_BY_EMAIL, [email], async (error, user) => {
      if (error) {
        console.error(error);
        return res
          .status(400)
          .send(
            "Internal server occured. Please contact contact the administrator."
          );
      }

      const passwordMatch = await comparePassword(password, user.password);

      if (user && passwordMatch) {
        // Create token
        const token = jwt.sign(
          { user_id: user.id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "5h",
          }
        );

        // save user token
        user.token = token;

        // user
        return res.status(200).json(user);
      }

      return res.status(400).send("Invalid Credentials");
    });
  } catch {}
});

/**
 * Create route /upload which handles the post request
 */
app.route("/upload").post((req, res, next) => {
  req.pipe(req.busboy); // Pipe it trough busboy

  req.busboy.on("file", (fieldname, file, filename) => {
    console.log({ filename, fieldname, file });

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

app.listen(process.env.PORT || 3000);
console.log("Server started at", process.env.PORT || 3000);
