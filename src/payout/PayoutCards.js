import React from "react";

const PayoutCards = (props) => {
  return (
    <div
      // class="card w-25 mt-1 shadow hover-zoom"
      // style={{ background: props.bgColor, cursor: "pointer" }}
    >
      <div
      // class="card-body m-auto"
      >
        <p 
        class="text-secondary ml-2 mr-2"
        >{props.title}{" "}{props.text === `₹ NaN` ? "loading..." : props.text} |</p>
      </div>
    </div>
  );
};
export default PayoutCards;
