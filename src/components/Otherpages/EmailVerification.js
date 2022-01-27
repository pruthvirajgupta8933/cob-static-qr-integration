import React from 'react';
import { Link } from 'react-router-dom';

const EmailVerification = () => {
    



  return (
  <div>

<div class="card" style={{ width: 600, height: 400 , backgroundColor: '#999999'}}>
  <div class="card-body">
 
<h1 class="display-4" style={{ color: 'white'}} >Email Verification</h1>
<br />
<br />
<br />

     <div >
     <h3>Thanks for Sign Up !</h3>
     </div>

<Link role="link" to="/login-page"> <button type="button"  class="btn btn-primary">Back To Login</button></Link>
     
  </div>
  </div>
  </div>
  )
};

export default EmailVerification;
