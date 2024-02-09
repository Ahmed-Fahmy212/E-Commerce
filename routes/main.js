const express = require('express');
const cartsRouter = require('./cart');
const productsRouter = require('./products');
const ordersRouter = require('./order');
const authRouter = require('./auth');

const router = express.Router();

router.use('/carts', cartsRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);
router.use('/auth', authRouter);

module.exports = router;
