import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
import CustomModal from "../../_components/custom_modal";
import AfterSignUp from "./AfterSignup";
import Registration from "../registration/Registration";


const GoogleLoginButton = () => {
  const clientId =
    "836072751988-7o1oegb07dtt7cfcgv5nfph1sqi4pnd4.apps.googleusercontent.com";
  const [isModalOpen, setIsModalOpen] = useState(true);
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "email",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

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

  const LoginFailure = (response) => {
    console.log("err", response);
  };
  const modalBody = () => {
    return (
      <>
        <AfterSignUp hideDetails={true} />
      </>
    );
  };

  return (
    <>
      <GoogleLogin
        clientId={clientId}
        onSuccess={responseGoogle}
        onFailure={LoginFailure}
        buttonText="Sign in with Google"
        cookiePolicy={"single_host_origin"}
      />
      <CustomModal
        modalBody={modalBody}
        headerTitle={"Registration"}
        modalToggle={isModalOpen}
        fnSetModalToggle={setIsModalOpen}
      />
    </>
  );
};

export default GoogleLoginButton;
