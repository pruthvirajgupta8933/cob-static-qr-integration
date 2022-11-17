import React, { useEffect } from "react";
import '../styles/Answer.css'
import botFace from '../media/botFace.png'

const AnswerComponent = (props)=>{

// setTimeout(() => {
//     // props?.props?.triggerNextStep({trigger: 7})
//     console.log("timeout fn 2")
// }, 2000);

useEffect(() => {
    // console.log(props?.propscons
    // {console.log("check4 ANswer", props.props.previousStep.value.data)}
    props?.props?.triggerNextStep({trigger: 7})
//   return () => {
//     second
//   }
}, [])



// console.log("AnswerComponent render")
    return(
        <>
        <div className="outerDiv">
            <div className="innerDiv">
                <img className="imgStyle" alt="botFace" style={{"alignItems": 'flex-end'}} src={botFace}/>
            </div>
            <div className="answer">

                <p>
                {props.props.previousStep.value.data.answer.Answer}
                {props?.props?.previousStep?.value?.data?.answer?.AnswerID===2? <a href="https://sabpaisa.in/" target="_blank" rel="noreferrer" alt="sabpaisa" className="web_url">https://sabpaisa.in/</a> : ""} 
                </p>

            </div>
        </div>
        </>
    )
   
}


export default AnswerComponent