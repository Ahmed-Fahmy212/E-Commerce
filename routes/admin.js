
const express = require('express');
const router = express.Router();
const { postAddProduct, updateProduct, deleteProduct } = require('../controllers');

router.post('/products', isAuth,postAddProduct);
router.put('/products/:id',isAuth, updateProduct);
router.delete('/products/:productId',isAuth, deleteProduct);

module.exports = router;
