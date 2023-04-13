import React from "react";
import Spinner from "../../components/ApproverNVerifier/Spinner";
const CustomLoader = ({ loadingState }) => {
  return (
    <div>
      {loadingState && (
        <p className="text-center spinner-roll">{<Spinner />}</p>
      )}
    </div>
  );
};
export default CustomLoader;
