const express = require("express");
const router = express.Router();

const { getSingleUser, createUser, updateUser, beOrganizer, getOrganizerRequest, getUserRollUpdatedId, userRollUpdate, organizerRequestCancel, getAllUser, blockUser, addedFollower, updateUserReviw, updateNotification } = require("../../controller/user/user.controller");



router.get("/user", getAllUser);
router.get("/user/:email", getSingleUser);
router.get("/userRollUpdated/:id", getUserRollUpdatedId);
router.put("/userRollUpdated/:id", userRollUpdate);
router.put("/blockedUser/:id", blockUser);
router.put("/organizingRequestCancel/:id", organizerRequestCancel);
router.post("/user", createUser);
router.put("/user/:email", updateUser);
router.patch("/notification/:email", updateNotification);
router.put("/beOrganizer/:email", beOrganizer);
router.get("/organizerRequest", getOrganizerRequest)
router.put("/userAddedFollower", addedFollower);
router.put("/updateUserReviw/:email", updateUserReviw);


module.exports = router;