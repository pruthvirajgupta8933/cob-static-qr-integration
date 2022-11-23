import React from 'react'

function Notification() {
    return (


        <>
            {/* <div className="notification-1" style={{background: 'red', padding: 14, color: 'black', fontWeight: 600, fontSize: 16}}>Kindly visit on this Url <a href="https://sp2-partner.sabpaisa.in" rel="link" style={{color:'white'}} >https://sp2-partner.sabpaisa.in/</a>  to see all the data before 27 August 2022 . </div> */}
            <div className="alert alert-success text-center font-weight-bold" role="alert">
                Kindly visit on this Url ( <a href="https://sp2-partner.sabpaisa.in" target="_blank" className="alert-link" rel="noreferrer" >https://sp2-partner.sabpaisa.in/</a>  )  to see all the data before 27 August 2022 .
            </div>

        </>

    )
}

export default Notification;