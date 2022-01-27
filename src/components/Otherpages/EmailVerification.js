import React from 'react';
import { Link } from 'react-router-dom';
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png'

const EmailVerification = () => {
    



  return (
  <div>

<div class="card" style={{ width: 600, height: 400 , backgroundColor: '#999999'}}>

<img class="card-img-top" src={sabpaisalogo} alt="Card image cap" style={{position: 'absolute', height: '100px' , width: '200px'}} />
 


  <div class="card-body">
 
<h1 class="display-4" style={{ color: 'white' , position: 'absolute' , top: 150}} >Email Verification</h1>
<br />
<br />
<br />

     <div style={{ color: 'white' , position: 'absolute' , top: 300}} >
     <h3>Thanks for Sign Up !</h3>
 

<Link role="link" to="/login-page"> <button type="button"  class="btn btn-primary">Back To Login</button></Link>
</div>
     
  </div>
  </div>
  </div>
  )
};

export default EmailVerification;
