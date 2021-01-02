import mongoose from "mongoose";
const Schema = mongoose.Schema;

const transactionSchema = new Schema({

    bankId: {
        type: String
    },

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

const BankTransaction = mongoose.model('bank_transactions', transactionSchema);
export default BankTransaction;