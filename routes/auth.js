const express = require('express');
const { body } = require('express-validator/check');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth'); 

const router = express.Router();

router.post( 
  '/signup',
  [ 
    body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
        return prisma.User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);


router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'User logged out successfully.' });
  });



router.get('/status', isAuth, authController.getUserStatus);

router.patch( 
  '/status',
  isAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.updateUserStatus
);
module.exports = router;