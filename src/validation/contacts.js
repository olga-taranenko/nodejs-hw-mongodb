import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contact name should be a string',
    'string.min': 'Contact name should have at least 3 characters',
    'string.max': 'Contact name should have at most 20 characters',
    'any.required': 'Contact name is required',
  }),
  phoneNumber: Joi.string().required().messages({
    'string.base': 'Phonenumber should be a string',
    'any.required': 'Phonenumber is required',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email should be a string',
    'string.email': 'The email is not a valid e-mail',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'The favourite should be true or false',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.base': 'Contact type should be a string',
      'any.required': 'Contact type is required',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Contact name should be a string',
    'string.min': 'Contact name should have at least 3 characters',
    'string.max': 'Contact name should have at most 20 characters',
  }),
  phoneNumber: Joi.string().messages({
    'string.base': 'Phonenumber should be a string',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email should be a string',
    'string.email': 'The email is not a valid e-mail',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'The favourite should be true or false',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.base': 'Contact type should be a string',
  }),
});
