const express=require('express')
const deviceController=require('../controllers/device.controller')
const userController=require('../controllers/user.controller')

const router=express.Router()

router.post('/register/user',userController.createUser)


module.exports=router