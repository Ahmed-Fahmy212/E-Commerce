const express = require('express');
const router = express.Router();

// after sellecting certain items insid cart you can order them and create an order
router.get("/orders", isAuth, shopController.getOrders);

export { router as ordersRouter };
