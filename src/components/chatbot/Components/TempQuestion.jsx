import React, { useState } from "react";

import axios from 'axios'



  


const TempQuestion = (props)=>{

    const {steps} = props
    const personalDetail = {
        // name : steps[3].value.name,
        // mobile: steps[3].value.contactNumber,
        // email: steps[3].value.email,
        // CategoryId: steps[3].value.CategoryId
        name : "ManshaAdmin",
        mobile: 1111111111,
        email: 'abc@sabpaisa.in',
        CategoryId: 1
    }
    const [Detail, setDetails]= useState(personalDetail)
    const SetValues = (e)=>{
        const { name, value } = e.target;
        setDetails(prevState => ({
            ...prevState,
            [name]: value
        })) 
    }
   
    const SubmitValues = () =>{
        axios.post("https://chatbotadmin.sabpaisa.in/chatbot/tempquestion", Detail,{
            headers: {
                'authorization': 'ddbf42c6-078a-404f-b4ed-d47faaa52bbf'
            }
        }).then((res)=>{
            props.triggerNextStep({ trigger: 64 })
        }).catch((err)=>{
            props.triggerNextStep({ trigger: 500 })
        })  
    }

    return(
        <>
        <div>
        <div>
            <div item container alignItems="center" justifyContent="center" spacing={2}>
                <div item xs={12}>
                    <input style={{"marginTop": "10px"}} id="outlined-multiline-static" label="Question" name="Question" multiline rows={3} onChange={SetValues}/>
                </div>
            </div>
            <div item container alignItems="center" justifyContent="center" spacing={2}>
                <div item xs={4}>
                        <button style={{"marginTop": "5px"}} className="submitbutton" variant="contained" onClick={SubmitValues}>Submit</button>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}


export default TempQuestion