import express, { query } from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import generateJWT from "./src/utils/generateJWT.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
const app = express();
let connection;

//middlewars builtin
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//middleware
const validateTokenBE = (req, res, next) => {
  const { token } = req.body;
  if (token) {
    try {
      const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.tokenPayload = tokenPayload;
      next();
    } catch {
      res.json({ success: false, message: "Invalid Token" });
    }
  } else {
    res.json({ success: false, message: "No token found" });
  }
};

//may be change the alter the user table and make the dob DATE instead of DATETIME
app.post("/user/add", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    role_type,
    password,
    phone,
    dob,
    gender,
    address,
  } = req.body;
  const query = `INSERT INTO user(first_name, last_name, email, password, role_type, phone, dob, gender, address) VALUES ("${first_name}", "${last_name}", "${email}", "${password}", "${role_type}", "${phone}", "${dob}", "${gender}", "${address}")`;
  const [result, fields] = await connection.query(query);
  if (result) {
    res.json(result);
  } else {
    res.json({ success: false, message: "No result from the query!!" });
  }
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM USER where email="${email}"`;
  try {
    const [result, fields] = await connection.query(query);
    const [userInfo] = [...result];
    const savedEmail = userInfo.email;
    const savedPassword = userInfo.password;
    if (email === savedEmail && password === savedPassword) {
      const token = generateJWT({
        id: userInfo.id,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        role_type: userInfo.role_type,
      });
      res.json({
        success: true,
        message: "The email and password matches",
        token,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        role_type: userInfo.role_type,
      });
    } else if (email === savedEmail || password === savedPassword) {
      res.status(200).json({ success: false, message: "Invalid password" });
    }
  } catch (err) {
    res.status(404).json({ success: false, message: "Email doesnot exist" });
  }
});

app.delete("/user/delete/:id", validateTokenBE, async (req, res) => {
  const { id } = req.params;
  const { role_type } = req.tokenPayload;
  if (role_type === "super_admin") {
    try {
      const query = `DELETE FROM user WHERE id=${id}`;
      const [result] = await connection.query(query);
      if (result.affectedRows == 0) {
        res.send("Nothing changed");
      } else {
        res.send(result);
      }
    } catch {
      res.json({
        success: false,
        message: "Couldn't execute the query",
      });
    }
  } else {
    res.json({
      success: false,
      message: "This action is only available to super_admins",
    });
  }
});

app.put("/user/update/:id", async (req, res) => {
  const updateItemObject = {};
  const updateItemArray = [];
  const {
    first_name,
    last_name,
    email,
    role_type,
    phone,
    dob,
    gender,
    address,
  } = req.body;

  const { id } = req.params;

  if (first_name && first_name.trim() !== "") {
    updateItemObject.first_name = first_name;
  }

  if (last_name && last_name.trim() !== "") {
    updateItemObject.last_name = last_name;
  }

  if (email && email.trim() !== "") {
    updateItemObject.email = email;
  }

  if (role_type && role_type.trim() !== "") {
    updateItemObject.role_type = role_type;
  }

  if (phone && phone.trim() !== "") {
    updateItemObject.phone = phone;
  }

  if (dob && dob.trim() !== "") {
    updateItemObject.dob = dob;
  }

  if (gender && gender.trim() !== "") {
    updateItemObject.gender = gender;
  }

  if (address && address.trim() !== "") {
    updateItemObject.address = address;
  }

  if (Object.keys(updateItemObject).length === 0) {
    return res.status(400).json({ error: "No valid changes provided" });
  }

  for (const [key, value] of Object.entries(updateItemObject)) {
    updateItemArray.push(`${key}="${value}"`);
  }

  const updateItemArrayToString = updateItemArray.join(", ");

  try {
    const query = `UPDATE user SET ${updateItemArrayToString} WHERE id=${id}`;
    const [result, feild] = await connection.query(query);
    res.json({
      success: true,
      message: { update: "done", info: updateItemObject },
    });
  } catch {
    res.json({ success: false, message: "Query error" });
  }
});

app.post("/user/all", validateTokenBE, async (req, res) => {
  const { id } = req.tokenPayload;
  if (id) {
    const query = `SELECT id, first_name, last_name, email, phone, dob, gender, address, role_type FROM user`;
    try {
      const [result, field] = await connection.query(query);
      if (result.length > 0) {
        res.send(result);
      } else {
        res.json({ success: true, message: "No use available" });
      }
    } catch {
      res.json({ success: false, message: "couldnot get any result" });
    }
  }
});

// idk why i did this was just testing my js skills with this one
app.post("/user/search", async (req, res) => {
  const { searchQuery } = req.body;
  const whereClause = [];

  if (searchQuery && searchQuery.trim() !== "") {
    const formattedQuery = searchQuery.trim();
    const arrRep = formattedQuery.split(",");

    // Parse searchQuery into object
    arrRep.forEach((elem) => {
      const splitElement = elem.split(":");
      if (splitElement.length === 2) {
        const key = splitElement[0].trim();
        const value = `%${splitElement[1].trim()}%`;
        whereClause.push(`${key} LIKE "${value}"`);
      }
    });

    if (whereClause.length > 0) {
      try {
        const query = `SELECT id, first_name, last_name, email, phone, dob, gender, address, role_type
        FROM user
        WHERE ${whereClause.join(" AND ")}`;

        const [result] = await connection.query(query);
        if (result.length > 0) {
          res.send(result);
        } else {
          res.json({ success: true, message: "No such user available" });
        }
      } catch (error) {
        console.error("Query error:", error);
        res.json({ success: false, message: "Couldn't get the result" });
      }
    } else {
      res.json({
        success: false,
        message: "No valid search parameters provided.",
      });
    }
  } else {
    res.json({ success: false, message: "Search query cannot be empty." });
  }
});

app.post("/user/validate-token", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, isValid: true, user: decode });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

app.listen(8000, async () => {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "artistmanagementsys",
      password: "fenrir2003",
    });
    console.log("server started at port 8000\nconnnected to the database");
  } catch (err) {
    console.log(err);
  }
});
