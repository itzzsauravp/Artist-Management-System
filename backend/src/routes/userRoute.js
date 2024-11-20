// src/routes/userRoutes.js
import { Router } from "express";
import UserController from "../controllers/UserController.js";
import validateTokenBE from "../middlewares/validateTokenBE.js";
import connectionFunction from "../config/connection.js";

const userRouter = Router();
try {
  const connection = await connectionFunction();
  const userControllerInstance = new UserController(connection);

  userRouter.post("/add", (req, res) =>
    userControllerInstance.addUser(req, res)
  );
  userRouter.post("/login", (req, res) =>
    userControllerInstance.userLogin(req, res)
  );
  userRouter.delete("/delete/:id", validateTokenBE, (req, res) =>
    userControllerInstance.deleteUser(req, res)
  );
  userRouter.put("/update/:id", validateTokenBE, (req, res) =>
    userControllerInstance.updateUser(req, res)
  );
  userRouter.post("/all", validateTokenBE, (req, res) =>
    userControllerInstance.getAllUsers(req, res)
  );
  userRouter.post("/search", (req, res) =>
    userControllerInstance.searchUser(req, res)
  );
  userRouter.post("/validate-token", (req, res) =>
    userControllerInstance.validateToken(req, res)
  );
} catch (error) {
  console.error("Failed to initialize UserController:", error);
}

export default userRouter;
