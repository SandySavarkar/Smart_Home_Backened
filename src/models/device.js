// import mongoose from 'mongoose';
const mongoose=require('mongoose')

const deviceSchema =new mongoose.Schema({
  serial_number: {
    type: String,
  },
  name: {
    type: String,
  },
  pins: {
    type: Array,
    default:[
      {
        "pinId": 5,
        "pinName": "D1",
        "relatedManualPin": 0,
        "relatedManualPinName": "D3",
        "status":false,
        "scheduleStartDateTime":'',
        "scheduleStopDateTime":'',
        "watt":'',
        "limit":''
      },
      {
        "pinId": 14,
        "pinName": "D5",
        "relatedManualPin": 13,
        "relatedManualPinName": "D7",
        "status":false,
        "scheduleStartDateTime":'',
        "scheduleStopDateTime":'',
        "watt":'',
        "limit":''
      },
      {
        "pinId": 16,
        "pinName": "D0",
        "relatedManualPin": 4,
        "relatedManualPinName": "D2",
        "status":false,
        "scheduleStartDateTime":'',
        "scheduleStopDateTime":'',
        "watt":'',
        "limit":''
      }
    ]
  },
  is_deleted:{
    type: Boolean,
    default:false
  }
},{
    timestamps: true
});

module.exports  = mongoose.model('Device', deviceSchema);

