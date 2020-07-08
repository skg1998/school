const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');


const UserSchema = new Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    marks:{
        type:String,
        require:true
    },
    stream:{
       type:String,
       require:true
    },
    hash : String, 
    salt : String,
    date:{
       type:Date,
       default:Date.now
    }
})

UserSchema.methods.setPassword = function(password) { 
    this.salt = crypto.randomBytes(16).toString('hex');
    console.log(password);
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); 
    console.log(this.hash);
}; 

UserSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); 
    return this.hash === hash;
};

module.exports= User = mongoose.model('users', UserSchema);

