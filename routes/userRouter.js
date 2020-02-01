const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
const { check, validationResult } = require('express-validator');
const user=require("../models/user.js");
var chatController = require('../controllers/chatController.js');
 
userRouter.get("/", userController.index);
userRouter.get("/chat", chatController.chat);;
userRouter.get("/logout", userController.logout);
userRouter.use('/auth',
    [
        check('username')
            .not()
            .isEmpty()
            .withMessage('Name or login is required')
            .bail()
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the login')
            .bail()
        	.custom(login=>{
        		return user.getUser([login,login]).then(data=>{
        			if(data.length<1){
        				return Promise.reject(new Error("The login or email is incorrect"));
        			}
        		});
        	}),
        check('password')
        	.not()
            .isEmpty()
            .withMessage('Password is required')
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the password')
            .bail()
            .custom((password, {req})=>{
        		return user.data([password,req.body.username,req.body.username]).then(data=>{
        			if(data.length<1){
        				return Promise.reject(new Error("Password is incorrect"));
        			}
        		});
        	}),
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length>0) {
            req.session.errors = errors;
            req.session.loggedin = false;
            req.session.username=req.body.username;
            res.redirect('/');
        } else {
            req.session.loggedin = true;
            req.session.username=req.body.username;
            res.redirect('/chat');
        }
    });

module.exports = userRouter;
