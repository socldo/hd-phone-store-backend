const mongoose = require('mongoose');
const { Schema } = mongoose;
const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
    ,
    status: String,
    totalAmount: Number
}, { timestamps: true })

module.exports = mongoose.model("order", OrderSchema)