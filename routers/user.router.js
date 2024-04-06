const express=require('express');
const router=express.Router();
const userController=require('../controllers/user.controller')
const validator=require('../validator')

router.post('/createUser',userController.createUser)

router.get('/demoGet',userController.demoget)

router.post('/user_post',userController.user_post)

router.post('/user_friend',userController.user_friend)

router.post('/user_message',userController.user_message)

router.post('/user_follower',userController.user_follower)


module.exports=router