const express = require('express');
const userRouter = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/user');
const { Product } = require('../models/product');
const Order = require('../models/order');

// ✅ ADD TO CART
userRouter.post("/api/add-to-cart", auth, async (req, res) => {
  try {
    const { id } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let user = await User.findById(req.user);
    let isProductFound = false;

    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.toString() === product._id.toString()) {
        isProductFound = true;
        user.cart[i].quantity += 1;
        break;
      }
    }

    if (!isProductFound) {
      user.cart.push({
        product: product.toObject(),
        quantity: 1
      });
    }

    await user.save();
    res.json(user);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ REMOVE FROM CART
userRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cartItemIndex = user.cart.findIndex(
      (cartItem) => cartItem.product._id.equals(product._id)
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ error: "Product not in cart" });
    }

    if (user.cart[cartItemIndex].quantity === 1) {
      user.cart.splice(cartItemIndex, 1);
    } else {
      user.cart[cartItemIndex].quantity -= 1;
    }

    await user.save();
    res.json(user);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ SAVE USER ADDRESS
userRouter.post("/api/save-user-address", auth, async (req, res) => {
  try {
    const { address } = req.body;
    let user = await User.findById(req.user);

    user.address = address;
    user = await user.save();

    res.json(user);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ ORDER PRODUCT
userRouter.post("/api/order", auth, async (req, res) => {
  try {
    const { cart, totalPrice, address } = req.body;

    let products = [];

    for (let i = 0; i < cart.length; i++) {
      let product = await Product.findById(cart[i].product._id);

      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }

      if (product.quantity >= cart[i].quantity) {
        product.quantity -= cart[i].quantity;

        products.push({
          product: product.toObject(),
          quantity: cart[i].quantity
        });

        await product.save();
      } else {
        return res.status(400).json({ msg: `${product.name} is out of stock` });
      }
    }

    let user = await User.findById(req.user);
    user.cart = [];
    await user.save();

    const order = new Order({
      products,
      totalprice: totalPrice,
      address,
      userId: req.user,
      orderedAt: Date.now(), // ✅ Correct field name
    });

    await order.save();

    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: e.message });
  }
});

// ✅ GET USER ORDERS
userRouter.get('/api/order/me', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = userRouter;
