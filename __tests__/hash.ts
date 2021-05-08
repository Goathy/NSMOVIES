import { hash, hashPassword, verify } from '../src/hash';

describe('Hash module', () => {
  it('Should hash password', () => {
    const password = 'strongPassword';
    const passwdHash = hashPassword(password);
    const verified = verify(password, passwdHash);

    expect(verified).toBeTruthy();
  });

  it('Should generate hash of specified length', () => {
    const hashLength = hash(30).length;

    expect(hashLength).toBe(30);
  });
});
