import jwt from "jsonwebtoken";
import "dotenv/config";
export default (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });

  return token;
};
