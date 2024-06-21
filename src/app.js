const express = require("express");
const http = require("http");
require("dotenv").config({ path: "./.env" });

const restApiServer = require("./server");

const app = express();
const server = http.createServer(app);

restApiServer(app);

const host = process.env.HOST;
const port = process.env.PORT;

const running = () =>
  console.log(`Server is running at http://${host}:${port}`,'\n');

server.listen(port, host, running);
