const express = require("express");
const userController = require("../controllers/userController.js");
const signupRouter = express.Router();
const { check, validationResult } = require('express-validator');
const passwordValidator = require("password-validator"); 
let user=require("../models/user.js");

let pwSchema = new passwordValidator();
pwSchema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols()
  .has().not().spaces();

signupRouter.get("/", userController.signup);
signupRouter.post('/registration',
    [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the real name'),
        check('login')
        	.not()
        	.isEmpty()
            .bail()
        	.withMessage('Login is required')
            .custom(value => !/\s/.test(value))
            .withMessage('No spaces are allowed in the login')
        	.custom(login=>{if(!login) return;
        		return user.checklogin(login).then(data=>{
        			if(data.length>0){
        				return Promise.reject(new Error("Login already exists"));
        			}
        		});
        	}),
        check('email')
            .isEmail()
            .withMessage('email not valid')
            .bail()
            .custom(email=>{if(!email) return;
        		return user.checkemail(email).then(data=>{
        			if(data.length>0){
        				return Promise.reject(new Error("Email already exists"));
        			}
        		});
        	}),
        check('date')
        .isISO8601()
        .withMessage('Date is not correct'),
        check('password')
            .custom((val, {req}) => {
            	let isPwValid = pwSchema.validate(val);
            	if(!isPwValid){
            		throw new Error("Password does not meet the requirements! Password must be include minimum 8 length, lowercase letters, uppercase letters, digits, and symbols");
            	}
                if (val !== req.body.confirm_password) {
                    throw new Error("Passwords don't match");
                }
                return true; 
            }),
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length>0) {
            req.session.errors = errors;
            req.session.loggedin = false;
            req.session.account=req.body;
            res.redirect('/signup');
        } else {
            req.session.loggedin = true;
            userController.addUser(req,res);
        }
    });

module.exports = signupRouter;