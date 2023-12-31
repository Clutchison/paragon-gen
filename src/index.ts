import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { MongoClient } from 'mongodb';

// Routers
import { itemsRouter } from './items/items.router';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const url = 'mongodb://172.29.224.1:27017/paragon';
MongoClient.connect(url).then((_: MongoClient) => {
  console.log('Connected to db');
}).catch(err => {
  throw Error(err);
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/menu/items', itemsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
