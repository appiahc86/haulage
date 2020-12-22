import mongoose from "mongoose";
const Schema = mongoose.Schema;

const salesSchema = new Schema({
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

    transactionType: {
        type: String,
        default: 'sales'
    },

    description: {
        type: String
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

}, {timestamps: true});

const Sale = mongoose.model('sales', salesSchema);
export default Sale;