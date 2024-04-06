const mysql=require('mysql');
const db=mysql.createConnection({
    user:"root",
    password:"shashvat",
    host:"localhost",
    database:"demosocialmedia"
})

db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Database connected");
    }
})

module.exports=db

