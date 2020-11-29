import mongoose from "mongoose";
const Schema = mongoose.Schema;

const assetAccountSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },

    date: {
        type: Date
    },

    truck: {
        type: Schema.Types.ObjectId,
        ref: 'trucks'
    },

    mode:{
        type: String
    },

    bank: {
        type: String
    },

    bankAccountNumber:{
        type: String
    },

    description: {
        type: String
    }

}, {timestamps: true});

const AssetAccount = mongoose.model('asset_accounts', assetAccountSchema);
export default AssetAccount;