import express from 'express';
import cartsRouter from './routes/cart';
import productsRouter from './routes/products';
import ordersRouter from './routes/order';
import authRouter from './routes/auth';

const router = express.Router();

router.use('/carts', cartsRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);
router.use('/auth', authRouter);

export default router;
