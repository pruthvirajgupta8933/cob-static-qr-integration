import React, { useState } from "react";
import axios from 'axios'


// const Item = styled(Paper)(({ theme }) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   }));
  


const DailyEnquiry = (props)=>{
    const [Detail, setDetails]= useState({
        name: "",
        contactNumber: "",
        email: "",
        CategoryId: 1
    })
    const SetValues = (e)=>{
        const { name, value } = e.target;
        setDetails(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    
    const SubmitValues = () =>{
        axios.post("https://chatbotadmin.sabpaisa.in/chatbot/dailyEnquiry", Detail
        , {
            headers: {
                'authorization': 'ddbf42c6-078a-404f-b4ed-d47faaa52bbf'
            }
        }
        ).then((res)=>{
            props.triggerNextStep({value: Detail, trigger: 4 })
            
        }).catch((err)=>{
            props.triggerNextStep({value: Detail, trigger: 500 })
        })
       
    }
    return(
        <>
        <div>
            <div>
                <div item container spacing={2}>
                <div item container alignItems="center" justifyContent="center" spacing={2}>
                    <div item xs={12}>
                        <input id="standard-basic" size="small" label="Name" variant="standard" name="name" onChange={SetValues}/>
                    </div>
                </div>
                <div item container alignItems="center" justifyContent="center" spacing={2}>
                    <div item xs={12}>
                        <input id="standard-basic" size="small" label="Email" variant="standard" name="email" onChange={SetValues}/>
                    </div>
                </div>
                <div item container alignItems="center" justifyContent="center" spacing={2}>
                    <div item xs={12}>
                        <input id="standard-basic" size="small" label="Mobile Number" variant="standard" name="contactNumber" onChange={SetValues}/>
                    </div>
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


export default DailyEnquiry