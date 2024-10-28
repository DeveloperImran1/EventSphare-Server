// const mongoose = require("mongoose");

// const MessageSchema = new mongoose.Schema(
//     {
//         conversationId: {
//             type: String,
//         },
//         sender: {
//             type: String,
//         },
//         text: {
//             type: String,
//         },
        
//     },
//     { timestamps: true }
// );

// const Message = mongoose.model("message", MessageSchema);
// module.exports = Message;

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reciverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
