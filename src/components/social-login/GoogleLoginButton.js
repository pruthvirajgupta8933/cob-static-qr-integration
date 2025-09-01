import React, { useEffect } from "react";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
// import UseGoogleLogout from "./GoogleLogout";
import { useGoogleLogout } from "react-google-login";
import classes from "./google-llogin.module.css"

const GoogleLoginButton = (props) => {
  const { enableSocialLogin, btnText, fnCls } = props;
  const signOut = useGoogleLogout({
    clientId: clientId,
    // onLogoutSuccess: handleLogout,
  });

  var clientId =
    "836072751988-7o1oegb07dtt7cfcgv5nfph1sqi4pnd4.apps.googleusercontent.com";
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "email",
      });
    }

    gapi.load("client:auth2", start);
  }, []);
  const responseGoogle = (response) => {
    props.enableSocialLogin(true, response);
    signOut();
  };

  const LoginFailure = (response) => { };

  return (
  
  <GoogleLogin
    clientId={clientId}
    onSuccess={responseGoogle}
    onFailure={LoginFailure}
    buttonText={btnText}
    cookiePolicy={"single_host_origin"}
    className={`${classes.box_shadow} d-flex justify-content-center w-100`}
   
  />


  );
};

export default GoogleLoginButton;
