import React from "react";

const PayoutCards = (props) => {
  return (
    <div
      // className="card w-25 mt-1 shadow hover-zoom"
      // style={{ background: props.bgColor, cursor: "pointer" }}
    >
      <div
      // className="card-body m-auto"
      >
        <p 
        className="text-secondary ml-2 mr-2"
        >{props.title}{" "}{props.text === `₹ NaN` ? "loading..." : props.text} |</p>
      </div>
    </div>
  );
};
export default PayoutCards;
