import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import {steps} from './Chatbot/Step'
import botFace from './media/botFace.png'
import { useDispatch, useSelector } from 'react-redux';
import { productSubscribeState } from '../../slices/dashboardSlice';


// Creating our own theme

const theme = {
  background: '#F2F4F9',
  headerBgColor: '#012167',
  headerFontSize: '20px',
  headerFontColor: '#fff',
  botBubbleColor: '#FFFFFF',
  userBubblrColor: '#2153F9',
  botFontColor: '#333333',
  userBubbleColor: '#FF5733',
  userFontColor: 'white',
};



function ChatBotApp(props) {
  // Set some properties of the bot
  // console.log(props)
  const {dashboard} = useSelector((state)=>state);
  
  //state
  const [opened, setOpened] = useState(true)
// console.log(user);
  

useEffect(() => {
  
  const flag =dashboard?.productSubscribe;
  // console.log(dashboard?.productSubscribe)
  toggleFloating(flag); 
  
   
}, [dashboard])


const toggleFloating =(boolen)=>{
  setOpened(!boolen);
}

const config = {
  floating: true,
  headerTitle: "Mansha Bot",
  opened:opened,

};
  return (  
    <ThemeProvider theme={theme}>
    <ChatBot
      botAvatar = {botFace}
      steps={steps}
      {...config}
      toggleFloating={()=>toggleFloating(opened)}
  />
</ThemeProvider>
  )
}

export default ChatBotApp