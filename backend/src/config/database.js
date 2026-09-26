const mongoose = require("mongoose")

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to Database");
    } catch (err) {
        console.error("Database connection failed:", {
            message: err.message,
            name: err.name,
            code: err.code
        })
        throw err
    }
    
}

module.exports=connectToDB