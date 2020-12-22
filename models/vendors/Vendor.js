import mongoose from "mongoose";
const Schema = mongoose.Schema;

const vendorSchema = new Schema({

name: {
    type: String,
    unique: true
},

location: {
    type: String
},

contact: {
    type: String
},

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

});

const Vendor = mongoose.model('vendors', vendorSchema);
export default Vendor;