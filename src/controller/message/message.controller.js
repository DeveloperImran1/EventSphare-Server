const { ObjectId } = require("mongodb");
const Message = require("../../models/Message");


// message post korbo
const message = async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        console.log(savedMessage)
        res.status(200).json(savedMessage)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// conversation id dia message get korbo
const getMessages = async (req, res) => {
    const conversationId = req.params.conversationId;
    console.log(conversationId)
    try {
        const messages = await Message.find({
            conversationId: conversationId
        })
        res.status(200).json(messages)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { message, getMessages };



