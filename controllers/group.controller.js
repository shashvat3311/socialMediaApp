const express=require('express')
const db=require('../db')
const jwt=require('jsonwebtoken')

const createGroup=async(req,res)=>{
    try{
       const{user_id,firstName,middleName,lastName,userName,mobile,email,passwordHash,registeredAt,lastLogin,intro,profile}=req.body 
       const queryString="insert into user(firstName,middleName,lastName,userName,mobile,email,passwordHash,intro,profile) values (?,?,?,?,?,?,?,?,?)"

       db.query(createUser,[firstName,middleName,lastName,userName,mobile,email,passwordHash,,intro,profile],(err,result)=>{
        if(!firstName||!middleName||!lastName||!userName||!mobile||!email||!passwordHash||!intro||!profile){
            return res.status(404).send({
                succss:false,
                err_message:"Please enter each and every feild(firstName,lastName,userName,mobile,email,passwordHash,,intro,profile)"
            })
        }
        if(err){
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
            err:err
        })
    }
}

module.exports={}