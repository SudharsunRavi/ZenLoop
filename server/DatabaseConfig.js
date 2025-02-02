const mongoose=require('mongoose');

const connectToDB = async() => {
    await mongoose.connect(process.env.MONGODB_URL)
}

module.exports = connectToDB;