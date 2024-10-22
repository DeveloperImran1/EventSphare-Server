
const express = require("express");
const router = express.Router();
const {getPieChartData, getAreaChartData, getWaveChartData } = require("../../controller/stats/organizerStats");


router.get("/organizer-stats/:email", getAreaChartData);
router.get("/organizer-pieChart/:email", getPieChartData);
router.get("/organizer-waveChart/:email",getWaveChartData);




module.exports = router;