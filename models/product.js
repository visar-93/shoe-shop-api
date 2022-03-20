const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorSchema = new Schema({
    code: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    sizes: [
        {
            type: Number,
            required: true
        }
    ],
}, { _id: false});

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    colors: [
      colorSchema
    ],    
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
