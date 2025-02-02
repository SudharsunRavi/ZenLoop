const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            minLength:3,
            maxLength:30
        },
        password:{
            type: String,
            required: true,
            minLength:5
        },
        avatar:{
            type: String,
            required: true
        },
        walletAddress: { 
            type: String,
            unique: true ,
            sparse: true,
        },
    },{
        timestamps:true
    }
)

module.exports = mongoose.model('User', userSchema);