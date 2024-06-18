const User = require("../models/User");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Review = require("../models/Review");
const Payment = require("../models/Payment")
const Product = require("../models/Product")
const Report = require("../models/Report")


const chartData = async (req, res) => {
    try {
        const cart = await Cart.find().populate("productId");
        const wishlist = await Wishlist.find().populate("productId");

        const payment = await Payment.find();
        const product = await Product.find();
        const review = await Review.find();
        const report = await Report.find()
            .populate("productId", "name price image rating type status userId author")
            .populate("userId", "firstName lastName email phone");;
        console.log(review, product, payment, wishlist, cart);
        res.send({ review, product, payment, wishlist, cart, report });
    } catch (error) {
        res.send(error);

    }
}
module.exports = { chartData }