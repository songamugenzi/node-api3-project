const express = require("express");

const userRouter = require("../users/userRouter.js");
const postRouter = require("../posts/postRouter.js");

const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  const motd = process.env.MOTD || "Hello World!";
  res.status(200).json({ api: "up", motd: motd });
});

router.use("/users", userRouter);
router.use("/posts", postRouter);

router.use(errorHandler);

function errorHandler(error, req, res, next) {
  // do something with error before responding
  // like saving it to a database, sending a mail to the admin
  // or using an external logging service
  res.status(500).json(error.message);
}

module.exports = router;
