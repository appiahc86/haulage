import mongoose from "mongoose";
const Schema = mongoose.Schema;

const billSchema = new Schema({

    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'vendors'
    },

    refNumber: {
        type: String,
        unique: true
    },

    date: {
        type: Date
    },

    type:{
      type: Schema.Types.ObjectId,
      ref: 'expense_types'
    },

    amount: {
        type: Number
    },

    truck: {
        type: Schema.Types.ObjectId,
        ref: 'trucks'
    },

    paid: {
      type: Number,
      default: 0
    },

    description: {
        type: String
    },

    payments: [{
        date: { type: Date },
        amount: { type: Number },
        modeOfPayment: { type: String },
        bankName: { type: String },
        bank: {type: String},
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

}, {timestamps: true});

const Bill = mongoose.model('bills', billSchema);
export default Bill;