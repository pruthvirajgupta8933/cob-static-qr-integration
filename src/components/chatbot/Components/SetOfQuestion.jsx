import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';


function SetOfQuestion(props) {
    const [response, setResponse] = useState([])
    const getAnswer = (quesId, Question)=>{
      if(quesId===null && Question==="Other"){
        props.triggerNextStep({trigger: '15' })
      }else{
        props.triggerNextStep({ value :quesId,trigger: '8' })
      }
    }

    useEffect(()=>{
      const { steps } = props;
    
    const obj = {
        question : steps[5].value
    }
        axios.post("https://chatbotadmin.sabpaisa.in/chatbot/setofquestion",obj,{
          headers: {
            'authorization': 'ddbf42c6-078a-404f-b4ed-d47faaa52bbf'
        }
        }).then(res=>{
                setResponse(res.data.QuestionList)
  }).catch(err=>{
    setResponse([])
    props.triggerNextStep({ trigger: 500 }) })
    }, [])  
     
    

  return (
   <div>
          <Paper>
              <MenuList>
            {response.map((ques) => ( 
                <>
                  <MenuItem onClick={()=>getAnswer(ques.QuestionId, ques.Question)}>{ques.Question}</MenuItem>
                </>      
              ))}
              </MenuList>
          </Paper>
    </div>
  )
}

export default SetOfQuestion