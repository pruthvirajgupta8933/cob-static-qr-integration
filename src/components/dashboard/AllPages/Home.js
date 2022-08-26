/* eslint-disable array-callback-return */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { successTxnSummary, subscriptionplan, clearSuccessTxnsummary } from '../../../slices/dashboardSlice';
import ProgressBar from '../../../_components/reuseable_components/ProgressBar';
import { useRouteMatch, Redirect } from 'react-router-dom'
import '../css/Home.css';
import { KycModal } from '../../KYC/KycModal';
import { roleBasedAccess } from '../../../_components/reuseable_components/roleBasedAccess';
import { kycVerificationForTabs } from '../../../slices/kycSlice';




function Home() {
  // console.log("home page call");
  const roles = roleBasedAccess();


  const dispatch = useDispatch();
  let { path } = useRouteMatch();

  const [clientCode, setClientCode] = useState("1");

  const [search, SetSearch] = useState("");
  const [txnList, SetTxnList] = useState([]);
  const [showData, SetShowData] = useState([]);
  // const [roleType, setRoleType] = useState(roles);
  const { dashboard, auth } = useSelector((state) => state);
  // console.log("dashboard",dashboard)
  const { isLoading, successTxnsumry } = dashboard;
  const { user } = auth;

  const currentDate = new Date().toJSON().slice(0, 10);
  const fromDate = currentDate;
  const toDate = currentDate;

  var clientCodeArr = [];
  var totalSuccessTxn = 0;
  var totalAmt = 0;

  // dispatch action when client code change
  useEffect(() => {
    const objParam = { fromDate, toDate, clientCode };
    var DefaulttxnList = [];
    SetTxnList(DefaulttxnList);
    SetShowData(DefaulttxnList);
    // console.log(objParam);
    dispatch(subscriptionplan);
    dispatch(successTxnSummary(objParam));
    dispatch(
      kycVerificationForTabs({
        login_id: user?.loginId,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientCode]);


  //make client code array
  if (user?.clientMerchantDetailsList !== null && user.clientMerchantDetailsList?.length > 0) {
    clientCodeArr = user.clientMerchantDetailsList.map((item) => {
      return item.clientCode;
    });
  } else {
    clientCodeArr = []
  }



  // filter api response data with client code
  useEffect(() => {
    if (successTxnsumry?.length > 0) {
      // eslint-disable-next-line array-callback-return
      var filterData = successTxnsumry?.filter((txnsummery) => {
        if (clientCodeArr.includes(txnsummery.clientCode)) {
          return clientCodeArr.includes(txnsummery.clientCode);
        }
      });
      SetTxnList(filterData);
      SetShowData(filterData);
    } else {
      //successTxnsumry=[];
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successTxnsumry])


  useEffect(() => {
    search !== ''
      ? SetShowData(txnList.filter((txnItme) =>
        Object.values(txnItme).join(" ").toLowerCase().includes(search.toLocaleLowerCase())))
      : SetShowData(txnList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);


  useEffect(() => {
    return () => {
      dispatch(clearSuccessTxnsummary());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleChange = (e) => {
    SetSearch(e);
  }




  if (roles.merchant === true) {
    if (user.clientMerchantDetailsList === null) {
      return <Redirect to={`${path}/profile`} />
    }
  } else if (roles.approver === true || roles.verifier === true) {
    return <Redirect to={`${path}/approver`} />
  }


  showData.map((item) => {
    totalSuccessTxn += item.noOfTransaction;
    totalAmt += item.payeeamount
  })

  return (
    <section className="ant-layout">

      <KycModal />
      <div className="profileBarStatus">
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Dashboard</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft" id="features08-3-">
            <div className="container-fluid">
              <div className="row bgcolor">
                <div className="col-lg-12">

               
  
    <div>
  <p>Guidelines on "Know Your Customer" <br /><u>norms and "Cash transactions</u>"</p><p align="JUSTIFY">As part of ‘Know Your Customer’ (KYC) principle, RBI has issued several guidelines relating to identification of depositors and advised the banks to put in place systems and procedures to help control financial frauds, identify money laundering and suspicious activities, and for scrutiny/monitoring of large value cash transactions. Instructions have also been issued by the RBI from time to time advising banks to be vigilant while opening accounts for new customers to prevent misuse of the banking system for perpetration of frauds. A gist of the past circulars issued on the subjects under reference are listed in the Annexure. Taking into account recent developments, both domestic and international, it has been decided to reiterate and consolidate the extant instructions on KYC norms and cash transactions. The following guidelines reinforce our earlier instructions on the subject with a view to safeguarding banks from being unwittingly used for the transfer or deposit of funds derived from criminal activity (both in respect of deposit and borrowal accounts), or for financing of terrorism. The guidelines are also applicable to foreign currency accounts/transactions.</p><p align="JUSTIFY" /><p align="JUSTIFY">2. <b>"Know Your Customer" (KYC) guidelines for New accounts</b></p><p align="JUSTIFY">The following KYC guidelines will be applicable to all new accounts with immediate effect. </p><p align="JUSTIFY">2.1<u>KYC Policy</u></p><p align="JUSTIFY">(i)"Know Your Customer" (KYC) procedure should be the key principle for identification of an individual/corporate opening an account. The customer identification should entail verification through an introductory reference from an existing account holder/a person known to the bank or on the basis of documents provided by the customer. </p><p align="JUSTIFY">(ii)The Board of Directors of the banks should have in place adequate policies that establish procedures to verify the bonafide identification of individual/corporates opening an account. The Board should also have in place policies that establish processes and procedures to monitor transactions of suspicious nature in accounts and have systems of conducting due diligence and reporting of such transactions.</p><u><p align="JUSTIFY" /></u><p align="JUSTIFY">2.2<u>Customer identification </u></p><p align="JUSTIFY">(i)The objectives of the KYC framework should be two fold, (i) to ensure appropriate customer identification and (ii) to monitor transactions of a suspicious nature. Banks should obtain all information necessary to establish the identity/legal existence of each new customer, based preferably on disclosures by customers themselves. Typically easy means of establishing identity would be documents such as passport, driving license etc. However where such documents are not available, verification by existing account holders or introduction by a person known to the bank may suffice. It should be ensured that the procedure adopted does not lead to denial of access to the general public for banking services.</p><p align="JUSTIFY">(ii)In this connection, we also invite a reference to a Report on Anti Money Laundering Guidelines for Banks in India prepared by a Working Group, set up by IBA, for your guidance. It may be seen that the IBA Working Group has made several recommendations for strengthening KYC norms with anti money laundering focus and has also suggested formats for customer profile, account opening procedures, establishing relationship with specific categories of customers, as well as an illustrative list of suspicious activities.</p><p align="JUSTIFY" /><p align="JUSTIFY">3. <b>"Know Your Customer" procedures for existing customers</b> </p><p align="JUSTIFY">Banks are expected to have adopted due diligence and appropriate KYC norms at the time of opening of accounts in respect of existing customers in terms of our extant instructions referred to in the Annexure. However, in case of any omission, the requisite KYC procedures for customer identification should be got completed at the earliest. </p><p align="JUSTIFY" />
</div>

                 
                </div>
                {/* <div className="col-lg-6 mrg-btm- bgcolor-">
                    <label>Successful Transaction Summary</label>
                    <select
                      className="ant-input"
                      value={clientCode}
                      onChange={(e) => setClientCode(e.currentTarget.value)}
                    >
                      <option defaultValue="selected" value="1">
                        Today
                      </option>
                      <option value="2">Yesterday</option>
                      <option value="3">Last 7 Days</option>
                      <option value="4">Current Month</option>
                      <option value="5">Last Month</option>
                    </select>
                  </div> */}

                {/* {txnList.length > 0 ? (
                    <div className="col-lg-6 mrg-btm-">
                      <label>Search</label>
                      <input
                        type="text"
                        className="ant-input"
                        onChange={(e) => {
                          handleChange(e.currentTarget.value);
                        }}
                        placeholder="Search from here"
                      />
                    </div>
                  ) : (
                    <></>
                  )} */}
                {/* <div className="gap">
                    <p>
                      Total Successful Transactions: {totalSuccessTxn} | Total
                      Amount {`(INR)`}: {totalAmt}{" "}
                    </p>
                  </div> */}




              </div>
            </div>
          </section>
        </div>

      </main>
    </section>
  );
}

export default Home