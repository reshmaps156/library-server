const mongoose = require('mongoose')
const bookSchema = new mongoose.Schema({
    bookname:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    bookImg:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    availabilty:{
        type:Number,
        required:true
    },
    status : {
        type : String,
        enum : ["Available","Reserved","Issued","Lost"],
        default : "Available"
    }
})
const books = mongoose.model("books",bookSchema)
module.exports = books