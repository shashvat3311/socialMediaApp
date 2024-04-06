const express=require('express');
const router=express.Router();
const userController=require('../controllers/user.controller')
const db=require("../db");

router.post('/createUser',userController.createUser)

router.get('/demoGet',userController.demoget)

module.exports=router