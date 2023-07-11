import React, { useEffect, useState } from 'react';
// import Stomp from 'stompjs';
// import SockJS from 'sockjs-client';

const Consumer = () => {
  // const [message, setMessage] = useState('');

  // const amqpUrl = 'amqps://iyjubxlr:oq63SXtZHziWKp1TdawKHwLD3sVgSV-L@woodpecker.rmq.cloudamqp.com/iyjubxlr';
  // const queueName = 'admin';

  // useEffect(() => {
  //   // Create a WebSocket connection to the AMQPS URL
  //   const socket = new SockJS(amqpUrl);
  //   console.log("socket",socket)
  //   const client = Stomp.over(socket);

  //   // Connect to the AMQPS server
  //   const onConnect = () => {
  //     console.log('Connected to AMQPS server');
  //     // Subscribe to the desired destination or queue
  //     client.subscribe('/queue/myQueue', (msg) => {
  //       const receivedMessage = msg.body;
  //       setMessage(receivedMessage);
  //     });
  //   };

  //   // Handle connection errors
  //   const onError = (error) => {
  //     console.error('AMQPS connection error:', error);
  //   };

  //   // Establish the AMQPS connection
  //   client.connect({}, onConnect, onError);

  //   return () => {
  //     // Disconnect from the AMQPS server when the component unmounts
  //     client.disconnect();
  //   };
  // }, []);

  return (
    <div>
      <h1>RabbitMQ Consumer</h1>
      <p>Received message</p>
    </div>
  );
};

export default Consumer;