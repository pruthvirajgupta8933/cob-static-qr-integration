import React, {useEffect} from "react";
import axios from 'axios'


const SubparentComponent = (props)=>{
    
    const FindAnswer = () =>{ 
            const Detail = {
                qestionId: props.steps[4].value
            }
            axios.post("https://chatbotadmin.sabpaisa.in/chatbot/AnswerApi", Detail, {
            headers: {
                'authorization': 'ddbf42c6-078a-404f-b4ed-d47faaa52bbf'
            }
        }
        ).then((res)=>{
            props.triggerNextStep({value: res, trigger: 4 })
        }).catch((err)=>{
            props.triggerNextStep({value: Detail, trigger: 500 })
        })
    
}
    useEffect(()=>{
        FindAnswer()
    },[])  
       
    
    return(
        <>
        {/* <div>
            <p>Wait! we are looking into your query</p>
        </div> */}
        </>
    )
}


export default SubparentComponent