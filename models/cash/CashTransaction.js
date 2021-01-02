import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema({

    saleId: {
        type: String
    },

    expenseId: {
        type: String
    },

    paymentId: {
        type: String
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