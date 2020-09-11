const express = require("express");

const UserDb = require("../users/userDb.js");
const PostDb = require("../posts/postDb.js");

const router = express.Router();

// CREATE & post new user //
router.post("/", validateUser, (req, res) => {
  UserDb.insert(req.body)
    .then((user) => {
      res.status(201).json({ user });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "error adding new user" });
    });
});

// CREATE & post new post to specific user //
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  PostDb.insert(req.body)
    .then((post) => {
      res.status(201).json({ post });
    })
    .catch((error) => {
      console.log((error) => {
        res.status(500).json({ error: "error adding new post" });
      });
    });
});

// READ & get list of users //
router.get("/", (req, res) => {
  UserDb.get()
    .then((userList) => {
      res.status(200).json({ userList });
    })
    .catch((error) => {
      console.log(error);
    });
});

// READ & get specific user //
router.get("/:id", validateUserId, (req, res) => {
  const validUser = req.user;
  res.status(200).json({ validUser });
});

// READ & get list of specific user's posts //
router.get("/:id/posts", validateUserId, (req, res) => {
  UserDb
    .getUserPosts(req.user.id)
    .then((posts) => [res.status(200).json({ posts })])
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "error retrieving posts" });
    });
});

// DELETE specific user //
router.delete("/:id", validateUserId, (req, res) => {
  const deleteUser = req.params.id;
  UserDb.remove(deleteUser)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "user successfully deleted" });
      } else {
        res
          .status(404)
          .json({ message: "user with the specified ID does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "user could not be removed" });
    });
});

// UPDATE & put new user changes in the database //
router.put("/:id", validateUserId, (req, res) => {
  const changes = req.body;
  const updatedUser = req.params.id;

  if (!changes.name) {
    res.status(400).json({ message: "Please provide name" });
  }
  UserDb.update(updatedUser, changes)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ count, message: "user successfully updated" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "user could not be updated" });
    });
});

// CUSTOM MIDDLEWARE //

function validateUserId(req, res, next) {
  const id = req.params.id;
  UserDb.getById(id)
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        req.user = user;
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error retrieving the user from the database",
      });
    });
}

function validateUser(req, res, next) {
  const body = req.body;
  if (!body) {
    res.status(400).json({ message: "missing user data" });
  } else {
    if (!body.name) {
      res.status(400).json({ message: "missing required name field" });
    } else {
      next();
    }
  }
}

function validatePost(req, res, next) {
  const body = req.body;
  if (!body) {
    res.status(400).json({ message: "missing post data" });
  } else {
    if (!body.text || !body.user_id) {
      res.status(400).json({ message: "missing required fields" });
    } else {
      next();
    }
  }
}

module.exports = router;
