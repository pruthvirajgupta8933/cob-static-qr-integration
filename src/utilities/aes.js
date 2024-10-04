import CryptoJS from "crypto-js"


const Encrypt = (plaintext, key, iv) => {

  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  let srcs = CryptoJS.enc.Utf8.parse(plaintext);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};


const Decrypt = (ciphertext, key, iv) => {
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  let decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}


function fixKey(key) {
  const CIPHER_KEY_LEN = 16;
  if (key.length < CIPHER_KEY_LEN) {
      return key.padEnd(CIPHER_KEY_LEN, '0'); // Pad with '0' if key is less than 16 bytes
  }
  if (key.length > CIPHER_KEY_LEN) {
      return key.slice(0, CIPHER_KEY_LEN); // Trim the key if it's longer than 16 bytes
  }
  return key;
}

// AES Encryption Function
export function encryptPHP7(data, key, iv) {
  try {

    // Fix the key to ensure it's 16 bytes
      const fixedKey = fixKey(key);

      
      // Parse the key and IV to CryptoJS format (WordArray)
      const keyUtf8 = CryptoJS.enc.Utf8.parse(fixedKey);
      const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);

      // Encrypt the data using AES/CBC/PKCS7Padding
      const encrypted = CryptoJS.AES.encrypt(data, keyUtf8, {
          iv: ivUtf8,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });

      // Convert encrypted data and IV to Base64
      const encryptedDataInBase64 = encrypted.toString();
      const ivInBase64 = CryptoJS.enc.Base64.stringify(ivUtf8);

      // Return the encrypted data with IV appended at the end
      return `${encryptedDataInBase64}:${ivInBase64}`;
  } catch (error) {

      throw new Error('Encryption failed due to an unexpected error.');
  }
}

// AES Decryption Function For PHP7
export function decryptPHP7(data, key) {
  try {
      // Split the encrypted data and the IV (separated by ':')
    const parts = data.split(':');
    if (parts.length !== 2) {
          throw new Error('Invalid encrypted data format.');
      }

      // Parse the IV and encrypted data from Base64
      const encryptedData = parts[0];
      const ivBase64 = parts[1];

      // Fix the key to ensure it's 16 bytes
      const fixedKey = fixKey(key);

      // Convert key and IV to WordArray
      const keyUtf8 = CryptoJS.enc.Utf8.parse(fixedKey);
      const ivUtf8 = CryptoJS.enc.Base64.parse(ivBase64);

      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(encryptedData, keyUtf8, {
          iv: ivUtf8,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });

      // Convert decrypted WordArray to UTF-8 string
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      return decryptedText;
  } catch (error) {
      throw new Error('Decryption failed due to an unexpected error.');
  }
}


function sha256(key) {
  return CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(key));
}

// Function to generate an MD5 hash (used for IV)
function md5(key) {
  return CryptoJS.MD5(CryptoJS.enc.Utf8.parse(key));
}

// AES Encryption Function
// str, authKey, authIV
export function encryptAES256HEX(toBeEncryptString, key, authIV ) {
  if (!toBeEncryptString) {
    throw new Error('String to be encrypted must not be null');
  }
  try {
      // Generate the key using SHA-256
      const secretKey = sha256(key);

      // Generate the IV using MD5
    const iv = md5(authIV);

      const encrypted = CryptoJS.AES.encrypt(toBeEncryptString, secretKey, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });

      // Return the encrypted string in Base64 format
      return encrypted.toString();
  } catch (error) {
    return null;
  }
}

// AES Decryption Function
export function decryptAES256HEX(key, toBeDecryptString) {
  if (!toBeDecryptString) {
      throw new Error('String to be decrypted must not be null');
  }
  try {
      // Generate the key using SHA-256
      const secretKey = sha256(key);

      // Generate the IV using MD5
      const iv = md5(key);

      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(toBeDecryptString, secretKey, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });

      // Convert decrypted WordArray to UTF-8 string
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      return decryptedText;
  } catch (error) {
      throw new Error('Decryption failed due to an unexpected error.');
  }
}






export { Encrypt, Decrypt }

