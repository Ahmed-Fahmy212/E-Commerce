
const express = require('express');
const router = express.Router();
const { postAddProduct, updateProduct, deleteProduct } = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// returning products this admin added
router.post('/products', isAuth,postAddProduct);

router.put('/products/:id',isAuth, updateProduct);

router.delete('/products/:productId',isAuth, deleteProduct);


router.get("/products/user", shopController.getProducts);

router.get("/products/:productId/user", shopController.getProduct);


export { router as productsRouter };
