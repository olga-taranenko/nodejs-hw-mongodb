import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

import { createSession } from '../utils/createSession.js';

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

  await SessionCollection.deleteOne({ _id: sessionId });

  return SessionCollection.create({ userId: session._id, ...createSession() });
};

export const logoutUser = (sessionId) => {
  return SessionCollection.deleteOne({ _id: sessionId });
};
