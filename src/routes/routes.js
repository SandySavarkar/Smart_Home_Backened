// import express from 'express';
const express = require('express');
// import { getHardwareOnline } from '../controllers/registerHardwareControllers.js';
const deviceController = require('../controllers/device.controller');
const userController = require('../controllers/user.controller');
const historyController = require('../controllers/history.controller');

const router = express.Router();

//User Controller
router.post('/register/user', userController.userRegister);
router.post('/login',userController.userLogin)
router.get('/getAllUsers', userController.getUsers);
router.get('/getMyDevice', userController.getUserDevice);
router.put('/deleteUser', userController.deleteUser);
router.put('/update_user/:id',userController.updateUser)


//DeviceController
router.post('/register/device', deviceController.deviceRegister);
router.get('/getAllDevice', deviceController.getDevices);
router.put('/updateDevice', deviceController.updateDevice);
router.put('/deleteDevice', deviceController.deleteDevice);
router.get('/availableDevices', deviceController.getAvailableDevice);
router.put('/updateDevicePinData',deviceController.updateDevicePinData)

// router.put('/updateDevicePinData', deviceController.up);


router.put('/scheduleTime', deviceController.scheduleTime);

//History Controller
router.post('/getUserHistory', historyController.getHistory);


// router.post('/hardware/online', getHardwareOnline);

module.exports = router;