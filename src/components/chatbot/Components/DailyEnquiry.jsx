import React, { useState } from "react";
import Button from '@mui/material/Button';
// import Paper from '@mui/material/Paper';
// import { styled } from '@mui/material/styles';
import { TextField } from "@mui/material";
import Grid from '@mui/material/Grid';
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
        <Grid>
            <Grid item container spacing={2}>
            <Grid item container alignItems="center" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <TextField id="standard-basic" size="small" label="Name" variant="standard" name="name" onChange={SetValues}/>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <TextField id="standard-basic" size="small" label="Email" variant="standard" name="email" onChange={SetValues}/>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <TextField id="standard-basic" size="small" label="Mobile Number" variant="standard" name="contactNumber" onChange={SetValues}/>
                </Grid>
            </Grid>
        </Grid>
            <Grid item container alignItems="center" justifyContent="center" spacing={2}>
                <Grid item xs={4}>
                        <Button style={{"marginTop": "5px"}} className="submitButton" variant="contained" onClick={SubmitValues}>Submit</Button>
                </Grid>
            </Grid>
        </Grid>
        </div>
        </>
    )
}


export default DailyEnquiry