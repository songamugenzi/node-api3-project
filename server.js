const express = require("express");

const userRouter = require("./users/userRouter.js");
const postRouter = require("./posts/postRouter.js");

const server = express();
server.use(express.json());
server.use(logger);

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

server.get("/home", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date().toISOString(); // database time format (ISO format)
  next();
}

module.exports = server;
