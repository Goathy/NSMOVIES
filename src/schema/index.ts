import Joi from 'joi';

import type { TLoginPayload, TRegisterPayload } from '../routes';

export const RegisterPayloadSchema = Joi.object<TRegisterPayload>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  type: Joi.number().allow(0, 1),
  username: Joi.string().required(),
});

export const LoginPayloadSchema = Joi.object<TLoginPayload>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
