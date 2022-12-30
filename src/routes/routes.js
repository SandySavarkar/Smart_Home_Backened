// import express from 'express';
const express = require('express');
// import { getHardwareOnline } from '../controllers/registerHardwareControllers.js';
const deviceController = require('../controllers/device.controller');
const userController = require('../controllers/user.controller');
const historyController = require('../controllers/history.controller');

const router = express.Router();

router.post('/register/device', deviceController.deviceRegister);
router.get('/getAllDevice', deviceController.getDevices);
router.put('/updateDevice', deviceController.updateDevice);
router.put('/deleteDevice', deviceController.deleteDevice);
router.post('/register/user', userController.userRegister);
router.get('/getAllUsers', userController.getUsers);
router.get('/getMyDevice', userController.getUserDevice);
router.put('/deleteUser', userController.deleteUser);
router.put('/updatePin', deviceController.updateDevice);
router.put('/scheduleTime', deviceController.scheduleTime);
router.post('/getUserHistory', historyController.getHistory);
router.get('/availableDevices', deviceController.getAvailableDevice);

router.post('/addHistory', historyController.CreateAndUpdateHistory);

// router.post('/hardware/online', getHardwareOnline);

// export default router;
module.exports = router;
