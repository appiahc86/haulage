import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema({

    saleId: {
        type: String,
        default: ""
    },

    transferId: {
        type: String,
        default: ""
    },

    expenseId: {
        type: String,
        default: ""
    },

    paymentId: {
        type: String,
        default: ""
    },

    amount:{
        type: Number
    },

    transactionType:{
        type: String
    },

    balance:{
        type: Number
    },

    description: {
        type: String
    }



}, {timestamps: true})

const CashTransaction = mongoose.model('cash_transactions', transactionSchema);
export default CashTransaction;