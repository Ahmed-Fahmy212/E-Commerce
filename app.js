const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// 
// const errorController = require('./controllers/error');
const prisma = require('./prisma/schema.prisma');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);

async function startServer() {
  await prisma.$connect();
  await setupDatabase();

  app.listen(3001);
}

startServer().catch(err => {
  console.error(err);
  process.exit(1);
});