const express =require('express');
const users = express.Router();
const UserController = require('../controller/User');



//signup
users.post('/register',UserController.register);

//login 
users.post('/login',UserController.login);

//dashbord
users.get('/dashboard',UserController.dashboard);

module.exports= users;