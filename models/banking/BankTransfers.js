import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bankTransferSchema = new Schema({
    date: {
        type: Date
    },

    amount:{
        type:Number
    },

    fromAccount:{
        type: Schema.Types.ObjectId,
        ref: "banks"
    },

    toAccount:{
        type: Schema.Types.ObjectId,
        ref: "banks"
    },


}, {timestamps: true});

const BankTransfers = mongoose.model("bank_transfers", bankTransferSchema);
export default BankTransfers;