import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

 const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  console.log("💛 ",authHeader);
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    (error as any).statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    if (!token) {
      const error = new Error("Token not found.");
      (error as any).statusCode = 401;
      throw error;
    }
    const secret = process.env.JWT_SECRET || (() => { throw new Error("No secret found."); });
    decodedToken = jwt.verify(token, secret);
  } catch (err) {
    (err as any).statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    (error as any).statusCode = 401;
    throw error;
  }
  (req as any).userId = (decodedToken as any).userId;
  next();
};

export default isAuth;
