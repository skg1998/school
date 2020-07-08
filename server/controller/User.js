const express =require('express');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
process.env.SECRET_KEY = 'secret';

//Register controller
const register = (req,res)=>{
    
    const today = new Date();
    var {username,email,marks,stream,password} = req.body;

    var NewUser = new User({
        username:req.body.username,
        email:req.body.email,
        marks:req.body.marks,
        stream:req.body.stream,
        password:req.body.password,
        created:today
    });

    //validation 
    let errors = [];

    //check require feild
    if(!username || !email || !password ||!marks ||!stream ){
        errors.push({ msg :'Please fill in all fields'});
    }

    //password length
    if(password.length < 6){
        errors.push({msg :'Password length must be greater than 6'});
    }


    if(errors.length >0){
        res.json({
            errors
        })

    }else{
        console.log(username,email,marks,stream,password);
        User.findOne({
            email:req.body.email
        })
        .then(user =>{
            if(!user){
                NewUser.setPassword(String(req.body.password));
                console.log(username,email,marks,stream,password);
                NewUser.save().then(user =>{
                    res.json({status:user.email+' registered'});
                })
                .catch(err =>{
                    res.send('error: '+ err);
                })
            }else{
                errors.push({msg:'User already exists'});
                res.json({errors});
            }

        })
        .catch(err =>{
            res.send('error:'+err);
        })
    }
}


//login controller
const login = (req,res)=>{
    console.log(req.body.id);
    User.findOne({ email : req.body.email }, function(err, user) { 
        if (user === null) { 
            return res.status(400).send({ 
                message : "User not found."
            }); 
        } 
        else { 
             console.log(req.body.password);  
            if (user.validPassword(String(req.body.password))){
                const payload = {
                    _id:user._id,
                    username:user.username,
                    email:user.email,
                    marks:user.marks,
                    stream:user.stream

                }
                let token = jwt.sign(payload, process.env.SECRET_KEY,{
                    expiresIn:1440
                })
                res.json({
                    token: token,
                    payload: payload
                });
            } 
            else { 
                return res.status(400).send({ 
                    message : "Wrong Password"
                }); 
            } 
        } 
    }); 
}


// User Profile  
const dashboard =(req,res)=>{
    let auth = req.headers['authorization'];
    auth = (auth||"").split(" ");
    auth = auth[1] || "";
    var decoded = jwt.verify(auth , process.env.SECRET_KEY)
    User.findOne({
        _id:decoded._id

    }, {
        hash: 0,
        salt: 0
    })
    .then(user=>{
        if(user){
            res.json(user)
        }else{
            res.send("User doesnot exist")
        }
    })
    .catch(err => {
        res.send('error: '+err)
    })
}


exports.register = register;
exports.login = login;
exports.dashboard = dashboard;