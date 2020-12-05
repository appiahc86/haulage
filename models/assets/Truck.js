import mongoose from "mongoose";
const Schema = mongoose.Schema;

import InsuranceRenewal from "../renewals/Insurance.js";
import RoadWorthyRenewal from "../renewals/RoadWorthy.js";

const truckSchema = new Schema({
   licenseNumber: {
       type: String,
       required: true,
       unique: true,
       trim: true
   } ,

    datePurchased: {
       type: Date,
        required: true
    },

    amount: {
       type: Number,
        required: true
    },

    depreciation: {
       type: Number,
        required: true
    },

    description: {
       type: String,
        trim: true
    }

}, {timestamps: true});


//save insurance and road worthy Renewal first
truckSchema.pre('save', async function (next) {

    //Save its road worthy record
    const newRoadworthy = new RoadWorthyRenewal({
        truck: this._id
    });

    await newRoadworthy.save();

    //Save its insurance renewal record
    const newInsurance = new InsuranceRenewal({
        truck: this._id
    });

    await newInsurance.save();


    next()
});



//Remove insurance and road worthy Renewal first
truckSchema.pre('remove', async function (next) {

    //Remove its road worthy record
   await RoadWorthyRenewal.deleteOne({truck: this._id});

    //Remove its insurance renewal record
    await InsuranceRenewal.deleteOne({truck: this._id});


    next()
});


const Truck = mongoose.model('trucks', truckSchema);
export default Truck;