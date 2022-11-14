import React from "react";
import '../HeaderComponent.css'
import close from '../media/close.png'
import chatbotIcon from '../media/chatbotIcon.png'
const HeaderCompnent = (props)=>{
    return(
        <>
            <div className="upperHeader" >
                <img src={close} alt="closeImage" className="closeImage" onClick={()=>{props.togleFloating(props.open)}}/>
            </div>
            <div className="lowerheader">
                <div>
                    <img src={chatbotIcon} alt="chatbotIcon" className="chatbotIcon"/>
                </div>
                <div>
                    <h3>Hi, I am Mansha</h3>
                    <h5>I am here to help you</h5>
                </div>
            </div>
        </>
    )
}


export default HeaderCompnent