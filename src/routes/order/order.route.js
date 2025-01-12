const express = require("express");

const { createOrder, getOrderById, refundRequest, createPayment, metricsForAdminChart, monthlyMetrics ,getSingleOrder, getOrganizerOrder, myAllOrder, getAllOrders } = require("../../controller/order/order.controller");

const router = express.Router();



router.get("/orders", getAllOrders);
router.post("/orders", createOrder);
router.post("/payment", createPayment);
router.get("/organizer-orders/:email", getOrganizerOrder);
router.get("/orders/:transitionId", getSingleOrder);
router.get("/ordersByGmail/:gmail", getOrderById);
router.get("/metricsForAdminChart", metricsForAdminChart);
router.get("/monthlyMetrics", monthlyMetrics);
router.get("/myAllOrder/:email", myAllOrder);
router.put("/refundRequest/:id", refundRequest);



module.exports = router;