import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = () => ContactCollection.find();

export const getContactById = (contactId) =>
  ContactCollection.findById(contactId);

export const createContact = (contact) => ContactCollection.create(contact);

export const updateContact = (contactId, contact) =>
  ContactCollection.findByIdAndUpdate(contactId, contact, { new: true });

export const deleteContact = (contactId) =>
  ContactCollection.findByIdAndDelete(contactId);
