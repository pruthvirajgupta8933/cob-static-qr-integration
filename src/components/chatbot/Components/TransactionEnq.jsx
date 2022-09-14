import React, { useEffect, useState } from 'react'
import axios from 'axios';


function TransactionEnq(props) {
    const [response, setResponse] = useState("")
    
    
    useEffect(()=>{
        const { steps } = props;

        const clientTxnId = steps[13].value;
        let url =  `https://adminapi.sabpaisa.in/SabPaisaAdmin/Enquiry/ViewTxn/${clientTxnId}` 
      axios.get(url).then((res)=>{
         
        if(res.data[0].status==="SUCCESS"){
          setResponse("Success")
          props.triggerNextStep({ trigger:  25})
        }else{
          setResponse("Fail")
          props.triggerNextStep({ trigger: 25})
        }  
      }
      ).catch(err=>{setResponse("Error")
      props.triggerNextStep({ trigger:  500})})
    }, [])
   
    

  return (
    <div>Transaction Status : {response}</div>
  )
}

export default TransactionEnq