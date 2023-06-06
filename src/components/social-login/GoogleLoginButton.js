import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
import UseGoogleLogout from "./GoogleLogout";
import { useGoogleLogout } from "react-google-login";

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

  const LoginFailure = (response) => {};

  return (
    <>
      <GoogleLogin
        clientId={clientId}
        onSuccess={responseGoogle}
        onFailure={LoginFailure}
        buttonText={btnText}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
};

export default GoogleLoginButton;
