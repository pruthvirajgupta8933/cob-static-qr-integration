/* eslint-disable array-callback-return */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { successTxnSummary, subscriptionplan, clearSuccessTxnsummary } from '../../../slices/dashboardSlice';
import ProgressBar from '../../../_components/reuseable_components/ProgressBar';
import { useRouteMatch, Redirect } from 'react-router-dom'
import '../css/Home.css';
// import { KycModal } from '../../KYC/KycModal';
import { roleBasedAccess } from '../../../_components/reuseable_components/roleBasedAccess';
import { kycModalToggle, kycVerificationForTabs } from '../../../slices/kycSlice';
import KycAlert from '../../KYC/KycAlert';
import NavBar from '../NavBar/NavBar';




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
  const { dashboard, auth, kyc } = useSelector((state) => state);
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

  // console.log(kyc?.kycVerificationForAllTabs?.is_verified)


  return (
    <section className="ant-layout">
{/* {console.log("kyc?.kycVerificationForAllTabs?.is_verified",kyc?.kycVerificationForAllTabs?.is_verified)} */}
      {/* {kyc?.kycVerificationForAllTabs?.is_verified === false ? <KycModal /> : <></>} */}

    <div>
      <NavBar />
    </div>
     
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Dashboard</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft" id="features08-3" style={{width: '100%'}}>
            <div className="container-fluid">
              <div className="row bgcolor">
                <div className="col-lg-12">

                <KycAlert />

                </div>

              </div>
            </div>
          </section>
        </div>

      </main>
    </section>
  );
}

export default Home