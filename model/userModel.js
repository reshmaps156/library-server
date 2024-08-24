const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    access:{
        type:String,
        enum:['user','admin'],
        required:true,
        default:'user'
    }
})
const users = mongoose.model("users",userSchema)
module.exports = users