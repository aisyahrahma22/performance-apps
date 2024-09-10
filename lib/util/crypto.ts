import * as Crypto from 'crypto-js';

export function Encrypt(value: string) {
  return Crypto.AES.encrypt(
    value,
    process.env.SECRET_KEY_CRYPTO || 'secret',
  ).toString();
}

export function Decrypt(chiperText: string) {
  const bytes = Crypto.AES.decrypt(
    chiperText,
    process.env.SECRET_KEY_CRYPTO || 'secret',
  );
  return bytes.toString(Crypto.enc.Utf8);
}
