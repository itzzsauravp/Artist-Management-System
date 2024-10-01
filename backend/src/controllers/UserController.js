import jwt from "jsonwebtoken";
import generateJWT from "../utils/generateJWT.js";
class UserController {
  constructor(connection) {
    this.connection = connection;
  }

  addUser = async (req, res) => {
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
    try {
      const query = `INSERT INTO user(first_name, last_name, email, password, role_type, phone, dob, gender, address) VALUES ("${first_name}", "${last_name}", "${email}", "${password}", "${role_type}", "${phone}", "${dob}", "${gender}", "${address}")`;
      const [result, fields] = await this.connection.query(query);
      if (result) {
        res.json(result);
      } else {
        res.json({ success: false, message: "No result from the query!!" });
      }
    } catch (err) {
      res.status(404).json({ success: false, message: err });
    }
  };

  userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const query = `SELECT * FROM USER where email="${email}"`;
      const [result, fields] = await this.connection.query(query);
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
  };

  deleteUser = async (req, res) => {
    const { id } = req.params;
    const { role_type } = req.tokenPayload;
    if (role_type === "super_admin") {
      try {
        const query = `DELETE FROM user WHERE id=${id}`;
        const [result] = await this.connection.query(query);
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
  };

  updateUser = async (req, res) => {
    const updateItemObject = {};
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
    } else {
      const updateItemArray = Object.entries(updateItemObject).map(
        ([key, value]) => `${key}="${value}"`
      );
      const roleType = req.tokenPayload.role_type;
      if (roleType === "super_admin") {
        try {
          const query = `UPDATE user SET ${updateItemArray.join(
            ", "
          )} WHERE id=${id}`;
          const [result, feild] = await this.connection.query(query);
          res.json({
            success: true,
            message: result,
          });
        } catch {
          res.json({ success: false, message: "Query error" });
        }
      } else {
        res.json({
          success: false,
          message: "This action is only available to super_admins",
        });
      }
    }
  };

  getAllUsers = async (req, res) => {
    const { id } = req.tokenPayload;
    if (id) {
      const query = `SELECT id, first_name, last_name, email, phone, dob, gender, address, role_type FROM user`;
      try {
        const [result, field] = await this.connection.query(query);
        if (result.length > 0) {
          res.send(result);
        } else {
          res.json({ success: true, message: "No users available" });
        }
      } catch {
        res.json({ success: false, message: "couldnot get any result" });
      }
    }
  };

  searchUser = async (req, res) => {
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

          const [result] = await this.connection.query(query);
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
  };

  validateToken = async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res
          .status(400)
          .json({ success: false, message: "No token provided" });
      }
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      return res
        .status(200)
        .json({ success: true, isValid: true, user: decode });
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
  };
}
export default UserController;
