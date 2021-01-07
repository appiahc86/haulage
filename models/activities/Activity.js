import mongoose from "mongoose";
const Schema = mongoose.Schema;

const activitiesSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    table: {
        type: String
    },

    status: {
        type: String
    },

    details: {
      type: String
    },

    amount:{
      type: Number
    },

    //sales
    saleId: {
        type: String
    },

    //Assets
    truckId: {
      type: String
    },

    licenseNumber: {
        type: String
    },

    cost:{
        type: Number
    },

    //Banking
    bank:{
        type: String
    },

    balance: {
        type: Number
    },
//Transfers
    fromAcc: {
        type: String
    },
    toAcc: {
        type: String
    },

//Bills and Payments
    billId: {
        type: String
    },

    paymentId: {
        type: String
    },

    refNumber: {
        type: String
    },

    vendor:{
        type: String
    },

//Depreciation
    depreciationId: {
        type: String
    },

truck:{
        type: String
},

//Expenses
    expenseId: {
        type: String
    },

    expenseType:{
        type: String
    },

    modeOfPayment: {
        type: String
    }

}, {timestamps: true})

const Activity = mongoose.model('activities', activitiesSchema);
export default Activity;