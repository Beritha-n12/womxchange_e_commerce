const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: ['vendor'] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // req.user set by authMiddleware
    const { name, description, price } = req.body;
    const userId = req.user.id;

    const product = await Product.create({ name, description, price, userId });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only vendor who owns or admin can update
    if (req.user.role !== 'admin' && req.user.id !== product.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    product.name = name;
    product.description = description;
    product.price = price;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only vendor who owns or admin can delete
    if (req.user.role !== 'admin' && req.user.id !== product.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await product.destroy();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
