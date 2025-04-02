import React, { useState } from "react";
import Table from "../../../../_components/table_components/table/Table";
import DateFormatter from "../../../../utilities/DateConvert";

function WalletDetail({ isLoading, walletDisplayData, walletCommission }) {
  const [visibleDataCount, setVisibleDataCount] = useState(10);

  let purchaseAmt = 0;
  if (walletDisplayData && Array.isArray(walletDisplayData)) {
    purchaseAmt = walletDisplayData
      .filter(
        (data) =>
          data &&
          data.mandateStatus &&
          data.mandateStatus.toLowerCase() === "success"
      )
      .reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.purchaseAmount || 0),
        0
      );
  }

  const rowHeader = [
    {
      id: "201",
      name: "Subscribed Id",
      selector: (row) => row.clientSubscribedPlanDetailsId,
      grow: 0,
    },
    {
      id: "202",
      name: "Client Transaction Id",
      selector: (row) => row.clientTxnId,
      width: "250px",
    },
    {
      id: "2",
      name: "Application Name",
      selector: (row) => row.applicationName,
    },
    {
      id: "4",
      name: "Plan Name",
      selector: (row) => row.planName,
    },
    {
      id: "3",
      name: "Purchase Amount",
      selector: (row) => parseFloat(row.purchaseAmount).toFixed(2),
    },
    {
      id: "5",
      name: "Subscription Status",
      selector: (row) => row.subscription_status,
    },
    {
      id: "6",
      name: "Payment Date",
      selector: (row) => DateFormatter(row.mandateStartTime, false),
    },
  ];

  const handleLoadMore = () => {
    setVisibleDataCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="row">
      <div className="col-lg-12 my-2">
        <span className="font-size-14">
          Total Purchase Amount: {purchaseAmt.toFixed(2)} | Commission: {" "}
          {parseFloat(walletCommission).toFixed(2)} | Wallet Balance: {" "}
          {(purchaseAmt - parseFloat(walletCommission)).toFixed(2)}
        </span>{" "}
      </div>
      <div className="scroll overflow-auto">
        <Table
          row={rowHeader}
          data={walletDisplayData.slice(0, visibleDataCount)}
        />
        {visibleDataCount < walletDisplayData.length && (
          <div className="text-center my-3">
            <div className="text-primary cursor_pointer" onClick={handleLoadMore}>
              Load More
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default WalletDetail;