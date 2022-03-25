import React, { useEffect ,useState} from 'react';
import { Link ,useParams} from 'react-router-dom';
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png';
import axios from 'axios';


const EmailVerification = () => {
  const {loginId} =  useParams();
  const [data,setData]=useState(false)
  const onSubmit=async()=>{
     await axios.get(`https://cobapi.sabpaisa.in/auth-service/auth/emailVerify/${loginId}`)
    .then((response) => {
      setData(response);
    })
    .catch((e) => {
      console.log(e);
    })
    
  }


  useEffect(() => {
    onSubmit();
  
  }, []);
  
  return (
  <div>
<div className="card text-center" style={{"width":"40rem"}}>
<div className="card-header" style={{"background":"black"}}>
    <img  src={sabpaisalogo} alt="logo" width={"90px"} height={"25px"}/>
  </div>
  <div className="card-header" style={{"fontSize":"44px","fontWeight":"700"}}>
    Account {data?"Activated":"is not activate"}
  </div>
  <div className="card-body">
    <p className="card-text" style={{"fontSize":"24px"}}>
        <i className="fa fa-user" aria-hidden="true" style={{"color":data?"greenyellow":"#000"}}></i>
        <i className="fa fa-check" aria-hidden="true" style={{"color":data?"greenyellow":"#ff3030"}}></i> 
        </p>

    <p className="card-text" style={{"fontSize":"18px"}}>{data?"Thank you, your email has been verifed. Your account is now active. Please use the link below to login to your account.":"Please wait... !"}</p>
    <Link to="/" className="btn btn-primary">LOGIN TO YOUR ACCOUNT</Link>
  </div>
 
</div>
  </div>
  )
};

export default EmailVerification;
