import mongoose from "mongoose";
const Schema = mongoose.Schema;

const expense = new Schema({

    name: {
        type: String,
        unique: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

}, {timestamps: true});

const ExpenseType = mongoose.model('expense_types', expense);

export default ExpenseType;