import prisma from '../util/prisma'

export const getProduct = async (req: any, res: any, next: any) => {
  const prodId = parseInt(req.params.productId);
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: prodId,
      },
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIndex = async (req: any, res: any, next: any) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req: any, res: any, next: any) => {
  try {
    
    const cart = await prisma.cart.findFirst({
      where: {
        userId: +req.user.id,
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

export const postCart = async (req: any, res: any, next: any) => {
  const prodId = parseInt(req.body.productId);
  let fetchedCart;
  try {
    const cart = await prisma.cart.findFirst({
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
      const item = await prisma.cartItem.findFirst({
        where: {
            productId: product.id,
            cartId: cart?.id,
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
                id: cart?.id,
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

export const postCartDeleteProduct = async (req: any, res: any, next: any) => {
  const prodId = parseInt(req.body.productId);
  try {
    const item = await prisma.cartItem.findFirst({
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
export const postOrder = async (req: any, res: any, next: any) => {
  let fetchedCart;
  try {
    const cart = await prisma.cart.findFirst({ //user cart which have products now
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
    const products = cart?.cartItems.map((cartItem: any) => {
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
        orderItems: {
          create: products?.map((product: any) => {
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
export const getOrders = async (req: any, res: any, next: any) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        orderItems: {
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