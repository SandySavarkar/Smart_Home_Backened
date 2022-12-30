const mongoose=require('mongoose')

const deviceSchema= new mongoose.Schema({
    serial_number:{type:String},
    name:{type:String},
    is_deleted:{type:Boolean,default:false},
    pins:{
        type:Array,
        default:[
            {
              "pinId": 16,
              "pinName": "D0",
              "relatedManualPin": 2,
              "relatedManualPinName": "D4",
              "limit":'',
              "watt":1000,
              "status":false
            },
            {
              "pinId": 14,
              "pinName": "D5",
              "relatedManualPin": 12,
              "relatedManualPinName": "D6",
              "limit":'',
              "watt":1000,
              "status":false
            },
            {
              "pinId": 5,
              "pinName": "D1",
              "relatedManualPin": 0,
              "relatedManualPinName": "D3",
              "limit":'',
              "watt":1000,
              "status":false
            }
          ]
    }
},{timestamps:true})

module.exports=mongoose.model('Device',deviceSchema)