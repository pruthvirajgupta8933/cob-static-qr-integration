import React, { useEffect, useState } from "react";
import WalletDetail from "./WalletDetail";
import UserDetails from "./UserDetails";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import { useDispatch, useSelector } from "react-redux";
import { merchantSubscribedPlanData } from "../../../../slices/merchant-slice/productCatalogueSlice";
import moment from "moment";
// import { KYC_STATUS_PENDING } from "../../../../utilities/enums";
import { isNull } from "lodash";
import { v4 as uuidv4 } from 'uuid';


const Profile = () => {
  const [currentTab, setCurrentTab] = useState(1)
  const roles = roleBasedAccess()
  const dispatch = useDispatch();
  const { auth, productCatalogueSlice } = useSelector((state) => state);
  const { user } = auth
  const { SubscribedPlanData, isLoading, walletCommission,errorState } = productCatalogueSlice
  

  // console.log("SubscribedPlanData", SubscribedPlanData)
  const [walletDisplayData, setWalletDisplayData] = useState([])
  const [loading, setLoading] = useState(false);

  const clientId = user.clientMerchantDetailsList[0]?.clientId


  const handleTabClick = (currenTabVal) => {
    setCurrentTab(currenTabVal)
  };




  useEffect(() => {
    const postData = {
      clientId: clientId
    }
    dispatch(merchantSubscribedPlanData(postData))
  }, [clientId])



  const balanceCalculate = (purchaseAmount, commission) => {
    let cmsin = commission ?? 0
    const total = parseFloat(purchaseAmount) - parseFloat(cmsin)
    return isNaN(total) ? 0.00 : total.toFixed(2)
  }



  useEffect(() => {
    let dataWallet = []
    SubscribedPlanData?.map((data, i) => (

      dataWallet.push(<div className="col-lg-4 mx-3 my-1" key={uuidv4()}>
        <div className="card" style={{ width: '18rem' }}>
          <div className="card-body">
            <h5 className="card-title">{data.applicationName}</h5>
            <p className="card-subtitle mb-2 text-body-secondary">Plan : {data.planName}</p>
            <hr />

            {isNull(data?.mandateStatus) && data?.mandateStatus?.toLowerCase() !== "success" &&
              data?.plan_code === "005" && <p className="text-danger"> Payment is pending </p>}

            {data?.mandateStatus === "SUCCESS" && data?.plan_code === "005" && (
              <> <p className="card-text">Subscribed Date : {moment(data.mandateStartTime).format('DD/MM/YYYY')} </p>
                <p className="card-text">Purchased Amount : {data.purchaseAmount} INR</p>
                <p className="card-text">Commission : {data.commission ?? 0} INR</p>
                <p className="card-text">Wallet Balance : {balanceCalculate(data.purchaseAmount, data.commission)} INR</p></>)}
          </div>
        </div>
      </div>)

    ))
    setWalletDisplayData(dataWallet)
  }, [SubscribedPlanData])




  return (

    <div className="container-fluid flleft">
      <div className="mb-5">
        <h5 className>My Profile</h5>
      </div>
      <div className="row">
        <div className="col-2 bg-light p-1">
          {/* Tab navs */}
          <div className="nav flex-column nav-pills text-start" id="v-pills-tab" role="tablist" aria-orientation="vertical">
      <a className={`nav-link cursor_pointer px-2 fs-6 ${currentTab === 1 && 'active-secondary'}`} onClick={() => handleTabClick(1)} id="v-pills-link1-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link1" aria-selected="true">
        Profile
      </a>

      {/* Display loader if loading is true or if plan data is not available */}
      {(loading || (roles.merchant && !walletDisplayData?.length)) && !errorState && (
        <div className="d-flex align-items-center justify-content-center py-2">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Display plan tab only if merchant role and wallet display data is available */}
      {roles.merchant && walletDisplayData?.length > 0 && (
        <a className={`nav-link cursor_pointer px-2 fs-6 ${currentTab === 2 && 'active-secondary'}`} onClick={() => handleTabClick(2)} id="v-pills-link2-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link2" aria-selected="false">
          Plan
        </a>
      )}
    </div>

          {/* Tab navs */}
        </div>
        <div className="col-8">
          {/* Tab content */}
          <div className="tab-content" id="v-pills-tabContent">
            {currentTab === 1 && <UserDetails />}
            {currentTab === 2 && <WalletDetail isLoading={isLoading} walletDisplayData={SubscribedPlanData} walletCommission={walletCommission} />}
          </div>
          {/* Tab content */}
        </div>
      </div>

    </div>

  );
};



export default Profile