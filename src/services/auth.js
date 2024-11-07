import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { env } from '../utils/env.js';

import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

import { sendMail } from '../utils/sendMail.js';

import { createSession } from '../utils/createSession.js';
import { TEMPLATES_DIR } from '../constants/index.js';

export const findUserByEmail = (email) => UserCollection.findOne({ email });

export const registerUser = async (userData) => {
  userData.password = await bcrypt.hash(userData.password, 10);
  return UserCollection.create(userData);
};

export const createActiveSession = async (userId) => {
  await SessionCollection.deleteOne({ userId });
  return SessionCollection.create({ userId, ...createSession() });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (session === null) {
    throw createHttpError(401, 'Session is not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return SessionCollection.create({ userId: session.userId, ...newSession });
};

export const logoutUser = (sessionId) => {
  return SessionCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    env('JWT_SECRET'),
    { expiresIn: '5m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.error(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (password, token) => {
  try {
    const decoded = jwt.verify(token, env('JWT_SECRET'));

    const user = await UserCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (user === null) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserCollection.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    await SessionCollection.deleteOne({ userId: user._id });
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    throw error;
  }
};
