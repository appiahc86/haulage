import mongoose from "mongoose";
const Schema = mongoose.Schema;

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

const Truck = mongoose.model('trucks', truckSchema);
export default Truck;