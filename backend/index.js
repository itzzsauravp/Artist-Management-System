import express from "express";
import cors from "cors";
import "dotenv/config";
import connectionFunction from "./src/config/connection.js";
import userRouter from "./src/routes/userRoute.js";
import artistRouter from "./src/routes/artistRoute.js";
import musicRouter from "./src/routes/musicRoute.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/user", userRouter);
app.use("/artist", artistRouter);
app.use("/music", musicRouter);

app.listen(8000, async () => {
  const connection = await connectionFunction();
});
