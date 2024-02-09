const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const prisma = require('./prisma/schema.prisma');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to the database');
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();