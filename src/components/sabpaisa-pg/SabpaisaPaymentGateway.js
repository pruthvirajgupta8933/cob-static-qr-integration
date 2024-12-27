import React, { useState, useEffect } from 'react'
import { PaymentInitModal } from "pg-test-project";


function SabpaisaPaymentGateway(props) {
  const clientDetails = props?.clientData
  const [isOpen, setIsOpen] = useState(false);
  const [clientCode, setClientCode] = useState("SRSSUB");
  const [transUserName, setTransUserName] = useState("nishant.jha_6493");
  const [transUserPassword, setTransUserPassword] = useState("SRSSUB_SP6493");
  const [authkey, setAuthkey] = useState("zho2xnrsE7p9Igcz");
  const [authiv, setAuthiv] = useState("a8s5PqIDJQlA4AzP");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [payerName, setpayerName] = useState("");
  const [payerEmail, setpayerEmail] = useState("");
  const [payerMobile, setpayerMobile] = useState("");
  const [clientTxnId, setclientTxnId] = useState(props?.clientTxnId);
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
  const [udf16, setudf16] = useState(""); // // client subscribe plan detail id(refer to DB)
  const [udf17, setudf17] = useState("COB"); // payment from the COB portal
  const [udf18, setudf18] = useState("");
  const [udf19, setudf19] = useState("");
  const [udf20, setudf20] = useState("");
  const [channelId, setchannelId] = useState("npm");
  const [programId, setprogramId] = useState("x");
  const [mcc, setmcc] = useState("");


  useEffect(() => {

    setIsOpen(props?.openPg)
    setpayerName(clientDetails?.clientContactPersonName);
    setpayerEmail(clientDetails?.clientEmail);
    setpayerMobile(clientDetails?.clientMobileNo);
    setclientTxnId(props?.clientTxnId)
    setamount(props?.planData?.[0]?.actual_price);
    setudf12(props?.clientData?.clientMerchantDetailsList[0]?.clientCode)
    setudf13(props?.planData?.[0]?.plan_id)
    setudf14(props?.planData?.[0]?.plan_name)
    setudf15(props?.planData?.[0]?.app_id)
    setudf16(props?.subscribeId)

  }, [props, clientDetails])


  return (
    <div> {
      (clientCode && transUserPassword && transUserName && authkey && authiv) &&
      <PaymentInitModal
        clientCode={clientCode}
        transUserPassword={transUserPassword}
        transUserName={transUserName}
        isOpen={isOpen}
        clientTxnId={clientTxnId}
        authkey={authkey}
        authiv={authiv}
        payerName={payerName}
        payerEmail={payerEmail}
        payerMobile={payerMobile}
        payerAddress={payerAddress}
        amount={1}
        amountType={amountType}
        udf12={udf12}
        udf13={udf13}
        udf14={udf14}
        udf15={udf15}
        udf16={udf16}
        udf17={udf17}
        onToggle={() => setIsOpen(!isOpen)}
        channelId={channelId}
        programId={programId}
        mcc={mcc}
        label={"Production"}
        env={'prod'}
      />



    }</div>
  )
}

export default SabpaisaPaymentGateway