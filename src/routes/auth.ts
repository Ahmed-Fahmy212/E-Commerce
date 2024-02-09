import express, { Router } from "express";
import { body } from "express-validator/check";
import { PrismaClient } from "@prisma/client";
import authController from "../controllers/auth";
import isAuth from "../middleware/is-auth";

const router: Router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return prisma.user
          .findFirst({ where: { email: value } })
          .then((userDoc) => {
            if (userDoc) {
              return Promise.reject("E-Mail address already exists!");
            }
          });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.post("/logout", (req, res) => {
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