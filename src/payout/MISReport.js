import React, { useState } from "react";
import { merchantTab } from "../slices/approverVerifierTabSlice";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../components/dashboard/NavBar/NavBar";
import PayoutLedger from "./Ledger";
import Transactions from "./Transactions";

const MISReport = () => {
  const dispatch = useDispatch();
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
  const currenTab = parseInt(verifierApproverTab?.currenTab);

  const handleTabClick = (currenTab) => {
    dispatch(merchantTab(currenTab));
  };

  return (
    <>
      <section className="ant-layout">
        <div>
          
        </div>
        <div className="col-lg-12 mt-2 mb-4 bgcolor-">
          <ul className="nav nav-tabs approv">
            <li className="nav-item ">
              <a
                href={() => false}
                className={
                  "nav-link " + (currenTab === 1 ? "activepaylink" : "inactive")
                }
                onClick={() => handleTabClick(1)}
              >
                Ledger
              </a>
            </li>
            <li className="nav-item">
              <a
                href={() => false}
                className={
                  "nav-link " + (currenTab === 2 ? "activepaylink" : "inactive")
                }
                onClick={() => handleTabClick(2)}
              >
                Merchant Payout
              </a>
            </li>
            <li className="nav-item">
              <a
                href={() => false}
                className={
                  "nav-link " + (currenTab === 3 ? "activepaylink" : "inactive")
                }
                onClick={() => handleTabClick(3)}
              >
                Transaction History
              </a>
            </li>
          </ul>
          {(currenTab === 1 && <PayoutLedger navBar={false} />) ||
            (currenTab === 2 && "") ||
            (currenTab === 3 && <Transactions navBar={false} />)}
        </div>
      </section>
    </>
  );
};
export default MISReport;
