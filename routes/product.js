const express = require('express');
const router = express.Router();
const Product = require('../models/Product')

// to fetch all products
router.get('/fetchproduct', async (req, res) => {
    try {

        const product = await Product.find()
        res.send(product)
    }
    catch (error) {

        res.status(500).send("Có gì đó sai sai")
    }
})

router.get('/buyProduct/:id', async (req, res) => {
    try {
        const product = await Product.find({ customerId: req.params.id })
            .populate("customerId", "phoneNumber firstName lastName email")
            .populate("author", "phoneNumber firstName lastName email");;
        res.send(product)
    }
    catch (error) {

        res.status(500).send("Có gì đó sai sai")
    }
})

// Route lấy danh sách sản phẩm có customerId khác null
router.get('/productOrder', async (req, res) => {
    try {
        const products = await Product.find({ _id: req.params.id, customerId: { $ne: null } })
            .populate("customerId", "phoneNumber firstName lastName email")
            .populate("author", "phoneNumber firstName lastName email");

        res.send(products);
    } catch (error) {
        res.status(500).send("Có gì đó sai sai");
    }
});

// To get Single product
router.get('/fetchproduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        res.send(product)
    } catch (error) {
        res.status(500).send("Có gì đó sai sai")
    }
})
// to get products for single category
router.post('/fetchproduct/type', async (req, res) => {
    const { userType, status } = req.body
    try {
        const product = await Product.find({ type: userType, status: status });

        res.send(product)
    } catch (error) {
        res.status(500).send("Có gì đó sai sai")
    }
})
// to get products category wise
router.post('/fetchproduct/category', async (req, res) => {
    const { userType, userCategory, status } = req.body
    try {
        if (userCategory == "Tất cả") {
            const product = await Product.find({ type: userType, status: status });
            res.send(product)
        }
        else if (userCategory == "Giá từ thấp đến cao") {
            const product = await Product.find({ type: userType, status: status }).sort({ price: 1 })
            res.send(product)
        }
        else if (userCategory == "Giá từ cao đến thấp") {
            const product = await Product.find({ type: userType, status: status }).sort({ price: -1 })
            res.send(product)
        }
        else if (userCategory == "Đánh giá cao") {
            const product = await Product.find({ type: userType, status: status }).sort({ rating: -1 })
            res.send(product)
        }
        else if (userCategory == "Đánh giá thấp") {
            const product = await Product.find({ type: userType, status: status }).sort({ rating: 1 })
            res.send(product)
        }
        else {
            const product = await Product.find({ type: userType, category: userCategory })
            res.send(product)
        }
    } catch (error) {
        res.status(500).send("Có gì đó sai sai")
    }
})


// to get products for single category
router.post('/change-status', async (req, res) => {
    const { id, status } = req.body
    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).send("Không tìm thấy sản phẩm");
        }
        product.status = status;
        await product.save(product);

        res.send(true)
    } catch (error) {
        res.status(500).send("Có gì đó sai sai")
    }
})
// to search products added search filters on frontend so no need to create separate api for this

// router.get('/search/:key', async (req, res) => {
//     const { key } = req.params
//     try {
//         if (key.length > 0) {
//             const product = await Product.find({
//                 $or: [
//                     { name: { $regex: key, $options: "i" } },
//                     { type: { $regex: key, $options: "i" } },
//                     { brand: { $regex: key, $options: "i" } },
//                     { category: { $regex: key, $options: "i" } },
//                     { author: { $regex: key, $options: "i" } },
//                     { description: { $regex: key, $options: "i" } },
//                     { gender: { $regex: key, $options: "i" } },
//                 ]
//             })
//             if (product.length <= 0) {
//                 res.status(400).send("Product not found")
//             }
//             else {
//                 res.send(product)
//             }
//         }

//     } catch (error) {
//         res.status(400).send("Có gì đó sai sai")
//     }
// })




module.exports = router