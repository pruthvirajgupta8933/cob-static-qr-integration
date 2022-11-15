import React from "react";

import '../styles/SubQuestion.css'
const SubQuestionComponent = (props)=>{
    
    return( 
          
            <>
              {props.props.previousStep.value.data.QuestionLis.map((ques,i)=> ( 
                  <div className="jKLQUD kashif2 QuestionStyle fDMwUN" key={i}>
                    <p className ="SubQuestion optionPadding" onClick={()=>props.getAnswer(ques.QuestionId)}>{ques.Question}</p>
                  </div>
                       
                ))}
             </>
            
          
    )
}


export default SubQuestionComponent