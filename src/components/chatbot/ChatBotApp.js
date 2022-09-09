import React from 'react'
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import { steps } from './steps';

// Creating our own theme
const theme = {
  background: '#fff',
  headerBgColor: '#0156B3',
  headerFontSize: '20px',
  botBubbleColor: '#000',
  headerFontColor: 'white',
  botFontColor: 'white',
  userBubbleColor: '#0156B3',
  userFontColor: 'white',
};

// Set some properties of the bot
const config = {
  floating: true,
};


function ChatBotApp() {
  return (  
  <ThemeProvider theme={theme}>
    <ChatBot
      headerTitle="Mansha Bot"
      steps={steps}
      {...config}
    />

  </ThemeProvider>
  )
}

export default ChatBotApp