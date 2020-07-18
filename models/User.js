const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema 
const UserSchema = new Schema({
    googleID:{
       type:String,
       required:true 
    },
    email:{
       type:String,
       required:true
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    image:{
        type:String
    }
     
});

//create collections and schema 
mongoose.model('users',UserSchema);