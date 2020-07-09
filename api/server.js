const express = require("express");
const helmet = require("helmet");

// const userRouter = require("./users/userRouter.js");
// const postRouter = require("./posts/postRouter.js");

const apiRouter = require("./api-router.js")

const server = express();
server.use(express.json());
server.use(logger);
server.use(helmet());

// server.use("/api/users", userRouter);
server.use("/api", apiRouter);

// server.get("/home", (req, res) => {
//   res.send(`<h2>Let's write some middleware!</h2>`);
// });

//custom middleware

function logger(req, res, next) {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date().toISOString(); // database time format (ISO format)
  next();
}

module.exports = server;
