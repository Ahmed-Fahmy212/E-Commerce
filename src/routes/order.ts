import express, { Router } from 'express';
import { isAuth } from '';
import { getOrders } from '../controllers/shop';

const router: Router = express.Router();

// after selecting certain items inside cart you can order them and create an order
router.get("/orders", isAuth, getOrders);

export { router as ordersRouter };
