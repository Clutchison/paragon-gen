import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

// Routers
import { CardRouter } from './cards/card.router';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const url = 'mongodb://172.29.224.1:27017/paragon';
mongoose.connect(url).then(_ => {
  console.log('Connected to db');
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/card', CardRouter.instance().router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

