import React from 'react';
import GoogleLogin from 'react-google-login';

const GoogleLoginButton = ({ onLoginSuccess, onLoginFailure }) => {
  const clientId = 'YOUR_GOOGLE_CLIENT_ID';

  const handleLoginSuccess = (response) => {
    const idToken = response.tokenId;
    // Send idToken to your server for authentication
    onLoginSuccess(idToken);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      onSuccess={handleLoginSuccess}
      onFailure={onLoginFailure}
      buttonText="Sign in with Google"
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLoginButton;
