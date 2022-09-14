import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import {steps} from './Chatbot/Step'
import botFace from './media/botFace.png'
import { useSelector } from 'react-redux';


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
  var {user} = useSelector((state)=>state.auth);
  const [opened, setOpened] = useState(false)
// console.log(user);
  

useEffect(() => {
  const flag =user?.loginId===795? true : false;
  toggleFloating(flag);  
}, [user])


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