const express=require('express')
const deviceController=require('../controllers/device.controller')
const userController=require('../controllers/user.controller')

const router=express.Router()

router.post('/register/user',userController.createUser)
router.post('/register/device',deviceController.createDevice)
router.get('get_users',userController.getAllUser)


module.exports=router