const express = require("express");

const PostDb = require("../posts/postDb.js");

const router = express.Router();

// READ & get list of posts //
router.get("/", (req, res) => {
  PostDb.get()
    .then((postList) => {
      res.status(200).json({ postList });
    })
    .catch((error) => {
      console.log(error);
    });
});

// READ & get specific post //
router.get("/:id", validatePostId, (req, res) => {
  const validPost = req.post;
  res.status(200).json({ validPost });
});

// DELETE specific post //
router.delete("/:id", validatePostId, (req, res) => {
  const deletePost = req.params.id;
  PostDb.remove(deletePost)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "post successfully deleted" });
      } else {
        res
          .status(404)
          .json({ message: "post with the specified ID does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "post could not be removed" });
    });
});

// UPDATE & put new post changes in the database //
router.put("/:id", validatePostId, (req, res) => {
  const changes = req.body;
  const updatedPost = req.params.id;

  if (!changes.text) {
    res.status(400).json({ message: "Please provide text" });
  }
  PostDb.update(updatedPost, changes)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ count, message: "post successfully updated" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "post could not be updated" });
    });
});

// CUSTOM MIDDLEWARE //

function validatePostId(req, res, next) {
  const { id } = req.params;
  PostDb.getById(id)
    .then((post) => {
      if (!post) {
        res.status(400).json({ message: "invalid post id" });
      } else {
        req.post = post;
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error retrieving the post from the database",
      });
    });
}

module.exports = router;
