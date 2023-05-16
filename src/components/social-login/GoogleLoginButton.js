import React from 'react';
import GoogleLogin from 'react-google-login';

const GoogleLoginButton = () => {
  const clientId = '836072751988-tv9md4rbfi2nsp078mu3kvql47el5q4s.apps.googleusercontent.com';

  // const handleLoginSuccess = (response) => {
  //   console.log("fn call")
  //   console.log("response", response)
  //   const idToken = response.tokenId;
  //   // Send idToken to your server for authentication
  //   onLoginSuccess(idToken);
  // };
  const responseGoogle = (response) => {
    console.log(response);
    // Handle the response from Google Sign-In
  };

  const LoginFailure = (response)=>{
    console.log("err",response);

  }
  return (
    <GoogleLogin
      clientId={clientId}
      onSuccess={responseGoogle}
      onFailure={LoginFailure}
      buttonText="Sign in with Google"
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLoginButton;
