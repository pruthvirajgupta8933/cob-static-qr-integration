// //const crypto = require('crypto');
// import CryptoJS from 'crypto-js';
// import base64 from 'base-64'
// import utf8 from 'utf8'
// // let CryptoJS = require("/CryptoJS v3.1.2/rollups/aes.js");

// /**
//  * Encryption
//  */
//  export const  aes_encrypt = (plaintext, key, iv)=> {
//     key = CryptoJS.enc.Utf8.parse(key);
//     iv = CryptoJS.enc.Utf8.parse(iv);
//     let srcs = CryptoJS.enc.Utf8.parse(plaintext);
//     // console.log("srcs",srcs);
//     let encrypted = CryptoJS.AES.encrypt(srcs, key, {
//       iv: iv,
//     });
//     return encrypted.ciphertext.toString();
//   }
  
//   /**
//    * Decryption
//    */
// //    export const  aes_decrypt = (ciphertext, key, iv)=> {
// //     key = CryptoJS.enc.Utf8.parse(key);
// //     iv = CryptoJS.enc.Utf8.parse(iv);
// //     let hex_string = CryptoJS.enc.Hex.parse(ciphertext);
// //     let srcs = CryptoJS.enc.Base64.stringify(hex_string);
// //     let decrypt = CryptoJS.AES.decrypt(srcs, key, {
// //       iv: iv,
// //       mode: CryptoJS.mode.CBC,
// //       padding: CryptoJS.pad.Pkcs7,
// //     });
// //     decrypt = decrypt.toString(CryptoJS.enc.Utf8);
// //     return decrypt.toString();
// //   }
  




// // ==============================================



// console.log('pg auth js running');

// class Auth {
//     static OPENSSL_CIPHER_NAME = "aes-128-cbc"
//     static CIPHER_KEY_LEN = 16;
//     constructor() {

//     }
//     static jointimes = function (char, len) {
//         var i = 0;
//         var str = char;
//         while (i < len) {
//             str += char;
//             i++;
//         }
//         return str;

//     };
//     static pad = function (str, char, len) {

//         if (str.length >= len)
//             return str;
//         else {

//             return str + (char + Auth.jointimes(char, len - str.length));
//         }
//     }

//     static encrypt = function (plain_text, encryptionMethod, secret, iv) {
//         var encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);
//         return encryptor.update(plain_text.trim(), 'ascii', 'base64') + encryptor.final('base64');
//     }

//     static decrypt = function (encryptedMessage, encryptionMethod, secret, iv) {
//         var decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
//         return decryptor.update(encryptedMessage, 'base64', 'ascii') + decryptor.final('ascii');
//     }
//     static _fixpay = function (key) {
//         if (key.length < Auth.CIPHER_KEY_LEN) {
//             return Auth.pad(key, "0", Auth.CIPHER_KEY_LEN);

//         }
//         else if (key.length > Auth.CIPHER_KEY_LEN) {
//             return key.substring(0, Auth.OPENSSL_CIPHER_NAME,);
//         }
//         else
//             return key;
//     }
//     static _encrypt = function (key, iv, data) {
//         console.log(`Data value is : ${data}`)
//         // var encodedEncryptedData = base64.encode(utf8.encode(Auth.encrypt(data, Auth.OPENSSL_CIPHER_NAME, key, iv)));
//         var encodedEncryptedData = Auth.encrypt(data, Auth.OPENSSL_CIPHER_NAME, key, iv);
//         var encodedIV = base64.encode(utf8.encode(iv));
//         var encryptedPayload = encodedEncryptedData + ":" + encodedIV;
//         // console.log(`$encryptedPayload value is :' ${encryptedPayload}`);
//         // console.log(`$decrypted data value is :' ${Auth.decrypt(encodedEncryptedData, Auth.OPENSSL_CIPHER_NAME, key, iv)}`);
//         while (encryptedPayload.includes('+')) { // replace + with %2B
//             encryptedPayload = encryptedPayload.replace('+', "%2B")
//         }
//         return encryptedPayload;
//     }
//     static _decrypt = function (key, iv, data) {
//         while (data.includes('%2B')) { // replace + with %2B
//             data = data.replace('%2B', "+")
//         }
//         var parts = data.split(':');                      //Separate Encrypted data from iv.
//         var encrypted = parts[0];
//         // iv = parts[1];
//         var $decryptedData = Auth.decrypt(encrypted, Auth.OPENSSL_CIPHER_NAME, key,iv);
//         // var $decryptedData = Auth.decrypt(Buffer.from(encrypted, 'base64').toString('ascii'), Auth.OPENSSL_CIPHER_NAME, key, Buffer.from(iv));
//         return $decryptedData;
//     }

//     static _checksum = function (secretKey, postData) {
//         console.log('client side postData before checksum String'.postData)

//         //creating hmac object 
//         var hmac = crypto.createHmac('sha256', secretKey);
//         //passing the data to be hashed
//         var data = hmac.update(postData);
//         //Creating the hmac in the required format
//         var gen_hmac = data.digest('base64');
//         //Printing the output on the console
//         console.log("hmac : " + gen_hmac);

//         return gen_hmac;
//     }
// }

// export default Auth