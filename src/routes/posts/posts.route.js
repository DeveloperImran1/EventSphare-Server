
const express = require("express");
const { getAllPost, createPost, addedComment, addedReact, deletePost } = require("../../controller/post/post.controller");
const { getUserPosts } = require("../../controller/post/post.controller");



const router = express.Router();

router.get("/getAllPost", getAllPost);
router.get("/getUserPosts/:email", getUserPosts);
router.post("/createPost", createPost);
router.post("/addedComment/:id", addedComment);
router.put("/addedReact/:id", addedReact);
router.delete("/deletePost/:id", deletePost);


module.exports = router;
