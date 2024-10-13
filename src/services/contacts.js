import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = () => ContactCollection.find();

export const getContactById = (contactId) =>
  ContactCollection.findById(contactId);

export const createContact = (contact) => ContactCollection.create(contact);
