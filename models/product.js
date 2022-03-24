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
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }    
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
