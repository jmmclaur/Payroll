/*const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); */

import path from "path";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dragonItemsRouter from "./routes/dragonItems.js";

const { PORT = 3001, BASE_PATH } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mynewdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use("/dragonItem", dragonItemsRouter);

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log("Link to the server");
  console.log(BASE_PATH);
});
