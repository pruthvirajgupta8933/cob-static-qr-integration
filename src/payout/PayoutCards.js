import React from "react";

const PayoutCards = (props) => {
  return (
    <div
      class="card w-25 mt-1 shadow hover-zoom"
      style={{ background: props.bgColor, cursor: "pointer" }}
    >
      <div class="card-body m-auto">
        <h5 class="card-title">{props.title}</h5>
        <p class="card-text">{props.text === `₹ NaN` ? "loading..." : props.text}</p>
      </div>
    </div>
  );
};
export default PayoutCards;
