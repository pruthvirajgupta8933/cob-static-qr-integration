import React from 'react'
import CryptoJS from 'crypto-js'
import utf8 from 'utf8'
import Base64 from 'base-64'



function Test() {
    console.log("CryptoJS ===",CryptoJS);
    console.log("utf8 ===",utf8);

    var authKey = 'rMnggTKFvmGx8y1z';
    var authIV = "0QvWIQBSz4AX0VoH";
    var planText = '?clientName=SIPL1​&prodCode=';
  
    var options = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7,iv:authIV };  
  
/*** encrypt */  
var json = CryptoJS.AES.encrypt(planText, authKey, options);  
var ciphertext = json.ciphertext.toString(CryptoJS.enc.Base64);  
console.log("ciphertext",ciphertext);
    // const ciphers = CryptoJS.AES.encrypt(planText, authKey,{iv:authIV});
    while (planText.includes('â')) { // replace + with â
        alert(99);
        planText = planText.replace('â', "")
    }
    

   
    let authKeyUtf8 = CryptoJS.enc.Utf8.parse(authKey);
    let authIVUtf8 = CryptoJS.enc.Utf8.parse(authIV);
   
    // let authKeyUtf8 = authKey;
    // let authIVUtf8 = authIV;
    // let planTextUtf8 = CryptoJS.enc.Utf8.parse(planText);
    let planTextUtf8 = CryptoJS.enc.Utf8.parse(planText);
    // console.log("authIVUtf8",authIVUtf8);
    
    let encrypted = CryptoJS.AES.encrypt(planTextUtf8, authKeyUtf8, {
        iv: authIVUtf8,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    
      

      
    let encryptedData = encrypted.ciphertext.toString(CryptoJS.enc.Base64);   
      console.log("planTextUtf8 ===",planTextUtf8);
      console.log("encryptedDataParam ===",encryptedData);

      
    let enCodeiv = Base64.encode(utf8.encode(authIV));
    
    let encryptedText = encryptedData +":"+enCodeiv;

    while (encryptedText.includes('+')) { // replace + with %2B
        encryptedText = encryptedText.replace('+', "%2B")
    }
    
    


    // console.log("encryptedText===",encryptedText);

    

  return (
    <div>Test</div>
  )
}

export default Test