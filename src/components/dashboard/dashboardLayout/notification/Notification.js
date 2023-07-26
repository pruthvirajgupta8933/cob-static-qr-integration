import React, { useEffect, useState } from 'react'
import classes from "./notification.module.css"
import { uniqueId } from 'lodash';
import moment from 'moment/moment';

function Notification() {

    const [toggle, setToggle] = useState(false)
    const [toggleRead, setToggleRead] = useState(false)

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.keyCode === 27) {
                // Call your function or perform actions when "Escape" key is pressed
                myFunction();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const myFunction = () => {
        setToggle(false)
        // Your code here: perform actions you want to execute on "Escape" key press
    };


    const notifyData = [{
        "notification": {
            "id": 62,

            "sender_role": "verifier",

            "recipient_roles": "verifier",

            "message": "kyc updated",

            "merchant": 53,

            "notification_type": "info",

            "is_read": false,

            "timestamp": "2023-07-24T11:39:22.852706",

            "merchant_name": "testing"

        },

        "delivery_tag": 14

    }]


    // Example function to print the time difference as "X hours ago" or "X minutes ago"
    function printTimeDifferenceFromGivenTime(givenTime) {
        // Create a moment object for the given time
        const givenMoment = moment(givenTime, 'YYYY-MM-DD HH:mm:ss');

        // Create a moment object for the current time
        const currentMoment = moment();

        // Calculate the time difference in milliseconds
        const timeDifferenceInMilliseconds = currentMoment.diff(givenMoment);

        // Convert the time difference to a duration object
        const duration = moment.duration(timeDifferenceInMilliseconds);

        // Get the difference in hours and minutes
        const hours = duration.hours();
        const minutes = duration.minutes();

        // Print the time difference
        if (hours > 0) {
            return hours + " hours ago"
        } else {
            return minutes + " minutes ago"
        }
    }

    const markAsRead = (deliveryTag) =>{
        setToggleRead(!toggleRead)
        console.log(deliveryTag)
    }
    return (
        <div className="dropdown mr-2">
            <div className="d-flex flex-row">
                <button className={`btn cob-primary-btn-bg btn-sm  text-uppercase text-white ${classes.btn_icon_with_count} ${toggle && 'show'}`} type="button" aria-expanded="false" onClick={() => setToggle(!toggle)}>
                    <i className={`fa fa-bell ${classes.fa}`} /> <span className={classes.count}> <p className={classes.count_number}>9+</p></span>
                </button>
            </div>

            <div className={`${classes.notification_card} ${!toggle && 'd-none'} `}>
                <ul className={`${classes.notify_ul}  ${toggle && 'show'} dropdown-menu   p-2`}>
                    <li className="d-flex justify-content-between mb-3">
                        <div><h5>Notification</h5></div>
                    </li>
                    {notifyData?.map((item) => (
                        <li className={`list-group-item list-group-item-action ${classes.noactive}`}  key={uniqueId()}>
                            <div className="d-flex dropdown-item justify-content-between ">
                                <div className={classes.notify_container}>
                                    <span className="text-align-center fs-1">{item?.notification?.merchant_name?.charAt(0).toLocaleUpperCase()}</span>
                                </div>
                                <div className={`flex-grow-1 ${classes.notification_message}  mr-3 ml-3`}>
                                    <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>{item?.notification?.message}</p>
                                    <p className={`m-0 ${classes.font_timestamp}`}>{printTimeDifferenceFromGivenTime(item?.notification?.timestamp)}</p>
                                </div>
                                <div className="">
                                    <button  onClick={()=>markAsRead(item?.delivery_tag)}>
                                        <i className="fa fa-envelope-open-o"></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}


                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-between">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className="d-flex dropdown-item justify-content-start">
                            <div className={classes.notify_container}>
                                <span className="text-align-center fs-2">A</span>
                            </div>
                            <div className={`${classes.notification_message}  mr-3 ml-3`}>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>Abhishek Verma submitted the KYC submitted the KYC</p>
                                <p className={`fs-6 m-0  ${classes.font_sofia_pro_light}`}>1 hour ago</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

        </div>

    )
}

export default Notification