import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = ContactCollection.find();

  if (typeof filter.type !== 'undefined') {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (typeof filter.isFavourite !== 'undefined') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [total, contacts] = await Promise.all([
    ContactCollection.countDocuments(contactsQuery),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
};

export const getContactById = (contactId) =>
  ContactCollection.findById(contactId);

export const createContact = (contact) => ContactCollection.create(contact);

export const updateContact = (contactId, contact) =>
  ContactCollection.findByIdAndUpdate(contactId, contact, { new: true });

export const deleteContact = (contactId) =>
  ContactCollection.findByIdAndDelete(contactId);
