const express=require('express');
const router=express.Router();
const groupController=require('../controllers/group.controller')

router.post('/createGroup',groupController.createGroup)
 
router.post('/createGroupFollower',groupController.createGroupFollower)

router.post('/createGroupMenber',groupController.createGroupMember)

router.post('/createGroupMessage',groupController.createGroupMessage)

router.post('/createGroupPost',groupController.createGroupPost)

module.exports=router