import mongoose from "mongoose";
const Schema = mongoose.Schema;

const newDriver = new Schema({
    truck: {
        type: String
    },

    name: {
        type: String
    },

    renewalDate: {
        type: Date
    },

    expirationDate: {
        type: Date
    }


}, {timestamps: true})

const DriversLicense = mongoose.model('drivers_licenses', newDriver);

export default DriversLicense;