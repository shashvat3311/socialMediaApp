
const db=require('../db')
const jwt=require('jsonwebtoken')
require('dotenv').config();

const createUser=async(req,res)=>{
    try{
       const{user_id,firstName,middleName,lastName,userName,mobile,email,passwordHash,intro,profile}=req.body 

       const queryString="insert into user(user_id,firstName,middleName,lastName,userName,mobile,email,passwordHash,intro,profile) values (?,?,?,?,?,?,?,?,?,?)"

       const quertyStringGetUser='select * from user where user_id = ?'

       const duplicateEnrtyQuery='select exists(select 1 from user where user_id=?) as user_id, exists(select 1 from user where username=?) as username, exists(select 1 from user where email=?) as email ,exists (select 1 from user where mobile =?) as mobile'

       const insertTokenQuery='update user set user_token=? where user_id =?'


    db.query(duplicateEnrtyQuery,[user_id,userName,email,mobile],(err,result)=>{   
       if(result[0].user_id||result[0].username==1||result[0].email==1||result[0].mobile==1){
        return res.status(409).send({
            success:false,
            err_message:"Duplicate entries count->",
            duplicate:result
        })
       }
       else{
        db.query(queryString,[user_id,firstName,middleName,lastName,userName,mobile,email,passwordHash,intro,profile],(err,result)=>{
            if(!user_id||!firstName||!lastName||!userName||!mobile||!email||!passwordHash||!intro||!profile){
                return res.status(404).send({
                    succss:false,
                    err_message:"Please enter values for the mentioned feilds(user_id,firstName,lastName,userName,mobile,email,passwordHash,,intro,profile)"
                })
            }
            if(err){
                console.log(err)
                return res.status(400).send({
                    success:false,
                    err:err
                })
            }
            db.query(quertyStringGetUser,[user_id],(err,userresult)=>{
                if(err){
                    return res.status(400).send({
                        success:false,
                        err:err
                    })
                }
                // db.query('')
                const token = jwt.sign({ data: userresult }, process.env.TOKEN_SECRET)
                db.query(insertTokenQuery,[token,user_id],(err,result)=>{
                    if(err){
                        res.status(400).send({
                            success:false,
                            err:err
                        })
                    }
                    else{
                    return res.status(200).send({
                        success:true,
                        message:"New user created ",
                        result:userresult,
                        token:token
                    })
                }
                })         
            })       
           })
       }
        
    })   
    }
    catch(err){
        return res.status(400).send({
            succss:false,
            err:err
        })
    }
}

const demoget=async(req,res)=>{
    const str=req.originalUrl
    console.log(str)

    const{username,email,mobile}=req.body
    const duplicateEnrtyQuery='select exists(select 1 from user where username=?) as username, exists(select 1 from user where email=?) as email ,exists (select 1 from user where mobile =?) as mobile'
    db.query(duplicateEnrtyQuery,[username,email,mobile],(err,result)=>{

        if(err){
            return res.status(400).send({
                success:false ,
                err:err
            })
        }
        
       if(result[0].usernameExists==1||result[0].emailExist==1||result[0].mobileExists==1){
        return res.status(409).send({
            success:false,
            err_message:"Duplicate entries count->",
            duplicate:result
        })
       }
        return res.status(200).send({
            success:true,
            result:result
        })
    })
}

const acidAPI=async(req,res)=>{
     
}
module.exports={createUser,demoget}