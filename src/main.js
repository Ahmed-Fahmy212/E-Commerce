const express = require('express');
const cartsRouter = require('./routes/cart');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/order');
const authRouter = require('./routes/auth');

const router = express.Router();

router.use('/carts', cartsRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);
router.use('/auth', authRouter);

module.exports = router;
