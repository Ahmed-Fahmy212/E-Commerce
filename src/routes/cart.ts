import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { getIndex, getCart, postCart, postCartDeleteProduct, postOrder } from "../controllers/shop";
import isAuth from "../middleware/is-auth";

const router: Router = Router();

router.get("/", getIndex);


router.use(isAuth)
router.get("/cart", getCart);

router.post("/cart", postCart);

router.post("/cart-delete-item", postCartDeleteProduct);

router.post("/create-order", postOrder);

export { router as cartsRouter };
