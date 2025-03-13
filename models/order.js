const mongoose = require('mongoose');
const { Product, productSchema } = require('./product');

const orderSchema = new mongoose.Schema({ // ✅ Fixed the typo
    products: [
        {
            product: productSchema,
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
    totalprice: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
    orderedAt: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        default: 0,
    }
});

const Order = mongoose.model('Order', orderSchema); // ✅ Now correctly defined
module.exports = Order;
