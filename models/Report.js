const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        type: String, required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', type: String, required: true
    },
    message: { type: String, required: true },
    type: { type: String, required: true },
    imagePath: { type: String, required: false }
});

const Report = mongoose.model('report', reportSchema);

module.exports = Report;