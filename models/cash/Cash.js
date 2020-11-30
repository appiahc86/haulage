import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cashSchema = new Schema({

    name:{
        type: String,
        default: "cashAccount"
    },

    balance: {
        type: Number,
        default: 0
    }

}, {timestamps: true});


const Cash = mongoose.model("Cash", cashSchema);
export default Cash;