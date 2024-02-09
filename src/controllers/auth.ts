import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../util/prisma';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.') as any;
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const result = await prisma.user.create({
      data: {
        email: email,
        password: hashedPw,
        name: name
      }
    });
    res.status(201).json({ message: 'User created!', userId: result.id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const loadedUser = await prisma.user.findUnique({ where: { email: email } });
    if (!loadedUser) {
      const error = new Error('A user with this email could not be found.') as any;
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, loadedUser.password);
    if (!isEqual) {
      const error = new Error('Wrong password!') as any;
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser.id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: loadedUser.id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.userId) } });
    if (!user) {
      const error = new Error('User not found.') as any;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  const newStatus = req.body.status;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.userId) } });
    if (!user) {
      const error = new Error('User not found.') as any;
      error.statusCode = 404;
      throw error;
    }
    const updatedUser = await prisma.user.update({
      where: { id: Number(req.userId) },
      data: { status: newStatus }
    });
    res.status(200).json({ message: 'User updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};