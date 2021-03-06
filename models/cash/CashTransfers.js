import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cashTransferSchema = new Schema({

    date:{
        type: Date
    },

    amount: {
        type: Number
    },

    bank: {
        type: Schema.Types.ObjectId,
        ref: "banks"
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

}, {timestamps: true});


const CashTransfers = mongoose.model("cashTransfers", cashTransferSchema);
export default CashTransfers;