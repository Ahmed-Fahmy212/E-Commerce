import express from 'express';
import { Router } from 'express';
import { postAddProduct, updateProduct, deleteProduct } from '../controllers/admin';
import isAuth from '../middleware/is-auth';
import { getProducts, getProduct } from '../controllers/shop';

const router: Router = express.Router();

// returning products this admin added
router.post('/products', isAuth, postAddProduct);

router.put('/products/:id', isAuth, updateProduct);

router.delete('/products/:productId', isAuth, deleteProduct);

router.get("/products/user", getProducts);

router.get("/products/:productId/user", getProduct);

export { router as productsRouter };
