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

    openingBalance: {
      type: Number
    },

    branch:{
        type: String,
        trim: true
    },

    contact: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

}, {timestamps: true});

const Bank = mongoose.model("banks", accountSchema);
export default Bank;