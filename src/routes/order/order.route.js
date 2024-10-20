const express = require("express");
const { createOrder, getAllOrder, myAllOrder, refundRequest,getOrganizerOrder } = require("../../controller/order/order.controller");
const router = express.Router();




router.post("/orders", createOrder);
router.get("/orders", getAllOrder);
router.get("/organizer-orders/:email", getOrganizerOrder);
router.get("/myAllOrder/:email", myAllOrder);
router.put("/refundRequest/:id", refundRequest);



module.exports = router;