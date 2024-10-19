const express = require("express");
// const { createOrder, getAllOrder, myAllOrder, refundRequest,createPayment,getSingleOrder } = require("../../controller/order/order.controller");
const { createOrder, getAllOrder, getOrderById, myAllOrder, refundRequest, createPayment, metricsForAdminChart, monthlyMetrics ,getSingleOrder } = require("../../controller/order/order.controller");

const router = express.Router();




router.post("/orders", createOrder);
router.post("/payment", createPayment);
router.get("/orders", getAllOrder);
router.get("/orders/:transitionId", getSingleOrder);
router.get("/orders/:gmail", getOrderById);
router.get("/metricsForAdminChart", metricsForAdminChart);
router.get("/monthlyMetrics", monthlyMetrics);
router.get("/myAllOrder/:email", myAllOrder);
router.put("/refundRequest/:id", refundRequest);



module.exports = router;