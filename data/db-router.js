const express = require("express");

const Posts = require("./db");

const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
});

router.post("/", (req, res) => {
  if (req.body.title === "" || req.body.contents === "") {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The post has been nuked" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error removing the post"
      });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  Posts.update(req.params.id, changes)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error updating the post"
      });
    });
});

router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "error getting post comments." });
    });
});

router.post("/:id/comments", (req, res) => {
  if (req.body.text === "") {
    req
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
  Posts.insertComment(req.body)
    .then(comment => {
      res.status(201).json(comment);
    })
    .catch(err => {
      res
        .status(500)
        .json({
          error: "There was an error while saving the comment to the database"
        });
    });
});

module.exports = router;
