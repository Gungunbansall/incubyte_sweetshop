const express = require('express');
const Cart = require('../models/Cart');
const Sweet = require('../models/Sweet');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.sweet');
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const { sweetId, quantity } = req.body;
    
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    
    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.sweet.toString() === sweetId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ sweet: sweetId, quantity });
    }

    await cart.populate('items.sweet');
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.sweet.price * item.quantity);
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    const sweet = await Sweet.findById(item.sweet);
    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    item.quantity = quantity;

    await cart.populate('items.sweet');
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.sweet.price * item.quantity);
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items.pull(req.params.itemId);

    await cart.populate('items.sweet');
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.sweet.price * item.quantity);
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
