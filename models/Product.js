const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductSchema = new Schema({
    name: String,
    brand: String,
    price: Number,
    category: String,
    image: [],
    rating: Number,
    type: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    description: String,
    userId: String,
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status : String
})

module.exports = mongoose.model("product", ProductSchema)