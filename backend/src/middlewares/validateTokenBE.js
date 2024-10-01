import "dotenv/config";
import jwt from "jsonwebtoken";
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

export default validateTokenBE;
