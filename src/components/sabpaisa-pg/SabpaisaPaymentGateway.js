// import React, { useState } from 'react'
// import { PaymentInitModal } from "pg-test-project";
// import { v4 as uuidv4 } from 'uuid';

// function SabpaisaPaymentGateway() {

//   const [isOpen, setIsOpen] = useState(true);
//   const [clientCode, setClientCode] = useState("TM001");
//   const [transUserName, setTransUserName] = useState("rajiv.moti_336");
//   const [transUserPassword, setTransUserPassword] = useState("RIADA_SP336");
//   const [authkey, setAuthkey] = useState("kaY9AIhuJZNvKGp2");
//   const [authiv, setAuthiv] = useState("YN2v8qQcU3rGfA1y");
//   const [callbackUrl, setCallbackUrl] = useState("http://localhost:3000/#/dashboard/pg-response");
//   const [payerName, setpayerName] = useState("");
//   const [payerEmail, setpayerEmail] = useState("");
//   const [payerMobile, setpayerMobile] = useState("");
//   const [clientTxnId, setclientTxnId] = useState(uuidv4());
//   const [payerAddress, setpayerAddress] = useState("");
//   const [amount, setamount] = useState("");
//   const [amountType, setamountType] = useState("");
//   const [udf1, setudf1] = useState("");
//   const [udf2, setudf2] = useState("");
//   const [udf3, setudf3] = useState("");
//   const [udf4, setudf4] = useState("");
//   const [udf5, setudf5] = useState("");
//   const [udf6, setudf6] = useState("");
//   const [udf7, setudf7] = useState("");
//   const [udf8, setudf8] = useState("");
//   const [udf9, setudf9] = useState("");
//   const [udf10, setudf10] = useState("");
//   const [udf11, setudf11] = useState("");
//   const [udf12, setudf12] = useState("");
//   const [udf13, setudf13] = useState("");
//   const [udf14, setudf14] = useState("");
//   const [udf15, setudf15] = useState("");
//   const [udf16, setudf16] = useState("");
//   const [udf17, setudf17] = useState("");
//   const [udf18, setudf18] = useState("");
//   const [udf19, setudf19] = useState("");
//   const [udf20, setudf20] = useState("");
//   const [channelId, setchannelId] = useState("W");
//   const [programId, setprogramId] = useState("x");
//   const [mcc, setmcc] = useState("");
//   return (
//     <div> {
//       (clientCode && callbackUrl && transUserPassword && transUserName && authkey && authiv) && isOpen &&
//       <PaymentInitModal clientCode={clientCode} transUserPassword={transUserPassword} transUserName={transUserName} callbackUrl={callbackUrl} isOpen={isOpen} authkey={authkey} authiv={authiv} label={"testing"} />
//     }</div>
//   )
// }

// export default SabpaisaPaymentGateway