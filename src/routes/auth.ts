import express, { Router } from "express";
import { body } from "express-validator";
import { PrismaClient } from "@prisma/client";
import * as authController from "../controllers/auth";
import isAuth from "../middleware/is-auth";

const prisma = new PrismaClient();
const router: Router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value: string, { req }) => {
        const userDoc = await prisma.user.findUnique({ where: { email: value } });
        if (userDoc) {
          return Promise.reject("E-Mail address already exists!");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.post("/logout", (req: express.Request, res: express.Response) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully." });
});

router.get("/status", isAuth, authController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authController.updateUserStatus
);

export { router as authRouter };
