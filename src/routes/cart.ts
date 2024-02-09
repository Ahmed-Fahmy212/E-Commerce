import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { getIndex, getCart, postCart, postCartDeleteProduct, postOrder } from "../controllers/shop";
import isAuth from "../middleware/is-auth";

const router: Router = Router();

router.get("/", getIndex);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.post("/create-order", isAuth, postOrder);

export { router as cartsRouter };
