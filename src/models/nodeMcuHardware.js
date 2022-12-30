// import mongoose from 'mongoose';
const mongoose=require('mongoose')

const nodeMcuSchema =new mongoose.Schema({
  serial_number: {
    type: String,
    require: true,
  },
  last_online_at: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model('nodeMcu', nodeMcuSchema);


