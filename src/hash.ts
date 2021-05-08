import Crypto from 'crypto';

import { getConfig } from '@nscode/config';

type TAlgorithm = 'sha256' | 'sha512';

export const hashPassword = (password: string, algorithm: TAlgorithm = 'sha256') =>
  Crypto.createHmac(algorithm, getConfig('SECRET')).update(password).digest('hex');

export const verify = (password: string, passwordHash: string, algorithm: TAlgorithm = 'sha256') =>
  hashPassword(password, algorithm) === passwordHash;

export const hash = (length = 10) => Crypto.randomBytes(length).toString('hex').substr(0, length);
