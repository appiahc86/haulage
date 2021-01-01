import mongoose from "mongoose";
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },

    date: {
        type: Date
    },

    truck: {
        type: Schema.Types.ObjectId,
        ref: 'trucks'
    },

    mode:{
        type: String
    },

    bank: {
        type: String
    },

    bankAccountNumber:{
        type: String
    },

   expenseType: {
        type: Schema.Types.ObjectId,
        ref: 'expense_types'
    },

    description: {
        type: String
    },

    saleId:{
        type: String,
        default: ''
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

}, {timestamps: true});

const Expense = mongoose.model('expenses', expenseSchema);
export default Expense;