
const mongoose = require("mongoose");

// Define the schema for user
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profile_picture: {
    type: String,
    required: true
  }
});

// Define the schema for comments
const commentSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Define the schema for the main post
const postSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true
  },
  content: {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    media: {
      type: [String] // Array of URLs for media
    }
  },
  reactions: {
    love: {
      type: Number,
      default: 0
    }
  },
  comments: [commentSchema], // Array of comments
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;

