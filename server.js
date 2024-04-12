const bodyParser = require('body-parser');
const express=require('express');
const app=express();
const groupRouter=require('./routers/group.router')
const userRouter=require('./routers/user.router')
const db=require('./db')
const cors=require('cors')
// app.use(cors)

app.use(express.json());

app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(bodyParser.json());

// app.use('/group',groupRouter);
app.use(userRouter)
app.use(groupRouter)

app.get('/',(req,res)=>{
   db.query('desc user',(err,result)=>{
     if(err){
      res.status(400).send({
            success:false,
            err:err
        })
     }
      res.status(200).send({
        success:true,
        result:result
     })
   })
})

app.listen(5000,()=>{
    console.log("Server up and running on port 5000 for demoSocial Media");
})