const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
        },
        sender: {
            type: String,
        },
        text: {
            type: String,
        },
        
    },
    { timestamps: true }
);

const Message = mongoose.model("message", MessageSchema);
module.exports = Message;