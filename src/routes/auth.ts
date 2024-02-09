import express, { Router } from "express";
import { body } from "express-validator/check";
import {getUserStatus,login,signup,updateUserStatus}from "../controllers/auth";
import isAuth from "../middleware/is-auth";

const router: Router = express.Router();

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
signup
);

router.post("/login",login);

router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully." });
});

router.get("/status", isAuth,getUserStatus);

router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
updateUserStatus
);

export { router as authRouter };