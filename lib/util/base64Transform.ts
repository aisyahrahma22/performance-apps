import * as Crypto from 'crypto-js';

export function DecryptBase64(data: any) {
  if (!data) return '[]';
  const b64 = Crypto.enc.Hex.parse(data);
  const bytes = b64.toString(Crypto.enc.Base64);
  const decode = Crypto.AES.decrypt(
    bytes,
    `${process.env.SECRET_KEY_CRYPTO || 'secret'}`,
  );
  const decrypted = decode.toString(Crypto.enc.Utf8);
  return decrypted;
}

export function EncryptBase64(data: any) {
  let encrypted = Crypto.AES.encrypt(
    data,
    `${process.env.SECRET_KEY_CRYPTO || 'secret'}`,
  ).toString();
  const b64 = Crypto.enc.Base64.parse(encrypted);
  encrypted = b64.toString(Crypto.enc.Hex);
  return encrypted;
}
