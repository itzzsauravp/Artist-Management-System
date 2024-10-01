import { Router } from "express";
import ArtistController from "../controllers/ArtistController.js";
import connectionFunction from "../config/connection.js";
const artistRouter = Router();
(async () => {
  try {
    const connection = await connectionFunction();
    const artistControllerInstance = new ArtistController(connection);

    artistRouter.post("/add", (req, res) =>
      artistControllerInstance.addArtist(req, res)
    );
    artistRouter.put("/update/:id", (req, res) =>
      artistControllerInstance.updateArtist(req, res)
    );
    artistRouter.delete("/delete/:id", (req, res) =>
      artistControllerInstance.deleteArtist(req, res)
    );
    artistRouter.get("/search", (req, res) =>
      artistControllerInstance.searchArtist(req, res)
    );
    artistRouter.get("/all", (req, res) =>
      artistControllerInstance.getAllArtist(req, res)
    );
  } catch (error) {
    console.error("Failed to initialize UserController:", error);
  }
})();

export default artistRouter;
