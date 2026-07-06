import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required:true,
        unique:true,
        lowercase: true,
        trim : true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
    },
    password:{
        type : String,
        required:true,
        minlength: 6  
        
    },
    role:{type : String,
        default: 'user',
        enum:['user','admin']}
    },{
        timestamps : true
    });

    userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})
    userSchema.methods.compararPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

const User = mongoose.model('User', userSchema)
export default User;