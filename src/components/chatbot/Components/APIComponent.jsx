import React, { useState } from "react";
import axios from 'axios'
import '../styles/APIComponent.css'

const APIComponent = (props)=>{
    
    const [data, setData] = useState({})
    const setValue = (event)=>{

        setData({...data, [event.target.name] : event.target.value})
    }
    const showResponse = (APIurl)=>{
        
        axios.post(APIurl, data, {
            headers: {
                'authorization': 'ddbf42c6-078a-404f-b4ed-d47faaa52bbf'
            }
        }).then((res)=>{
                props.props.triggerNextStep({value: res, trigger: 6 })
        }).catch((err)=>{
            props.props.triggerNextStep({value: err, trigger: 500 })
        })
    }
    return( 
    <>
        
        <div style={{"marginLeft":"20px"}}>
            
                {props.props.previousStep.value.data.InputFields.map((InputItem,i)=>{
                    return(
                        <>
                        <label for="fname">{InputItem.label}</label>
                        <input type="text" onChange={setValue} label={InputItem.label} id="fname" name={InputItem.name} placeholder={InputItem.label}/>
                        </>
                    )
                })}
                <input type="submit" value="Submit" onClick={()=>{showResponse(props?.props?.previousStep?.value?.data?.ApiUrl[0]?.Api)}}/>
            
        </div>
    </> 
    )
}


export default APIComponent