import socketIOClient from 'socket.io-client';
import { axiosInstanceJWT } from '../../utilities/axiosInstance';
import { wsConnectUrl } from '../../config';
import { roleBasedAccess } from '../../_components/reuseable_components/roleBasedAccess';

const role = roleBasedAccess()
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

// let token = 'verifier_token'
// const ENDPOINT = 'ws://192.168.34.26:5000'; // Replace with your server's endpoint
const ENDPOINT = wsConnectUrl.connectionURL; // Replace with your server's endpoint

// export const socketConnection = socketIOClient(ENDPOINT ,{
//     extraHeaders: {
//         token: token,
//     },
// });


export const readNotification = (obj)=>{
    return axiosInstanceJWT.post(wsConnectUrl.readNotification,obj)
}