import React from 'react'

const RejectNotification = () => {
  return (
    <>
            {/* <div className="notification-1" style={{background: 'red', padding: 14, color: 'black', fontWeight: 600, fontSize: 16}}>Kindly visit on this Url <a href="https://sp2-partner.sabpaisa.in" rel="link" style={{color:'white'}} >https://sp2-partner.sabpaisa.in/</a>  to see all the data before 27 August 2022 . </div> */}
            <div className="alert alert-danger text-center font-weight-bold" role="alert">
              Your KYC has been rejected.
            </div>

        </>
  )
}

export default RejectNotification