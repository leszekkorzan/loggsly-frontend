import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8';

const encryptFn = (text, pass) => aes.encrypt(text, pass).toString();
const decryptFn = (text, pass) => {
  const bytes = aes.decrypt(text, pass);
  return bytes.toString(enc);
};
export { encryptFn, decryptFn };
