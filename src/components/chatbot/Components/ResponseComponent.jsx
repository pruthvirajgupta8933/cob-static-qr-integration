import React from "react";
// import '../HeaderComponent.css'
// import close from '../media/close.png'
// import chatbotIcon from '../media/chatbotIcon.png'
const ResponseComponent  = (props)=>{
    return(
        <>
            <p>{props.previousStep.value.data.response}</p>
        </>
    )
}


export default ResponseComponent