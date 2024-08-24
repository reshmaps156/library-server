const mongoose = require('mongoose')

const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(( )=>{
    console.log(`mongoDB running successfully`);
   
    
    
}).catch((err)=>{
    console.log(`Database not connected due to ${err}`);
    
})