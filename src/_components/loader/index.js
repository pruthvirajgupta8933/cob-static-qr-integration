import React from "react";
import Spinner from "../../components/ApproverNVerifier/Spinner";
const CustomLoader = ({ loadingState }) => {
  return (
    <>
      {loadingState && (
        <p className="text-center spinner-roll">{<Spinner />}</p>
      )}
    </>
  );
};
export default CustomLoader;
