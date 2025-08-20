import {
  GoogleLogin,
  GoogleOAuthProvider,
  googleLogout,
} from "@react-oauth/google";
import { gapi } from "gapi-script";
import { useEffect } from "react";
// import UseGoogleLogout from "./GoogleLogout";
// import { useGoogleLogout } from "react-google-login";
import classes from "./google-llogin.module.css";

const GoogleLoginButton = (props) => {
  const { enableSocialLogin, btnText, fnCls } = props;
  // const signOut = useGoogleLogout({
  //   clientId: clientId,
  //   // onLogoutSuccess: handleLogout,
  // });

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
    enableSocialLogin(true, response);
    // signOut();
    googleLogout();
  };

  const LoginFailure = (response) => {};

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={LoginFailure}
        text={btnText}
        cookiePolicy={"single_host_origin"}
        className={`${classes.box_shadow} d-flex justify-content-center w-100`}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
