import React, { useEffect, useState } from "react";
import WalletDetail from "./WalletDetail";
import UserDetails from "./UserDetails";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import { useDispatch, useSelector } from "react-redux";
import { merchantSubscribedPlanData } from "../../../../slices/merchant-slice/productCatalogueSlice";
import moment from "moment";


const Profile = () => {
  const [currentTab, setCurrentTab] = useState(1)
  const roles = roleBasedAccess()
  const dispatch = useDispatch();
  const { auth, productCatalogueSlice } = useSelector((state) => state);
  const { user } = auth
  const { SubscribedPlanData, isLoading } = productCatalogueSlice
  const [walletDisplayData, setWalletDisplayData] = useState([])

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
      data?.mandateStatus === "SUCCESS" && data?.plan_code === "005" && (
        dataWallet.push(<div className="col-lg-4 mx-3 my-1" key={i}>
          <div className="card" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">{data.applicationName}</h5>
              <h6 className="card-subtitle mb-2 text-body-secondary">{data.planName}</h6>
              <hr />
              <p className="card-text">Subscribed Date : {moment(data.mandateStartTime).format('DD/MM/YYYY')} </p>
              <p className="card-text">Purchased Amount : {data.purchaseAmount} INR</p>
              <p className="card-text">Commission : {data.commission ?? 0} INR</p>
              <p className="card-text">Wallet Balance : {balanceCalculate(data.purchaseAmount, data.commission)} INR</p>
            </div>
          </div>
        </div>)
      )
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
          <div className="nav flex-column nav-pills text-start " id="v-pills-tab" role="tablist"
            aria-orientation="vertical">
            <a className={`nav-link cursor_pointer px-2 fs-6 ${currentTab === 1 && 'active-secondary'}  `}
              onClick={() => handleTabClick(1)} id="v-pills-link1-tab" data-mdb-toggle="pill"
              href={() => false} role="tab" aria-controls="v-pills-link1" aria-selected="true">Profile</a>

            {roles.merchant && walletDisplayData?.length > 0 && <a className={`nav-link cursor_pointer px-2 fs-6 ${currentTab === 2 && 'active-secondary'} `}
              onClick={() => handleTabClick(2)} id="v-pills-link2-tab" data-mdb-toggle="pill"
              href={() => false} role="tab" aria-controls="v-pills-link2" aria-selected="false">Wallet</a>}
          </div>
          {/* Tab navs */}
        </div>
        <div className="col-8">
          {/* Tab content */}
          <div className="tab-content" id="v-pills-tabContent">
            {currentTab === 1 && <UserDetails />}
            {currentTab === 2 && <WalletDetail isLoading={isLoading} walletDisplayData={walletDisplayData} />}
          </div>
          {/* Tab content */}
        </div>
      </div>

    </div>

  );
};



export default Profile