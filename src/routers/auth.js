import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  userLoginController,
  userLogoutController,
  userRefreshController,
  userRegisterController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import {
  requestResetEmailSchema,
  resetPasswordSchema,
  userLoginShema,
  userRegisterSchema,
} from '../validation/user.js';

const router = Router();

router.post(
  '/register',
  validateBody(userRegisterSchema),
  ctrlWrapper(userRegisterController),
);

router.post(
  '/login',
  validateBody(userLoginShema),
  ctrlWrapper(userLoginController),
);

router.post('/refresh', ctrlWrapper(userRefreshController));

router.post('/logout', ctrlWrapper(userLogoutController));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
