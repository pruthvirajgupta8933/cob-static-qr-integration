import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import OtpInput from "react-otp-input";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";

const OtpView = ({
  otp,
  handleChangeForOtp,
  handleClickForVerification,
  classes,
  showResendCode,
  otpVerificationError,
}) => {
  const [message, setMessage] = useState("");
  
  const handleClickforResendOTP = () => {
    setMessage("Otp has been send to the Registered Email And mobile number");
    setTimeout(function () {
      setMessage("");
    }, 2000);
  };
  return (
    <>
      <Grid item xs={12} className={classes.EnterVerificationCodeContainer}>
        <Typography
          component="h1"
          variant="h6"
          className={classes.EnterVerificationCodetext}
        >
          OTP has been send to Registered Email and Mobile Number
        </Typography>
        <Typography
          component="h1"
          variant="h6"
          gutterBottom
          className={classes.EnterVerificationCodetext}
        >
          Enter Verification Code to proceed
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        className={classes.EnterVerificationCodeContainer}
      ></Grid>
      <Grid item xs={12}>
        <OtpInput
          value={otp.otp}
          onChange={handleChangeForOtp}
          numInputs={6}
          separator={<span>-</span>}
          inputStyle={classes.otpInputBox}
          containerStyle={classes.otpBoxContainer}
          isInputNum={true}
        />
      </Grid>
      <Grid item xs={8} className={classes.ResendOTPMessage}>
        {message ? message : null}
      </Grid>      
      <Grid item xs={8} className={classes.OtpVerificationError}>
        {otpVerificationError !== "" ? otpVerificationError : null}
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleClickForVerification}
        >
          Verify and Proceed
        </Button>
      </Grid>
    </>
  );
};

export default OtpView;
