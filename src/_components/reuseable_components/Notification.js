import React from 'react'
import {  useSelector } from "react-redux";
import moment from 'moment';

function Notification() {
    const { user } = useSelector((state) => state.auth);
    const createdDate = user.createDate;
    const isBeforeAugust27 = moment(createdDate).isBefore('2022-08-27');
    
    return (
 <>
           <div>
    {isBeforeAugust27 && (
      <div className="alert alert-success text-center font-weight-bold" role="alert">
        Kindly visit on this Url (
        <a href="https://sp2-partner.sabpaisa.in" target="_blank" className="alert-link" rel="noreferrer">
          https://sp2-partner.sabpaisa.in/
        </a>
        ) to see all the data before 27 August 2022.
      </div>
    )}
  </div>

        </>

    )
}

export default Notification;