import React, { useState, useEffect } from 'react'
import { PaymentInitModal } from "pg-test-project";
import { v4 as uuidv4 } from 'uuid';



function SabpaisaPaymentGateway(props) {
  const clientDetails = props?.clientData

  const [isOpen, setIsOpen] = useState(false);
  const [clientCode, setClientCode] = useState("TM001");
  const [transUserName, setTransUserName] = useState("rajiv.moti_336");
  const [transUserPassword, setTransUserPassword] = useState("RIADA_SP336");
  const [authkey, setAuthkey] = useState("kaY9AIhuJZNvKGp2");
  const [authiv, setAuthiv] = useState("YN2v8qQcU3rGfA1y");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [payerName, setpayerName] = useState("");
  const [payerEmail, setpayerEmail] = useState("");
  const [payerMobile, setpayerMobile] = useState("");
  const [clientTxnId, setclientTxnId] = useState(uuidv4());
  const [payerAddress, setpayerAddress] = useState("");
  const [amount, setamount] = useState(9999);
  const [amountType, setamountType] = useState("INR");
  const [udf1, setudf1] = useState("");
  const [udf2, setudf2] = useState("");
  const [udf3, setudf3] = useState("");
  const [udf4, setudf4] = useState("");
  const [udf5, setudf5] = useState("");
  const [udf6, setudf6] = useState("");
  const [udf7, setudf7] = useState("");
  const [udf8, setudf8] = useState("");
  const [udf9, setudf9] = useState("");
  const [udf10, setudf10] = useState("");
  const [udf11, setudf11] = useState("");
  const [udf12, setudf12] = useState(""); // client id
  const [udf13, setudf13] = useState(""); // plan id
  const [udf14, setudf14] = useState(""); // plan name
  const [udf15, setudf15] = useState(""); // application id (product id)
  const [udf16, setudf16] = useState(""); // application name
  const [udf17, setudf17] = useState("COB"); // payment from the COB portal
  const [udf18, setudf18] = useState("");
  const [udf19, setudf19] = useState("");
  const [udf20, setudf20] = useState("");
  const [channelId, setchannelId] = useState("W");
  const [programId, setprogramId] = useState("x");
  const [mcc, setmcc] = useState("");

  useEffect(() => {

    setIsOpen(props?.openPg)
    setpayerName(clientDetails?.clientContactPersonName);
    setpayerEmail(clientDetails?.clientEmail);
    setpayerMobile(clientDetails?.clientMobileNo);
    setamount(props?.planPrice);

    setudf12(props?.planData?.clientId)
    setudf13(props?.planData?.planId)
    setudf14(props?.planData?.planName)
    setudf15(props?.planData?.applicationId)
    setudf16(props?.planData?.applicationName)


  }, [props, clientDetails])


  return (
    <div> {
      (clientCode && transUserPassword && transUserName && authkey && authiv) && 
      <PaymentInitModal
        clientCode={clientCode}
        transUserPassword={transUserPassword}
        transUserName={transUserName}
        isOpen={isOpen}
        authkey={authkey}
        authiv={authiv}
        payerName={payerName}
        payerEmail={payerEmail}
        payerMobile={payerMobile}
        payerAddress={payerAddress}
        amount={amount}
        amountType={amountType}

        udf12={udf12}
        udf13={udf13}
        udf14={udf14}
        udf15={udf15}
        udf16={udf16}
        udf17={udf17}

        label={"Sabpaisa PG"}
        onToggle={() => setIsOpen(!isOpen)} />
    }</div>
  )
}

export default SabpaisaPaymentGateway