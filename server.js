import express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Message from "./Message.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json()); //middleware to parse JSON format of the frontend, from latest versions built-in the express library, no need to import bodyParser library
app.use(cors());

const mongoUri = process.env.CONNECTION_URI || "";

mongoose.connect(mongoUri);
mongoose.connection.on("connected", () =>
  console.log("connected to the cluster")
);

mongoose.connection.on("error", () =>
  console.log("error occured while connecting to the cluster")
);

app.get("/", (req, res) => {
  res.send("Welcome to my portfolio");
});

app.post("/send-msg", async (req, res) => {
  const { senderName, senderEmail, senderMsg } = req.body;
  const message = await Message.create({
    name: senderName,
    email: senderEmail,
    message: senderMsg,
  })
    .then((data) => {
      if (data._id) {
        const strToWrite =
          senderName + ";\t" + senderEmail + ";\t" + senderMsg + "\n";
        //writing message info to file
        fs.writeFile("messages.txt", strToWrite, { flag: "a" }, (err) => {
          if (err) {
            //   console.log(strToWrite);
            res.status(400).json("was not sent to file");
          } else {
            res.status(200).json("message sent");
          }
        });
      } else res.status(400).json("was not sent to DB");
    })
    .catch((err) => res.status(400).json("was not sent DB"));
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
