import React, { useState, useEffect } from 'react';
import { socketConnection } from '../../services/notification-service/notification.service';

// import socketIOClient from 'socket.io-client';

// const ENDPOINT = 'ws://192.168.34.26:5000'; // Replace with your server's endpoint

const TestConnection = () => {

    let token = 'verifier_token'
  const [message, setMessage] = useState([]);
//   const socket = socketIOClient(ENDPOINT ,{
//     extraHeaders: {
//         token: token,
//     },
// });

  const handleClick = () => {
    // Emit a 'message' event to the server with the current timestamp
    socketConnection.emit('mark_as_read', { text: `Message sent at ${new Date().toLocaleTimeString()}` });
  };

  useEffect(() => {
    console.log("dfdf")
    // Listen for 'message' events from the server
    socketConnection.on('notify', (data) => {
        console.log("notify-", data)
    //   setMessage(data.text);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
        socketConnection.disconnect();
        console.log("socket disconnect")
    };
  }, []);

  return (
    <div>
      <button onClick={handleClick}>Send Message</button>
      <p>Received message from server: {message}</p>
    </div>
  );
};

export default TestConnection;