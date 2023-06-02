const express = require("express");
router = express.Router();
const flightCtrl = require("../controller/flightSearch.controller");

router.post("/search", flightCtrl.flightSearch);

module.exports = router;
