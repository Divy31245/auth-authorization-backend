import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/authRoutes.js";
import router from "./routes/userRoutes.js";


dotenv.config();
const port = process.env.PORT; 
const str = process.env.DB_URL;
mongoose.connect(str); 
// mongoose.set("strictQuery",true)

const app = express();

// async function run() {
//   try {
//     // create an array of documents to insert
//     const docs = [{ name: "user" }, { name: "mod" }, { name: "admin" }];
//     // this option prevents additional documents from being inserted if one fails
//     const result = await roleSchema.insertMany(docs);
//     console.log(`${result.insertedCount} documents were inserted`);
//   } catch(error){
//     console.log(error)
//   }
// }
// run().catch(console.dir) 

app.use(bodyParser.json({ limit: "50mb", extended: "true" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: "true" }));
app.use(express.json());
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api",router)

app.listen(port, () => console.log(`app is running on port ${port}`));
