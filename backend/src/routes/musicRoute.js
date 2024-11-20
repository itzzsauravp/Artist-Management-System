import { Router } from "express";
import MusicController from "../controllers/MusicController.js";
import connectionFunction from "../config/connection.js";

const musicRouter = Router();
(async () => {
  try {
    const connection = await connectionFunction();
    const musicControllerInstance = new MusicController(connection);

    // routes for music goes here...
  } catch (error) {
    console.error("Failed to initialize UserController:", error);
  }
})();

export default musicRouter;
