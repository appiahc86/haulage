import mongoose from "mongoose";
const Schema = mongoose.Schema;

const insuranceSchema = new Schema({

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

const InsuranceRenewal = mongoose.model('insuranceRenewals', insuranceSchema);
export default InsuranceRenewal;