const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authUser = require("../middleware/authUser");

// get all cart products
router.get("/fetchcart", authUser, async (req, res) => {
    try {
        console.log('user', req.user.id);
        const cart = await Cart.find({ user : req.user.id, status: { $ne: 'Đã đặt' }  })
            .populate("productId", "name price image rating type status userId author")
            .populate("user", "name email")
            .populate("author", "name email");
        res.send(cart);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

//
router.get("/orderedProduct/:id", authUser, async (req, res) => {
    console.log(req.params.id);
    try {
        const cart = await Cart.find({ productId: req.params.id, status: 'Đã đặt' })
            .populate("productId", "name price image rating type status userId author")
            .populate("user", "lastName firstName phoneNumber email")
            .populate("author", "name email");
        res.send(cart);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});


// add to cart
router.post("/addcart", authUser, async (req, res) => {
    try {
        const { _id, quantity, author} = req.body;
        const findProduct = await Cart.findOne({ $and: [{ productId: _id }, { user: req.user.id }] })
        if (findProduct) {
            return res.status(400).json({ msg: "Sản phẩm đã tồn tại trong giỏ hàng" })
        }
        else {
            const user = req.header;
            const cart = new Cart({
                user: req.user.id,
                productId: _id,
                quantity: 1,
                status: 'Đang bán',
                author: author
            });
            const savedCart = await cart.save();
            res.send(savedCart);
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// remove from cart
router.delete("/deletecart/:id", authUser, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Cart.findByIdAndDelete(id)
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});
module.exports = router;
