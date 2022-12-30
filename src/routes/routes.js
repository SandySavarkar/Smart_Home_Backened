const express=require('express')
const deviceController=require('../controllers/device.controller')
const userController=require('../controllers/user.controller')

const router=express.router()

router.post('/register/user',userController.createUser)
