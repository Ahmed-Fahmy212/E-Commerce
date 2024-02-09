import express from 'express';
import { Router } from 'express';
import { postAddProduct, updateProduct, deleteProduct } from '../controllers/admin';
import isAuth from '../middleware/is-auth';
import { getProducts, getProduct } from '../controllers/shop';

const router: Router = express.Router();

// returning products on website all without using login
router.post('/products/user', isAuth, postAddProduct);

router.put('/products/:id/user', isAuth, updateProduct);

router.delete('/products/:id/user', isAuth, deleteProduct)

//////////////////////////////////////////////////////////////////////////
router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

export { router as productsRouter };
