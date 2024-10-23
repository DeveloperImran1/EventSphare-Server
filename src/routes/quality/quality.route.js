
const express = require("express");
const { geAllQuality } = require("../../controller/quality/quality.controller");


const router = express.Router();

router.get("/geAllQuality", geAllQuality);



module.exports = router;