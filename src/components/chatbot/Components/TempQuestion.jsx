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
  


const TempQuestion = (props)=>{

    const {steps} = props
    const personalDetail = {
        name : steps[3].value.name,
        mobile: steps[3].value.contactNumber,
        email: steps[3].value.email,
        CategoryId: steps[3].value.CategoryId
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
            props.triggerNextStep({ trigger: 4 })
        }).catch((err)=>{
            props.triggerNextStep({ trigger: 500 })
        })  
    }

    return(
        <>
        <div>
        <Grid>
            <Grid item container alignItems="center" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <TextField style={{"marginTop": "10px"}} id="outlined-multiline-static" label="Question" name="Question" multiline rows={3} onChange={SetValues}/>
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


export default TempQuestion