const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Sweet = require('../models/Sweet');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/place', auth, async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.sweet');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cart.items) {
      if (item.sweet.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.sweet.name}` 
        });
      }
    }

    const orderItems = cart.items.map(item => ({
      sweet: item.sweet._id,
      name: item.sweet.name,
      price: item.sweet.price,
      quantity: item.quantity
    }));

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      paymentMethod
    });

    await order.save();

    for (const item of cart.items) {
      await Sweet.findByIdAndUpdate(item.sweet._id, {
        $inc: { quantity: -item.quantity }
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ orderDate: -1 })
      .populate('items.sweet');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderDate: -1 })
      .populate('user', 'username email')
      .populate('items.sweet');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('items.sweet');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.sweet');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }

    order.status = 'cancelled';
    await order.save();

    for (const item of order.items) {
      await Sweet.findByIdAndUpdate(item.sweet, {
        $inc: { quantity: item.quantity }
      });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
