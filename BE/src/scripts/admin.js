const User = require("../models/user")
const bcrypt = require("bcrypt");

async function createAdminAccount(){
    try {
        const existingAdmin = await User.findOne({email: "admin@gmail.com"})
        if(!existingAdmin){
            const newAdmin = new User({
                email: "admin@gmail.com",
                name:"Admin",
                password: await bcrypt.hash("admin", 10),
                role:"admin",
                status:true,
                created_at: new Date()
            });
            await newAdmin.save();
            console.log("Admin account created successfully");
        }
        else{
            console.log("Admin account already exists");
        }
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = createAdminAccount;