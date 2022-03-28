const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        chargeId: {
            type: String,
            required: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        productName: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model('Order', orderSchema);
