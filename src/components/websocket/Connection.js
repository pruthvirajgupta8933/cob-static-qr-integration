import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { wsConnectUrl } from '../../config';
import { roleBasedAccess } from '../../_components/reuseable_components/roleBasedAccess';
import { useState } from 'react';

const role = roleBasedAccess()
// console.log(role)
let token = ""
if (role.approver) {
    token = 'ptaie3^jt1&jnrr+=kxu(g5)m2ut08hs6t46l)c8_!k%_av=67'
} else if (role.verifier) {
    token = '0uwry5@z2%b7n&uu(lw7&by+yh)_d0nb!)x$(#3@6f6(9_d9w$'
} else if (role.viewer) {
    token = '(on2m)4u&r&(ju(8@6r7&x9-qdioku56fey5ki_i(=4r41fzv!'
} else {
    token = ''
}
token = 'verifier_token'
// VALID_TOKENS = {
//     '0uwry5@z2%b7n&uu(lw7&by+yh)_d0nb!)x$(#3@6f6(9_d9w$': 'verifier',
//     'ptaie3^jt1&jnrr+=kxu(g5)m2ut08hs6t46l)c8_!k%_av=67': 'approver',
//     '(on2m)4u&r&(ju(8@6r7&x9-qdioku56fey5ki_i(=4r41fzv!': 'viewers'
// }

// export const notificationSocket = io(wsConnectUrl.connectionURL, {
//     extraHeaders: {
//         token: token,
//     },
// });

function Connection() {

    // const [objectArray, setObjectArray] = useState([]);

    // const socket = io('ws://192.168.34.26:5000',
    //     {
    //         extraHeaders: {
    //             token: token,
    //         },
    //     });

    // useEffect(() => {
    //     // Replace 'your-server-url' with your Socket.io server URL

    //     // Event listener for when the connection is established
    //     socket.on('connect', () => {
    //         console.log('Socket.io connected!');
    //     });

    //     // Event listener for receiving messages from the server
    //     // socket.on('jwt_token', (data) => {
    //     //   console.log('jwt_token:', data);
    //     //   // Handle the received message here as needed
    //     // });

    //     // Event listener for receiving messages from the server

    //     socket.on('notify', (data) => {
    //         console.log("notify", data)
    //         // const parsedData = JSON.parse(data);
    //         // Update the state by adding the new object to the existing array
    //         setObjectArray((prevArray) => [...prevArray, data]);
    //         // Handle the received message here as needed
    //     });

    //     // Event listener for errors
    //     socket.on('error', (error) => {
    //         console.error('Socket.io error:', error);
    //     });

    //     // Clean up the Socket.io connection when the component unmounts
    //     return () => {
    //         socket.off('connect');
    //         socket.off('jwt_token');
    //         socket.off('notify');
    //         socket.off('error');
    //         socket.off('disconnect');
    //         setObjectArray([])
    //         socket.disconnect();
    //     };
    // }, []);

    // console.log("objectArray", objectArray)

    return (
        <div>
            {/* <button onClick={() => socket.emit('mark_as_read', { delivery_tag: 1 })}>emit</button> */}
        </div>
    )
}

// notificationSocket.off('connect');
// notificationSocket.off('jwt_token');
// notificationSocket.off('notify');
// notificationSocket.off('error');
// notificationSocket.off('disconnect');

export default Connection