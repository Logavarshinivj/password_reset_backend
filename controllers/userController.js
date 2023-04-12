const User=require("../Models/userModel")
const bcrypt=require("bcrypt")
var nodemailer = require('nodemailer');
const { response } = require("express")
const jwt=require("jsonwebtoken")
const JWT_SECRET="hguyehkiolpja567ye00iuj1asrqw570nmzxji0p09olwsfuhrt6138jh7tyr5f6g"
const Registration = async(req,res)=>{
    const{lname,fname,email,password} = req.body
    const encryptedPassword = await bcrypt.hash(password,10)
    try{
        const oldUser= await User.findOne({email})
        if(oldUser){
          return  res.send({error:"User already exists"})
        }
        
        const data=await User.create({
            lname,
            fname,
            email,
            password:encryptedPassword
        })
      
        res.send(data)
        console.log(data)
    }


    catch(err){
        res.send("error")

    }

}


const Login=async(req, res)=>{
  const{email,password} = req.body
  const user=await User.findOne({email})
  if(!user){
    res.send({error:"User not found"})
  }
  if(await bcrypt.compare(password,user.password)){
    const token=jwt.sign({email:user.email},JWT_SECRET)
    if(res.status(201)){
       
        return res.json({status:"ok",token:token})
       
    }
    else{
        return res.send({error:"error"})
    }
  }
  res.json({error:"Invalid password"})

}


const UserDetails=async(req,res)=>{
 const {token}=req.body
 try{
 const user=jwt.verify(token,JWT_SECRET)
 console.log(user)
 const useremail=user.email
 User.findOne({email:useremail})
 .then((data)=>{
    res.send({status:"ok",data:data})
 })
 .catch((error)=>{
    res.send({status:"error",data:error})
 })
}

 catch(err){

 }
}

const ForgetPassword=async(req,res)=>{
  const {email}=req.body
  try{
    const oldUser=await User.findOne({email})
    if(!oldUser){
      return  res.json({status:"notok"})
    }
    const secret=JWT_SECRET+oldUser.password
    const token=jwt.sign({email:oldUser.email,id:oldUser._id},secret,{
      expiresIn:"5m"
    })
    const link=`http://localhost:4000/reset-password/${oldUser.id}/${token}`
    console.log(link)
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'demo33778@gmail.com',
        pass: 'rjdugcpgpfbaaqeh'
      }
    });
    
    var mailOptions = {
      from: 'demo33778@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: link,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    // res.send(token)
  }
  catch{
    res.send("error")
  }
}

const ResetPassword=async (req,res)=>{
  const {id,token}=req.params
  console.log(req.params)
  const oldUser=await User.findOne({_id:id})
  if(!oldUser){
     return res.json({status:"user not exists"})
  }
  const secret=JWT_SECRET+oldUser.password
  try{
    const verify=jwt.verify(token,secret)
    res.render("index",{email:verify.email,status:"not verified"})
    
  }
  catch(err){
    res.send("not verified")
  }
  
}

const ResetPassword1=async (req,res)=>{
  const {id,token}=req.params
  const{password}=req.body
  const oldUser=await User.findOne({_id:id})
  if(!oldUser){
     return res.json({status:"user not exists"})
  }
  const secret=JWT_SECRET+oldUser.password
  try{
    const verify=jwt.verify(token,secret)
    // res.render("index",{email:verify.email})
    const encryptedPassword=await bcrypt.hash(password,10)
    await User.updateOne(
      {
        _id:id
      },
      {
        $set:{
          password:encryptedPassword
        }
      }

    )
    // res.json({status:"password updated"})
     res.render("index",{email:verify.email,status:"verified"})
  }
  catch(err){
    res.json({status:"something went wrong"})
  }
  
}





module.exports={Registration,Login,UserDetails,ForgetPassword,ResetPassword,ResetPassword1}