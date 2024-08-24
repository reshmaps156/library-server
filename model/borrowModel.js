// models/reservation.js
const mongoose = require('mongoose')

const borrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
 
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
   
    required: true
  },
  username:{
    type:String,
    required:true
  },
  bookName:{
    type:String,
    required:true
  },
  reserveDate: {
    type: Date,
    
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Accepted', 'Rejected'],
    default: 'Accepted'
  }
});



const borrows = mongoose.model('borrows', borrowSchema);
module.exports = borrows
