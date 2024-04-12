const express=require('express')
const db=require('../db')
const jwt=require('jsonwebtoken')

const createGroup=async(req,res)=>{
    try{
       const{createdBy,title,metaTitle,slug,summary,status,profile,content}=req.body 
       const queryString="insert into group_(createdBy,title,metaTitle,slug,summary,status,profile,content) values (?,?,?,?,?,?,?,?)"

       db.query(queryString,[createdBy,title,metaTitle,slug,summary,status,profile,content],(err,result)=>{
        if(!createdBy||!title||!metaTitle||!slug||!summary||!status||!profile||!content){
            return res.status(404).send({
                succss:false,
                err_message:"Please enter the mentioned Feilds (createdBy,title,metaTitle,slug,summary,status,profile,content)"
            })
        }
        if(err){
            if(err.errno==1452){
                return res.status(400).send({
                    success:false,
                    err:"Failed to send the message. The sender ID provided is not valid. Please check the sender ID and try again."
                })
            }
            return res.status(400).send({
                success:false,
                err:err
            })
        }
        return res.status(200).send({
            success:true,
            result:result
        })
       })
    }
    catch(err){
        return res.status(400).send({
            succss:false,
            err:err.message
        })
    }
}



const createGroupPost=async(req,res)=>{
    try{
        const queryString="insert into group_post(group_Id,user_Id,message) values(?,?,?)"
    const{group_Id,user_Id,message}=req.body;
    
    db.query(queryString,[group_Id,user_Id,message],(err,result)=>{
        if(err){
            return res.status(400).send({
                "success":false,
                "err":err
            })
        }
        return res.status(200).send({
            success:true,
            result:result
        })
    })
    }
    catch(err){
        if(err){
            res.status(400).send({
                success:false,
                err:err.message
            })
        }
       
    }
}

const createGroupMessage=async(req,res)=>{
    try{
        const queryString=""
    const{}=req.body;
    db.query(queryString,[],(err,result)=>{
        if(err){
            return res.status(400).send({
                "success":false,
                "err":err
            })
        }
    })
    }
    catch(err){
        if(err){
            res.status(400).send({
                success:false,
                err:err.message
            })
        }
        return res.status(200).send({
            success:true,
            result:result
        })
    }
}

const createGroupMember=async(req,res)=>{
    try{
        const queryString=""
    const{}=req.body;
    db.query(queryString,[],(err,result)=>{
        if(err){
            return res.status(400).send({
                "success":false,
                "err":err
            })
        }
    })
    }
    catch(err){
        if(err){
            res.status(400).send({
                success:false,
                err:err.message
            })
        }
        return res.status(200).send({
            success:true,
            result:result
        })
    }
}

const createGroupFollower=async(req,res)=>{
    try{
        const queryString=""
    const{}=req.body;
    db.query(queryString,[],(err,result)=>{
        if(err){
            return res.status(400).send({
                "success":false,
                "err":err
            })
        }
    })
    }
    catch(err){
        if(err){
            res.status(400).send({
                success:false,
                err:err.message
            })
        }
        return res.status(200).send({
            success:true,
            result:result
        })
    }
}

const demoGet=async(req,res)=>{
    try{
        const queryString=""
    const{}=req.body;
    db.query(queryString,[],(err,result)=>{
        if(err){
            return res.status(400).send({
                "success":false,
                "err":err
            })
        }
    })
    }
    catch(err){
        if(err){
            res.status(400).send({
                success:false,
                err:err.message
            })
        }
        return res.status(200).send({
            success:true,
            result:result
        })
    }
}
module.exports={createGroup,createGroupFollower,createGroupMember,createGroupMessage,createGroupPost}