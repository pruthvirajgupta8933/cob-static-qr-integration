import React from "react";
import '../styles/Answer.css'
import botFace from '../media/botFace.png'

const AnswerComponent = (props)=>{

setTimeout(() => {
    props?.props?.triggerNextStep({trigger: 7})
}, 2000);

console.log("AnswerComponent render")
    return(
        <>
        <div className="outerDiv">
            <div className="innerDiv">
                <img className="imgStyle" alt="botFace" style={{"alignItems": 'flex-end'}} src={botFace}/>
            </div>
            <div className="answer">
                <p>{props.props.previousStep.value.data.answer.Answer}</p>
            </div>
        </div>
        </>
    )
   
}


export default AnswerComponent