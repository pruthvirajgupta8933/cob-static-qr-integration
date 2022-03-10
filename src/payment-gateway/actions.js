import Auth,{aes_encrypt} from "./auth";
import utf8 from 'utf8'
// import { aes_encrypt } from "./auth";
// console.log(Auth);
const action = ()=>{
    
    const success = `http://127.0.0.1:3000/response.js`
    const failure = `http://127.0.0.1:3000/response.js`

    var spURL = null;
    var spDomain = 'https://uatsp.sabpaisa.in/SabPaisa/sabPaisaInit'; // test environment / test server
    // var spDomain = 'https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit'; // production environment 
    var username = 'nishant.jha_2885';
    var password = 'SIPL1_SP2885';
    var programID = "5666";
    var clientCode = 'SIPL1';
    var authKey = 'rMnggTKFvmGx8y1z';
    var authIV = "0QvWIQBSz4AX0VoH";
    var txnId = 315464687897;
    // var txnId = Math.floor(Math.random() * 1000000000).toString();
    var tnxAmt = 10;
    var URLsuccess = success.trim();
    var URLfailure = failure.trim();
    var payerFirstName = 'Mukesh';
    var payerLastName = 'Kumar';
    var payerContact = '8796541230';
    var payerAddress = 'xyz abc';
    var payerEmail = 'test@gmail.com';
    var channelId = 'm';
    // const http = require('http');

    // var checksumURL = utf8.encode(`clientName=${clientCode}​&usern=${username}​&pass=${password}&amt=​${tnxAmt}​&txnId=${txnId}​&firstName=${payerFirstName}​&lstName=${payerLastName}&contactNo=${payerContact}​&Email=${payerEmail}​​&Add=${payerAddress}&ru=${URLsuccess.trim()}​&failureURL=${URLfailure}&channelId=${channelId}`);
    // while (checksumURL.includes('â')) { // replace + with â
    //     checksumURL = checksumURL.replace('â', "")
    // }
    // console.log('checksum URL : '+ checksumURL)


    // var forChecksumString = utf8.encode(`Add`+payerAddress+`Email`+payerEmail+`amountTypechannelIdcontactNo`+payerContact+`failureURL`+URLfailure+`firstName`+payerFirstName+`grNumberlstName`+payerLastName+`midNameparam1param2param3param4pass`+password+`programIdru`+URLsuccess+`semstudentUintxnId`+txnId+`udf10udf11udf12udf13udf14udf15udf16udf17udf18udf19udf20udf5udf6udf7udf8udf9usern`+username);
    // while (forChecksumString.includes('â')) { // replace + with â
    //     forChecksumString = forChecksumString.replace('â', "")
    // }

    // var checksumString = auth.Auth._checksum(authKey.trim(), forChecksumString);


    // spURL = utf8.encode(`?clientName=`+clientCode.trim()+`​&prodCode=&usern=`+username.trim()+`​&pass=`+password.trim()+`&amt=​`+tnxAmt+`​&txnId=`+txnId+`​&firstName=`+payerFirstName+`​&lstName=`+payerLastName+`&contactNo=`+payerContact+`​&Email=`+payerEmail+`​&Add=`+payerAddress+`​&ru=`+URLsuccess.trim()+`​&failureURL=`+URLfailure);

    spURL = `?clientName=`+clientCode.trim()+`​&prodCode=&usern=`+username.trim()+`​&pass=`+password.trim()+`&amt=​`+tnxAmt+`​&txnId=`+txnId+`​&firstName=`+payerFirstName+`​&lstName=`+payerLastName+`&contactNo=`+payerContact+`​&Email=`+payerEmail+`​&Add=`+payerAddress+`​&ru=`+URLsuccess.trim()+`​&failureURL=`+URLfailure;

    while (spURL.includes('â')) { // replace + with â
        spURL = spURL.replace('â', "")
    }
    console.log("spURL",spURL);
    var encryptParamUrl = aes_encrypt(spURL,authKey,authIV);

    // var encryptParamUrl = Auth._encrypt(authKey,authIV,spURL);

    console.log("encryptParamUrl",encryptParamUrl);
    // console.log("encrypt spURL return = ",data);

    spURL = "?query="+encryptParamUrl+"&clientName="+clientCode;
    spURL = spDomain + spURL;

    while (spURL.includes('+')) { // replace + with %2B
        spURL = spURL.replace('+', "%2B")
    }

    console.log("final URL====",spURL);





    // request.post(spURL, (error, response, body) => {
    //   const hostname = '127.0.0.1';
    //   const port = 3000;
    //   const server = http.createServer((req, res) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     res.end(body);
    //   });

    //   server.listen(port, hostname, () => {
    //     console.log(`Server running at http://${hostname}:${port}/`);
    //     console.log('IV:' + base64.encode(utf8.encode(authIV)));
    //   });


    // });
}


export default action;