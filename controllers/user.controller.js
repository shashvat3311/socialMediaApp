const db = require("../db");
const jwt = require("jsonwebtoken");
const validator = require("../validator");
require("dotenv").config();

const createUser = async (req, res) => {
  try {
    const {
      user_id,
      firstName,
      middleName,
      lastName,
      userName,
      mobile,
      email,
      passwordHash,
      intro,
      profile,
    } = req.body;

    const queryString =
      "insert into user(user_id,firstName,middleName,lastName,userName,mobile,email,passwordHash,intro,profile) values (?,?,?,?,?,?,?,?,?,?)";

    const quertyStringGetUser = "select * from user where user_id = ?";

    const duplicateEnrtyQuery =
      "select exists(select 1 from user where user_id=?) as user_id, exists(select 1 from user where username=?) as username, exists(select 1 from user where email=?) as email ,exists (select 1 from user where mobile =?) as mobile";

    const insertTokenQuery = "update user set user_token=? where user_id =?";

    db.query(
      duplicateEnrtyQuery,
      [user_id, userName, email, mobile],
      (err, result) => {
        if (
          result[0].user_id ||
          result[0].username == 1 ||
          result[0].email == 1 ||
          result[0].mobile == 1
        ) {
          return res.status(409).send({
            success: false,
            err_message: "Duplicate entries count->",
            duplicate: result,
          });
        } else {
          db.query(
            queryString,
            [
              user_id,
              firstName,
              middleName,
              lastName,
              userName,
              mobile,
              email,
              passwordHash,
              intro,
              profile,
            ],
            (err, result) => {
              if (
                !user_id ||
                !firstName ||
                !lastName ||
                !userName ||
                !mobile ||
                !email ||
                !passwordHash ||
                !intro ||
                !profile
              ) {
                return res.status(404).send({
                  succss: false,
                  err_message:
                    "Please enter values for the mentioned feilds(user_id,firstName,lastName,userName,mobile,email,passwordHash,,intro,profile)",
                });
              }
              if (err) {
                console.log(err);
                return res.status(400).send({
                  success: false,
                  err: err.message,
                });
              }
              db.query(quertyStringGetUser, [user_id], (err, userresult) => {
                if (err) {
                  return res.status(400).send({
                    success: false,
                    err: err.message,
                  });
                }
                // db.query('')
                const token = jwt.sign(
                  { data: userresult },
                  process.env.TOKEN_SECRET
                );
                db.query(insertTokenQuery, [token, user_id], (err, result) => {
                  if (err) {
                    res.status(400).send({
                      success: false,
                      err: err.message,
                    });
                  } else {
                    return res.status(200).send({
                      success: true,
                      message: "New user created ",
                      result: userresult,
                      token: token,
                    });
                  }
                });
              });
            }
          );
        }
      }
    );
  } catch (err) {
    return res.status(400).send({
      succss: false,
      err: err.message,
    });
  }
};

const demoget = async (req, res) => {
  const str = req.originalUrl;
  console.log(str);

  const { username, email, mobile } = req.body;
  const duplicateEnrtyQuery =
    "select exists(select 1 from user where username=?) as username, exists(select 1 from user where email=?) as email ,exists (select 1 from user where mobile =?) as mobile";
  db.query(duplicateEnrtyQuery, [username, email, mobile], (err, result) => {
    if (err) {
      return res.status(400).send({
        success: false,
        err: err.message,
      });
    }

    if (
      result[0].usernameExists == 1 ||
      result[0].emailExist == 1 ||
      result[0].mobileExists == 1
    ) {
      return res.status(409).send({
        success: false,
        err_message: "Duplicate entries count->",
        duplicate: result,
      });
    }
    return res.status(200).send({
      success: true,
      result: result,
    });
  });
};

const acidAPI = async (req, res) => {};

const user_post = async (req, res) => {
  try {
    const { user_id, sender_id, message } = req.body;
    if (!user_id || !sender_id || !message) {
      return res.status(404).send({
        success: false,
        err: "Please enter user_id ,sender_id and message",
      });
    }
    const queryString =
      "insert into user_post(user_id,sender_id,message) values(?,?,?)";
    db.query(queryString, [user_id, sender_id, message], (err, result) => {
      if (err) {
        return res.status(400).send({
          success: false,
          err: err.message,
        });
      }
      return res.status(200).send({
        success: true,
        success_message: `Post generated for user_id: ${user_id} and sender_id: ${sender_id}`,
        result: result,
      });
    });
  } catch (err) {
    if (err) {
      res.status(400).send({
        success: false,
        err: err.message,
      });
    }
  }
};

