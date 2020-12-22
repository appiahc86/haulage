import mongoose from "mongoose";
const Schema = mongoose.Schema;

const depSchema = new Schema({

  truck: {
      type: Schema.Types.ObjectId,
      ref: 'trucks'
  },

   date: {
      type: Date
   },

    amount: {
      type: Number
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }


}, {timestamps: true})

const Depreciation = mongoose.model('Depreciation', depSchema);
export default Depreciation;