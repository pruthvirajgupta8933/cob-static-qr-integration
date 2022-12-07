import React, { useEffect, useState } from "react";

import axios from 'axios'



  


const TempQuestion = (props)=>{

    const {steps} = props
    
    // const [Detail, setDetails]= useState(personalDetail)
    // const SetValues = (e)=>{
    //     const { name, value } = e.target;
    //     setDetails(prevState => ({
    //         ...prevState,
    //         [name]: value
    //     })) 
    // }
    const SubmitValues = () =>{
        const personalDetail = {
            name : steps[16].value,
            mobile: steps[18].value,
            email: steps[20].value,
            Question: steps[22].value,
            CategoryId: 1
        }
        axios.post("https://chatbotadmin.sabpaisa.in/chatbot/tempquestion", personalDetail,{
            headers: {
                'authorization': 'ddbf42c6-078a-404f-b4ed-d47faaa52bbf'
            }
        }).then((res)=>{
            props.triggerNextStep({ trigger: 7 })
        }).catch((err)=>{
            props.triggerNextStep({ trigger: 500 })
        })  
    }
    useEffect(()=>{
        SubmitValues()
    }, [])
    return(
        <p>your Query has been submitted</p>
    )
}


export default TempQuestion