const user_friend = async (req, res) => {
  try {
    const { sourceId, targetId, type, notes } = req.body;
    if (!sourceId || !targetId || !type || !notes) {
      return res.status(404).send({
        success: false,
        err: "Please Enter sourceId,targetId ,type and notes ",
      });
    }

    const queryString =
      "insert into user_friend(sourceId,targetId,type,notes) values(?,?,?,?)";

    const isAlradyaFriendQuery =
      "select * from user_friend where sourceId=? and targetId=?";

    await db.query(
      isAlradyaFriendQuery,
      [sourceId, targetId],
      (err, result) => {
        if (err) {
          res.status(500).send({
            success: false,
            err: err,
          });
        }
        if (result.length > 0) {
          return res.status(400).send({
            success: false,
            message: `User ${targetId} is Already a Friend`,
          });
        }

        db.query(
          queryString,
          [sourceId, targetId, type, notes],
          (err, result) => {
            if (err) {
              return res.status(400).send({
                success: false,
                err: err.message,
              });
            }
            return res.status(200).send({
              success: true,
              success_message: `New friend created ${targetId}`,
              result: result,
            });
          }
        );
      }
    );
  } catch (err) {
    if (err) {
      res.status(400).send({
        success: false,
        err: err.message,
      });
    }
  }
};
const user_follower = async (req, res) => {
    try {
        const { sourceId, targetId} = req.body;
        if (!sourceId || !targetId ) {
          return res.status(404).send({
            success: false,
            err: "Please Enter sourceId and targetId",
          });
        }
    
        const queryString =
          "insert into user_friend(sourceId,targetId) values(?,?)";
    
        const isAlradyaFollowerQuery =
          "select * from user_friend where sourceId=? and targetId=?";
    
        await db.query(
          isAlradyaFollowerQuery,
          [sourceId, targetId],
          (err, result) => {
            if (err) {
              res.status(500).send({
                success: false,
                err: err,
              });
            }
            if (result.length > 0) {
              return res.status(400).send({
                success: false,
                message: `User ${targetId} is Already a Follower`,
              });
            }
    
            db.query(
              queryString,
              [sourceId, targetId],
              (err, result) => {
                if (err) {
                  return res.status(500).send({
                    success: false,
                    err: err.message
                  });
                }
                return res.status(200).send({
                  success: true,
                  success_message: `New Follower:${targetId} for User:${sourceId}`,
                  result: result,
                });
              }
            );
          }
        );
      } catch (err) {
        if (err) {
          res.status(400).send({
            success: false,
            err: err.message,
          });
        }
      }
};
const user_message = async (req, res) => {
  try {
    const {sourceId,targetId,message} = req.body;
    if(!sourceId||!targetId||!message){
        return res.status(400).send({
            success:false,
            err:"Please Enter sourceId ,targetId and message"
        })
    }
    const queryString = "insert into user_message(sourceId,targetId,message) values(?,?,?)" ;
    db.query(queryString, [sourceId,targetId,message], (err, result) => {
      if (err) {
        if(err.errno==1452){
            return res.status(400).send({
                success:false,
                err:"Failed to send the message. The sender ID provided is not valid. Please check the sender ID and try again."
            })
        }
        return res.status(400).send({
          success: false,
          err: err,
        });
      }
      return res.status(200).send({
        success: true,
        success_message:`New Message:${message} successfilly sent by Source: ${sourceId} to Target: ${targetId}`,
        result: result,
      });
    });
  } catch (err) {
    if (err) {
      res.status(400).send({
        success: false,
        err: err.message,
      });
    }
  }
};

const getUserFriends=async(req,res)=>{
    try{
        const queryString="select * from user_friend where sourceId=?"
        const{sourceId}=req.body;
        if(!sourceId){
            return res.status(400).send({
                success:false,
                err:"Please enter sourceID"
            }) 
        }
        db.query(queryString,[sourceId],(err,result)=>{
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
        if(err){
            res.status(500).send({
                success:false,
                err:err
            })
        }
    }
}

const getUserFollower=async(req,res)=>{
    try{
        const queryString="select * from user_follower where sourceId=?"
        const{sourceId}=req.body;
        if(sourceId){
            return res.status(400).send({
                success:false,
                err:"Please enter and"
            }) 
        }
        db.query(queryString,[sourceId],(err,result)=>{
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
        if(err){
            res.status(500).send({
                success:false,
                err:err
            })
        }
    }
}

const getUserMessages=async(req,res)=>{
    try{
        const queryString="select message from user_message where targetId=?"
        const{}=req.body;
        if(!targetId){
            return res.status(400).send({
                success:false,
                err:"Please enter targetId"
            }) 
        }
        db.query(queryString,[targetId],(err,result)=>{
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
        if(err){
            res.status(500).send({
                success:false,
                err:err
            })
        }
    }
}

const getuserPost=async(req,res)=>{
    try{
        const queryString="select post from user_post where targetId=?"
        const{targetId}=req.body;
        if(targetId){
            return res.status(400).send({
                success:false,
                err:"Please enter targetId"
            }) 
        }
        db.query(queryString,[targetId],(err,result)=>{
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
        if(err){
            res.status(500).send({
                success:false,
                err:err
            })
        }
    }
}

const getUsers=async(req,res)=>{
    try{
        const queryString="select user_id,firstName,middleName,lasName,userName from user;"
        
        db.query(queryString,(err,result)=>{
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
        if(err){
            res.status(500).send({
                success:false,
                err:err
            })
        }
    }
}

module.exports = {
  createUser,
  demoget,
  user_follower,
  user_friend,
  user_post,
  user_message,
  getUserFriends,
  getUserFollower,
  getUserMessages,
  getUserFollower,
  getuserPost,
  getUsers
};
