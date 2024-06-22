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
    author: String,
    description: String,
    userId: String,
    status: String,
})

module.exports = mongoose.model("product", ProductSchema)