import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { webSocketURL } from '../../config';


function Connecttion() {
    const socket = io(webSocketURL.connectionURL, {
        extraHeaders: {
            token: 'verifier_token',
        },
      });
    useEffect(() => {
        // Event listener for 'connect' event
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        // Event listener for 'message' event
        socket.on('notify', (data) => {
            console.log('Received message:', data);
        });

        // Event listener for 'disconnect' event
        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });


      

        // Clean up the event listeners on component unmount
        return () => {
            socket.off('connect');
            socket.off('notify');
            socket.off('disconnect');
        };
    }, []);
    return (
        <div><button onClick={()=>  socket.emit('mark_as_read', {delivery_tag:1})}>emit</button></div>
    )
}

export default Connecttion