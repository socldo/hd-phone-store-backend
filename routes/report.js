const express = require('express');
const router = express.Router();
const multer = require('multer');
const Report = require('../models/Report');

// Cấu hình lưu trữ với multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // log
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post('', async (req, res) => {

    const { userId, productId, message, type } = req.body;
    console.log(userId, productId, message, type);
    const image = req.file ? req.file.filename : null;

    try {
        const newReport = new Report({
            userId,
            productId,
            message,
            type,
            imagePath: image,
            createdAt: new Date()
        });

        await newReport.save();
        res.send('Báo cáo đã được gửi và lưu vào cơ sở dữ liệu thành công');
    } catch (error) {
        console.error('Lỗi khi lưu vào cơ sở dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi lưu vào cơ sở dữ liệu');
    }
});


router.get('/getReport', async (req, res) => {
    try {
        const cart = await Report.find()
            .populate("productId", "name price image rating type status userId author")
            .populate("userId", "name email");
        res.send(cart);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});


router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id, 'id');
    try {
        const report = await Report.deleteMany({_id: id});
        res.send("Xóa thành công");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});
module.exports = router;
