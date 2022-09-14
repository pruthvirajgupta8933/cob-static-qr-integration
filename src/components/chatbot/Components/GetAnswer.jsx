import React, { useEffect, useState } from 'react'
import axios from 'axios';


function GetAnswer(props) {
    const [response, setResponse] = useState("")
    
    
    useEffect(()=>{
        const { steps } = props;
    
    const obj = {
        qestionId : steps[7].value
    }
        axios.post("https://chatbotadmin.sabpaisa.in/chatbot/AnswerApi",obj,{
            headers: {
                'authorization': 'ddbf42c6-078a-404f-b4ed-d47faaa52bbf'
            }
        }).then(res=>{
            if(res.data.Answer==="Tell me the transaction id"){
                props.triggerNextStep({ trigger: 12 })
            }else{
                setResponse(res.data.Answer)
                props.triggerNextStep({ trigger:  '25'})
            }
                
  }).catch(err=>{setResponse("Error")
        props.triggerNextStep({ trigger: 500 })
     })
    },[])
    
    

  return (

    <div>Answer : {response}</div>
  )
}

export default GetAnswer