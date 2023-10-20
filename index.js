import express from "express";
import { initiateApp } from "./src/intiateApp.js";

import { config } from "dotenv";
import path from "path";
config({ path: path.resolve("./config/config.env") });

const app = express();
initiateApp(express, app);
 
