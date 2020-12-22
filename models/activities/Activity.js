import mongoose from "mongoose";
const Schema = mongoose.Schema;

const activitiesSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    collection: {
        type: String
    },

    status: {
        type: String
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
    }
//




}, {timestamps: true})