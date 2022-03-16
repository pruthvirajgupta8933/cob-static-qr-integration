// import React from 'react'
// import CryptoJS from 'crypto-js'
// import utf8 from 'utf8'
// import Base64 from 'base-64'
// import { MiscellaneousServicesOutlined } from '@mui/icons-material'




// const encryption = (data,authKey="abhishek009",authIV="abhishek007")=>{
//     const  encrypted = CryptoJS.AES.encrypt(data,authKey,{iv:authIV});
//     const encryptedData = encrypted.ciphertext;   
//     return encryptedData.toString();
// }

// const decryption = (data,authKey="abhishek009",authIV="abhishek007")=>{
//     const  decrypted = CryptoJS.AES.decrypt(data,authKey,{iv:authIV});
//     const decryptedData = decrypted.ciphertext;   
//     return decryptedData.toString();
// }

// const method = {
//     encryption,
//     decryption
// }

// export default method;