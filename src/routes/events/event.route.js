const express = require("express");
const { createEvent, getAllEvent, getSingleEvent, getMyEvent, getCategoryEvent,getBookedSeatUpdate ,getPopularEvents,getReviewUpdate} = require("../../controller/event/event.controller");



const router = express.Router();

router.post("/", createEvent);
router.get("/", getAllEvent);
router.get("/popular-events", getPopularEvents);
router.get("/:id", getSingleEvent);
router.patch("/:id", getBookedSeatUpdate);
router.post("/:id", getReviewUpdate);
router.get("/getMyEvent/:email", getMyEvent);
router.get("/getCategoryEvent/:category", getCategoryEvent);


module.exports = router;
