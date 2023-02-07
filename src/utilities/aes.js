import CryptoJS from "crypto-js"
// import aes from "crypto-js/aes"
// import key from "./secretkey"



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

    // return CryptoJS.AES.encrypt(word , key).toString()
};


const Decrypt = (ciphertext, key, iv) => {


   
 
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
 
 
  let decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });


  return decrypted.toString(CryptoJS.enc.Utf8) ;
  
 
}



export {Encrypt, Decrypt}

