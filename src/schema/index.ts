import Joi from 'joi';

import type { TRegisterPayload } from '../routes';

export const RegisterPayloadSchema = Joi.object<TRegisterPayload>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6),
  type: Joi.number().allow([0, 1]),
  username: Joi.string().required(),
});
