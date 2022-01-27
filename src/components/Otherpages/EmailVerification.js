import React from 'react';
import { Link } from 'react-router-dom';

const EmailVerification = () => {
    



  return (
  <div>

<div class="card" style={{ position: 'absolute', top: 100, left: 380, width: 600, height: 400 , backgroundColor: '#999999'}}>
  <div class="card-body">
 
<h1 class="display-4" style={{ position:'absolute', top: 10, left: 110, color: 'white'}} >Email Verification</h1>
<br />
<br />
<br />

     <div style={{ position:'absolute', top: 200, left: 230}} >
     <h3>Thanks for Sign Up !</h3>
     </div>

<Link role="link" to="/login-page"> <button type="button" style={{postion:'absolute', top:240 , left:250}} class="btn btn-primary">Back To Login</button></Link>
     
  </div>
  </div>
  </div>
  )
};

export default EmailVerification;
