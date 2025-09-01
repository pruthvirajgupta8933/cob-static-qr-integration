import React, { useEffect, useState } from "react";
import PayoutCards from "./PayoutCards";
import axios from "axios";
import API_URL from "../config";

const LedgerCards = () => {
  const [merchantData, setMerchantData] = useState({});
  useEffect(() => {
    ledgersMerchant();
  }, []);
  const ledgersMerchant = async () => {
    const authToken = JSON.parse(localStorage.getItem("ap"));
    axios
      .get(API_URL.LedgersMerchant, {
        headers: {
          "auth-token": authToken,
        },
      })
      .then((res) => {
        setMerchantData(res.data.data);
      });
  };

  return (
    <div>
      <div className="d-flex">
        {merchantData?.credited !== null && (
          <PayoutCards
            title={"Total Credit"}
            text={`₹ ${parseFloat(merchantData?.credited).toFixed(2)}`}
            bgColor={"#D7E9B9"}
          />
        )}
        {merchantData.debited !== null && (
          <PayoutCards
            title={"Total Debit"}
            text={`₹ ${parseFloat(merchantData?.debited).toFixed(2)}`}
            bgColor={"#FA9494"}
          />
        )}
        {merchantData?.balance !== null && (
          <PayoutCards
            title={"Total Balance"}
            text={`₹ ${parseFloat(merchantData?.balance).toFixed(2)}`}
            bgColor={"#B9F3FC"}
          />
        )}
      </div>
    </div>
  );
};
export default LedgerCards;
