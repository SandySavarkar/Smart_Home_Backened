// import mongoose, { Schema } from 'mongoose';
const mongoose=require('mongoose')

const userSchema =new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  type: {
    type: String,
    default:"user"
  },
  limit:{
    type:Number
  },
  devices:[{type:mongoose.Schema.Types.ObjectId,ref:"Device"}],
  is_deleted:{
    type: Boolean,
    default:false
  }
},{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);


