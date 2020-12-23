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

    //Assets
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

//Bills
    refNumber: {
        type: String
    },
    vendor:{
        type: String
    }





}, {timestamps: true})

const Activity = mongoose.model('activities', activitiesSchema);
export default Activity;