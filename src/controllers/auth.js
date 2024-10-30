import createHttpError from 'http-errors';
import {
  createActiveSession,
  findUserByEmail,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.js';
import bcrypt from 'bcrypt';
import { setUpSession } from '../utils/setUpSession.js';

export const userRegisterController = async (req, res) => {
  const user = await findUserByEmail(req.body.email);
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { name: req.body.name, email: req.body.email },
  });
};

export const userLoginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (user === null) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const newSession = await createActiveSession(user._id);

  setUpSession(res, newSession);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: newSession.accessToken },
  });
};

export const userRefreshController = async (req, res) => {
  const session = await refreshSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setUpSession(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const userLogoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.sendStatus(204);
};
