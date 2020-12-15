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
    },

    deleted: {
       type: Boolean,
        default: 0
    }

}, {timestamps: true});


//save insurance and road worthy Renewal first
truckSchema.pre('save', async function (next) {

    if (this.deleted == 1){
        await InsuranceRenewal.deleteOne({truck: this._id});
        await RoadWorthyRenewal.deleteOne({truck: this._id});
    }
    else {

        //Save its road worthy record

        const roadWorthyExist = await RoadWorthyRenewal.find({truck: this._id});

        if (roadWorthyExist.length === 0){
            const newRoadworthy = new RoadWorthyRenewal({
                truck: this._id
            });
            await newRoadworthy.save();
        }


        //Save its insurance renewal record
        const insuranceExist = await InsuranceRenewal.find({truck: this._id});

        if (insuranceExist.length === 0){
            const newInsurance = new InsuranceRenewal({
                truck: this._id
            });
            await newInsurance.save();
        }


    }



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