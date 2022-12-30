const express = require("express");
const deviceController = require("../controllers/device.controller");
const userController = require("../controllers/user.controller");
const historycontroller = require("../controllers/history.controller");

const router = express.Router();

//User Controller
router.post("/register/user", userController.createUser);

//Device Controller
router.post("/register/device", deviceController.createDevice);

//History Controller
router.get("/getUserHistory",historycontroller.getHistory);

module.exports = router;