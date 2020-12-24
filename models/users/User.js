import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";


const userSchema = new Schema({

   firstName: {
       type : String
   },

    lastName: {
       type: String
    },

    username: {
       type: String,
        unique: true
    },

    token: {
       type: String
    },

    role: {
       type: Number
    },

    password: {
       type: String
    }


},{timestamps: true});

//hash password before saving
userSchema.pre('save', async function (next){

    if (this.isModified('password')){
        const salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hashSync(this.password, salt);
    }

    next();

});


const User = mongoose.model('users', userSchema);
export default User;


