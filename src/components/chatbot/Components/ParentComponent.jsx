import React from "react";
import AnswerComponent from "./AnswerComponent";
import SubQuestionComponent from "./SubQuestionComponent";
import APIComponent from "./APIComponent";

const ParentComponent = (props)=>{
    
    const getAnswer = (Question)=>{
        props.triggerNextStep({value: Question, trigger: 5 })
    }
    // const triggerAnswer = (Answer)=>{
    // }
    
    return(
        <>
        {props.previousStep.value.data.SQ? <SubQuestionComponent props={props} getAnswer={getAnswer}/> : props.previousStep.value.data.API ? <APIComponent props={props}/> : <AnswerComponent props={props}/>}
    </>
   
    )
}


export default ParentComponent