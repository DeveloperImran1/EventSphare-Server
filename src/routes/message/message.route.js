const express = require("express");
const { message, getMessages } = require("../../controller/message/message.controller");

const router = express.Router();


router.post("/message", message);
router.get("/getMessages/:conversationId", getMessages);


module.exports = router;
