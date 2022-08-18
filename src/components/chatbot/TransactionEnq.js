import React, { useState } from 'react'
import axios from 'axios';

const initState = {
    "status":"",
    "paidAmount":"",
    "message":"",

}

function TransactionEnq(props) {
    const [response, setResponse] = useState("")
    const [objres, setObjRes] = useState(initState)
    
    const { steps } = props;

    const clientCode = steps[3].value;
    const clientTxnId = steps[5].value;

    const obj = {clientCode,clientTxnId}
    axios.post("https://chatbotadmin.sabpaisa.in/chatbot/getTransaction",obj).then(res=>{
    const status = res.data?.transactionStatus?.status
    const paidAmount = res.data?.transactionStatus?.paidAmount
    const message =  res.data?.transactionStatus?.message

    setObjRes({
        status,
        paidAmount,
        message
    })



        // setResponse(res.data)
    }).catch(err=>console.log(err))
    

  return (
    <div>Transaction Status : {`${objres?.paidAmount} , ${objres?.status}` }  </div>
  )
}

export default TransactionEnq