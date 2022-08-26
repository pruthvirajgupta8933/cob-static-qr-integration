import React, { useState } from "react";
import HeaderPage from "../login/HeaderPage";
import EnterUserID from "./EnterUserID";
import ResetPassword from "./ResetPassword";
import VerifyEmailPhone from "./VerifyEmailPhone";
import ThanksCard from "./ThanksCard";
import CreatePassword from "./CreatePassword";
import ThankingCardForReset from "./ThankingCardForReset";

const ForgetPassword = () => {
  const [showCard, setShowCard] = useState("a1");

  const handleFormSubmit = (currentCard,data={}) => {
    setShowCard(currentCard);
    // console.log("currentCard", currentCard);
  };

  return (
    <React.Fragment>
      <HeaderPage />

      {/* enter user id  */}
      {showCard === "a1" ? <EnterUserID props={handleFormSubmit} /> : <></>}

      {/* enter received otp code */}
      {showCard === "a2" ? (
        <VerifyEmailPhone props={handleFormSubmit} />
      ) : (
        <></>
      )}

      {/* reset password */}
      {showCard === "a3" ? <CreatePassword props={handleFormSubmit} /> : <></>}

      {/* reset password */}
      {showCard === "a4" ? <ThanksCard props={handleFormSubmit} /> : <></>}


    {/* Thanks Card for Updating / Reset the Password */}
      {showCard === "a5" ? <ThankingCardForReset props={handleFormSubmit} /> : <></>}

      
    </React.Fragment>
  );
};

export default ForgetPassword;
