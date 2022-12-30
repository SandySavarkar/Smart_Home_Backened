// import express from 'express';
// import router from './src/routes/routes.js';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import { Server } from 'socket.io';
// import http from 'http';
const express = require('express');
const router = require('./src/routes/routes.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const deviceController = require('./src/controllers/device.controller');
const historyController = require('./src/controllers/history.controller');

// const ngrok = require('ngrok');

dotenv.config();
const app = express();
const PORT = 8080;
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('src/ui'));

app.use('/api', router);

io.on('connection', socket => {
  console.log('connect', socket.id);
  socket.emit('request_for_devices_id');

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

  socket.on('buttonState', value => {
    console.log('value: ', value);
    socket.to(value.devicesId.toString()).emit('buttonState', value);

    deviceController.updateDevicePin(value);
    historyController.CreateAndUpdateHistory(value);
  });

  socket.on('join_me', data => {
    const devicesId = data.devicesId.toString();
    // deviceController.deviceRegister(devicesId)
    socket.join(devicesId);
  });

  socket.on('pin_state', data => {
    console.log('data: ', data);
    deviceController.updateDevicePin(data);
    historyController.CreateAndUpdateHistory(data);
    socket.to(data.devicesId.toString()).emit('pin_state', data);
  });
  socket.on('message', function (msg) {
    console.log('message: ' + msg);
  });
});

mongoose.connect(process.env.DB_CON_STRING, { useNewUrlParser: true }, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully Connected to the database');
  }
});

httpServer.listen(PORT, () => {
  console.log('Running on : ', httpServer.address());
});
// const url=await ngrok.connect(8080)
// console.log(url,"urll");
