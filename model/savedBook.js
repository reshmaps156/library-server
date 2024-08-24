const mongoose = require('mongoose')
const savedBookSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    booksaved:{
        type:Array,
        required:true
}
    }
)

const savedbooks = mongoose.model("savedbooks",savedBookSchema)
module.exports = savedbooks