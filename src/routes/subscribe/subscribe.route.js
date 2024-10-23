const express = require("express");
const { createOrder, getAllOrder, getOrderById, myAllOrder, refundRequest, createPayment, metricsForAdminChart, monthlyMetrics ,getSingleOrder } = require("../../controller/order/order.controller");
const { createSubscribeStripe, createSubscribe } = require("../../controller/subscribe/subscribe.controller");

const router = express.Router();




router.post("/subscribe", createSubscribe);
router.post("/payment-stripe", createSubscribeStripe);




module.exports = router;