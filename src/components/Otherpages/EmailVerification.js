import React, { useEffect ,useState} from 'react';
import { Link ,useParams} from 'react-router-dom';
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png';
import axios from 'axios';
import API_URL from '../../config';
import { axiosInstance,axiosInstanceJWT,axiosInstanceAuth} from '../../utilities/axiosInstance';


const EmailVerification = () => {
  const {loginId} =  useParams();
  const [data,setData]=useState(false)
 


  useEffect(() => {
    axiosInstanceAuth.put(`${API_URL.EMAIL_VERIFY}${loginId}`)
    .then((response) => {
      setData(response);
    })
    .catch((e) => {
      // console.log(e);
    }) 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginId]);
  
  return (
  <div className="row d-flex justify-content-center">
    <div className="col-lg-6 col-md-6 col-sm-12 ">
      <div className="card text-center" >
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
        <Link to="/" className="btn  cob-btn-primary text-white">LOGIN TO YOUR ACCOUNT</Link>
      </div>
      </div>
    </div>
  </div>
  )
};

export default EmailVerification;
