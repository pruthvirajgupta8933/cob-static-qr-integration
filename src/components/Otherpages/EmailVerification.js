import React from 'react';
import { Link } from 'react-router-dom';
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png'

const EmailVerification = () => {
    



  return (
  <div>

<div class="card" style={{ width: 600, height: 400 , backgroundColor: '#999999'}}>



  <div class="card-body">
  <div>
  <img class="card-img-top"  src={sabpaisalogo} alt="sabpaisa" style={{position: 'absolute', height: '34px' , width: '110px'}} />
 
  </div>
  

<h1 class="display-4" style={{ color: 'white'  }} >Email Verification</h1>

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
