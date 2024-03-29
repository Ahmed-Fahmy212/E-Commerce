import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

import router from './src/main';

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/shop', router);

async function startServer() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('No database URL found');
    }

    await prisma.$connect();
    console.log('Connected to the database');
    app.listen(process.env.PORT, () => {
      console.log('Server is running on port', process.env.PORT);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();