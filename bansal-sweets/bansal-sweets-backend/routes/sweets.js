const express = require('express');
const Sweet = require('../models/Sweet');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.send(sweets);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/search', async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    const sweets = await Sweet.find(query);
    res.send(sweets);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).send(sweet);
  } catch (error) {
    console.error('Error adding sweet:', error);
    res.status(400).json({ error: error.message || 'Failed to add sweet' });
  }
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    res.send(sweet);
  } catch (error) {
    console.error('Error updating sweet:', error);
    res.status(400).json({ error: error.message || 'Failed to update sweet' });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    res.send(sweet);
  } catch (error) {
    console.error('Error deleting sweet:', error);
    res.status(500).json({ error: error.message || 'Failed to delete sweet' });
  }
});

router.post('/:id/purchase', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).send();
    if (sweet.quantity <= 0) return res.status(400).send({ error: 'Out of stock' });
    sweet.quantity -= 1;
    await sweet.save();
    res.send(sweet);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/:id/restock', auth, adminAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    sweet.quantity += quantity;
    await sweet.save();
    res.send(sweet);
  } catch (error) {
    console.error('Error restocking sweet:', error);
    res.status(400).json({ error: error.message || 'Failed to restock sweet' });
  }
});

module.exports = router;
