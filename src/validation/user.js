import Joi from 'joi';

export const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contact name should be a string',
    'string.min': 'Contact name should have at least 3 characters',
    'string.max': 'Contact name should have at most 20 characters',
    'any.required': 'Contact name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a string',
    'string.email': 'The email is not a valid e-mail',
    'any.required': 'Contact name is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Email should be a string',
    'any.required': 'Contact name is required',
  }),
});

export const userLoginShema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
