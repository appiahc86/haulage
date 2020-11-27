import mongoose from "mongoose";
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    holderName: {
        type: String
    },

    bankName: {
        type: String
    },

    accountNumber: {
        type: String
    },

    balance:{
        type: Number
    },

    branch:{
        type: String
    },

    contact: {
        type: String
    }

}, {timestamps: true});

const Bank = mongoose.model("banks", accountSchema);
export default Bank;