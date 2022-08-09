import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import timelineRoutes from "./routes/timelineRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(timelineRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`))

