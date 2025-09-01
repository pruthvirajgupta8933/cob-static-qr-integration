// import React, { useEffect, useState } from 'react'
// import classes from "./notification.module.css"
// import { uniqueId } from 'lodash';
// import moment from 'moment/moment';
// // import Connection from '../../../websocket/Connection';
// // import io from 'socket.io-client';
// // import { wsConnectUrl } from '../../config';
// import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess';
// // import { socketConnection } from '../../../../services/notification-service/notification.service';
// import { useDispatch } from 'react-redux';
// // import { fetchReadNotification } from '../../../../slices/notification-slice/notificationSlice';
// // import { wsConnectUrl } from '../../../../config';
// // import TestConnection from '../../../websocket/TestConnection';


// const role = roleBasedAccess()
// let token = ""
// if (role.approver) {
//     token = 'ptaie3^jt1&jnrr+=kxu(g5)m2ut08hs6t46l)c8_!k%_av=67'
// } else if (role.verifier) {
//     token = '0uwry5@z2%b7n&uu(lw7&by+yh)_d0nb!)x$(#3@6f6(9_d9w$'
// } else if (role.viewer) {
//     token = '(on2m)4u&r&(ju(8@6r7&x9-qdioku56fey5ki_i(=4r41fzv!'
// } else {
//     token = ''
// }

// function Notification() {

//     const [toggle, setToggle] = useState(false)
//     const [toggleRead, setToggleRead] = useState(false)
//     const dispatch = useDispatch()


//     // const [notificationData, setNotificationData] = useState([])

//     const [objectArray, setObjectArray] = useState([]);

//     useEffect(() => {
//         console.log("dfdf")
//         // Listen for 'message' events from the server
//         // socketConnection.on('notify', (data) => {
//         //     console.log("notify-", data)
//         //     setObjectArray((prevArray) => [...prevArray, data]);
//         // });


//         // socketConnection.on('error', (data) => {
//         //     console.log("error", data)
//         // });

//         // Clean up the socket connection when the component unmounts
//         return () => {
//             // socketConnection.disconnect();
//             // console.log("socket disconnect")
//         };
//     }, []);


//     useEffect(() => {
//         const postData = {
//             "fetch_all": true,
//             // "role": "All"
//         }
//         // dispatch(fetchReadNotification(postData))
//     }, [])


//     // const socket = io("ws://192.168.34.26:5000",
//     // {
//     //     debug: true,
//     //     extraHeaders: {
//     //         token: "verifier_token",
//     //     },
//     // });

//     // useEffect(() => {


//     //     socket.on('connect', () => {
//     //         console.log('Socket.io connected!');
//     //     });

//     //     console.log("call")
//     //     // Replace 'your-server-url' with your Socket.io server URL

//     //     // Event listener for when the connection is established


//     //     // Event listener for receiving messages from the server
//     //     // socket.on('jwt_token', (data) => {
//     //     //   console.log('jwt_token:', data);
//     //     //   // Handle the received message here as needed
//     //     // });

//     //     // Event listener for receiving messages from the server

//     //     socket.on('notify', (data) => {
//     //         console.log("notify", data)
//     //         // const parsedData = JSON.parse(data);
//     //         // Update the state by adding the new object to the existing array
//     //         setObjectArray((prevArray) => [...prevArray, data]);
//     //         // Handle the received message here as needed
//     //     });

//     //     // Event listener for errors
//     //     socket.on('error', (error) => {
//     //         console.log('Socket.io error:', error);
//     //     });

//     //     // Clean up the Socket.io connection when the component unmounts
//     //     return () => {
//     //         socket.off('connect');
//     //         socket.off('jwt_token');
//     //         socket.off('notify');
//     //         socket.off('error');
//     //         socket.off('disconnect');
//     //         setObjectArray([])
//     //         socket.disconnect();
//     //     };
//     // }, []);

//     console.log("objectArray", objectArray)


//     useEffect(() => {
//         const handleKeyDown = (event) => {
//             if (event.keyCode === 27) {
//                 myFunction();
//             }
//         };
//         document.addEventListener('keydown', handleKeyDown);

//         return () => {
//             document.removeEventListener('keydown', handleKeyDown);
//         };



//     }, []);



//     const myFunction = () => {
//         setToggle(false)
//         // Your code here: perform actions you want to execute on "Escape" key press
//     };


//     // Example function to print the time difference as "X hours ago" or "X minutes ago"
//     function printTimeDifferenceFromGivenTime(givenTime) {
//         // Create a moment object for the given time
//         const givenMoment = moment(givenTime, 'YYYY-MM-DD HH:mm:ss');
//         // Create a moment object for the current time
//         const currentMoment = moment();
//         // Calculate the time difference in milliseconds
//         const timeDifferenceInMilliseconds = currentMoment.diff(givenMoment);
//         // Convert the time difference to a duration object
//         const duration = moment.duration(timeDifferenceInMilliseconds);
//         // Get the difference in hours and minutes
//         const hours = duration.hours();
//         const minutes = duration.minutes();
//         // Print the time difference
//         if (hours > 0) {
//             return hours + " hours ago"
//         } else {
//             return minutes + " minutes ago"
//         }
//     }


//     const markAsRead = (obj) => {
//         setToggleRead(!toggleRead)
//         console.log(obj)
//         // socketConnection.emit('mark_as_read', obj)
//     }



//     // console.log("notificationData",notificationData)
//     return (
//         <div className="dropdown mr-2">
//             {/* <TestConnection /> */}
//             <div className="d-flex flex-row">
//                 <button className={`btn cob-primary-btn-bg btn-sm  text-uppercase text-white ${classes.btn_icon_with_count} ${toggle && 'show'}`} type="button" aria-expanded="false" onClick={() => setToggle(!toggle)}>
//                     <i className={`fa fa-bell ${classes.fa}`} /> <span className={classes.count}> <p className={classes.count_number}>9+</p></span>
//                 </button>
//             </div>

//             <div className={`${classes.notification_card} ${!toggle && 'd-none'} `}>
//                 <ul className={`${classes.notify_ul}  ${toggle && 'show'} dropdown-menu   p-2`}>
//                     <li className="d-flex justify-content-start mb-3">
//                         <div>
//                             <h5>Notification</h5>
//                             <p className="text-muted"><span className="m-1 text-decoration-underline">Unread</span><span className="m-1">Read</span></p>
//                         </div>
//                     </li>
//                     {objectArray?.map((item) => (
//                         <li className={`list-group-item list-group-item-action ${classes.noactive}`} key={uniqueId()}>
//                             <div className="d-flex dropdown-item justify-content-start text-wrap">
//                                 <div className={classes.notify_container}>
//                                     <span className="text-align-center">{item?.notification?.merchant_name?.charAt(0).toLocaleUpperCase()}</span>
//                                 </div>
//                                 <div className={`flex-grow-1- ${classes.notification_message} ${classes.content_wrap}  mr-3 ml-3`} >
//                                     <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>{item?.notification?.message}</p>
//                                     <p className={`m-0 ${classes.font_timestamp}`}>{printTimeDifferenceFromGivenTime(item?.notification?.timestamp)}</p>
//                                 </div>
//                                 <div className="">

//                                     <button onClick={() => markAsRead({ "delivery_tag": item?.delivery_tag, "notification_id": item?.notification?.id })}>
//                                         <i className="fa fa-envelope-open-o"></i>
//                                     </button>
//                                 </div>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>

//     )
// }

// export default Notification