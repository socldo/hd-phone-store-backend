const mongoose = require('mongoose');
const { Schema } = mongoose;
const OrderSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    price: Number,
}, { timestamps: true })

module.exports = mongoose.model("orderDetail", OrderSchema)