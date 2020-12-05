import mongoose from "mongoose";
const Schema = mongoose.Schema;

const roadWorthy = new Schema({

    truck: {
        type: Schema.Types.ObjectId,
        ref: "trucks"
    },

    renewalDate: {
        type: Date,
        default: Date.now
    },

    expirationDate: {
        type: Date,
        default: Date.now
    }


},{timestamps: true});

const RoadWorthyRenewal = mongoose.model('roadWorthyRenewals', roadWorthy);
export default RoadWorthyRenewal;