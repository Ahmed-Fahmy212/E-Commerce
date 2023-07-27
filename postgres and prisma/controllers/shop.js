const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProduct = async (req, res, next) => {
  const prodId = parseInt(req.params.productId);
  try {
    const product = await prisma.product.findOne({
      where: {
        id: prodId,
      },
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: req.user.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = parseInt(req.body.productId);
  let fetchedCart;
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: req.user.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    fetchedCart = cart;
    const products = await prisma.product.findMany({
      where: {
        id: prodId,
      },
    });
    let product;
    if (products.length > 0) {
      product = products[0];
    }

    if (product) {
      const item = await prisma.cartItem.findUnique({
        where: {
            productId: product.id,
            cartId: cart.id,
        },
      });
      if (item) {
        const newQuantity = item.quantity + 1;
        await prisma.cartItem.update({
          where: {
            id: item.id,
          },
          data: {
            quantity: newQuantity,
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            quantity: 1,
            product: {
              connect: {
                id: product.id,
              },
            },
            cart: {
              connect: {
                id: cart.id,
              },
            },
          },
        });
      }
    } else {
      throw new Error('Product not found');
    }

    res.redirect('/cart');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = parseInt(req.body.productId);
  try {
    const item = await prisma.cartItem.findUnique({
      where: {
        
          productId: prodId,
          cartId: req.user.cart.id,
        
      },
    });
    if (!item) {
      throw new Error('Item not found in cart');
    }
    await prisma.cartItem.delete({
      where: {
        id: item.id,
      },
    });
    res.redirect('/cart');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Create a new order for the user and add the products in the cart to the order
exports.postOrder = async (req, res, next) => {
  let fetchedCart;
  try {
    const cart = await prisma.cart.findUnique({ //user cart which have products now
      where: {
        userId: req.user.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    fetchedCart = cart;
    const products = cart.cartItems.map((cartItem) => {
      return {
        id: cartItem.product.id,
        quantity: cartItem.quantity,
      };
    });
    const order = await prisma.order.create({ //user ->order 
      data: {
        user: {
          connect: {
            id: req.user.id,
          },
        },
        products: {
          create: products.map((product) => {
            return {
              quantity: product.quantity,
              product: {
                connect: {
                  id: product.id,
                },
              },
            };
          }),
        },
      },
    });
    await prisma.cartItem.deleteMany({
      where: {
        cartId: fetchedCart.id,
      },
    });
    res.status(201).json({
      message: 'Order placed successfully',
      order: order,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to place order',
      error: err,
    });
  }
};

// Get all orders for the user, including the associated products
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    res.status(200).json({
      message: 'Orders fetched successfully',
      orders: orders,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch orders',
      error: err,
    });
  }
};