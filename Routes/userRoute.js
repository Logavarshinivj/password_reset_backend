const express = require('express');
const{Registration,Login,UserDetails,ForgetPassword,ResetPassword,ResetPassword1}=require('../controllers/userController');

const router=express.Router()

router.post("/register-demo",Registration)
router.post("/login-demo",Login)
router.post("/user-demo",UserDetails)
router.post("/forget-password",ForgetPassword)
router.get("/reset-password/:id/:token",ResetPassword)
router.post("/reset-password/:id/:token",ResetPassword1)
module.exports=router