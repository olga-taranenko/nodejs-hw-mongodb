import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.get('/', (req, res) => {
    res.send('Hello world');
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('Internal Server Error');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
