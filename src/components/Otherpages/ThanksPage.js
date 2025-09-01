import React from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';


function ThanksPage() {
    const search = useLocation().search;
    const planid = new URLSearchParams(search).get('planid');
  

    // console.log(planid);
let tt = "";

if(planid==="10"){
    tt = "Your Payment Gateway facility is now activated! We will email the Live Integration Kit and API key to your registered email id shortly.";
    // setText(tt)
    // console.log(3)
}

if(planid==="11"){
    tt = "Your Paylink facility is now activated! You can now create payment links and start receiving payments.";
    // setText(tt)
    // console.log(4)
}


  


    return (
     <div className="jumbotron text-center">
        <h1 className="display-3">Congratulations,</h1>
        <p className="lead">{tt}</p>
        <hr />

        </div>

    );
}

export default ThanksPage;