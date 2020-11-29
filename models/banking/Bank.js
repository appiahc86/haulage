import mongoose from "mongoose";
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    holderName: {
        type: String,
        trim: true
    },

    bankName: {
        type: String,
        trim: true
    },

    accountNumber: {
        type: String,
        trim: true
    },

    balance:{
        type: Number
    },

    branch:{
        type: String,
        trim: true
    },

    contact: {
        type: String
    }

}, {timestamps: true});

const Bank = mongoose.model("banks", accountSchema);
export default Bank;