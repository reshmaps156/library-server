const users = require("../model/userModel")
const jwt = require('jsonwebtoken')

//regiter
exports.registerController = async(req,res)=>{
    const {username , age , email , password,access} = req.body
    try {
        let existingUser = await users.findOne({email})
        if(existingUser){
            res.status(406).json('Account already exist')
        }else{
            const newUser = new users({
                username,age,email,password,access
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(401).json(`Registration failed due to ${error}`)
    }
   
}

exports.loginController = async(req,res)=>{
    const {email,password} = req.body
    try {
        let existingUser = await users.findOne({email,password})
        if(existingUser){
            const token = jwt.sign({userId:existingUser._id},'secret000')
            res.status(200).json({existingUser,token})
        }else{
            res.status(406).json('Invalid Email or Password')
        }
    } catch (error) {
        res.status(401).json(`${error}`)
    }
}