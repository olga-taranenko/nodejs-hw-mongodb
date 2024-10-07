import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getAllContacts, getContactById } from './services/contacts.js';

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

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    try {
      const contact = await getContactById(contactId);
      if (!contact) {
        res.status(404).json({ message: 'Contact not found' });
        return;
      }

      res.status(200).json({
        data: contact,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
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
