import React, { useState, useEffect } from "react";
import WalletDetail from "./WalletDetail";
import UserDetails from "./UserDetails";

const Profile = () => {
  const [currentTab, setCurrentTab] = useState(1)



  const handleTabClick = (currenTabVal) => {
    setCurrentTab(currenTabVal)
  };




  return (

    <div className="container-fluid flleft">
      <div className="mb-5">
        <h5 className>Profile</h5>
      </div>

      <div className="row">
        <div className="col-2 bg-light p-1">
          {/* Tab navs */}
          <div className="nav flex-column nav-pills text-start " id="v-pills-tab" role="tablist"
            aria-orientation="vertical">
            <a className={`nav-link cursor_pointer px-2 fs-6 ${currentTab === 1 && 'active-secondary'}  `}
              onClick={() => handleTabClick(1)} id="v-pills-link1-tab" data-mdb-toggle="pill"
              href={() => false} role="tab" aria-controls="v-pills-link1" aria-selected="true">Profile</a>
            <a className={`nav-link cursor_pointer px-2 fs-6 ${currentTab === 2 && 'active-secondary'} `}
              onClick={() => handleTabClick(2)} id="v-pills-link2-tab" data-mdb-toggle="pill"
              href={() => false} role="tab" aria-controls="v-pills-link2" aria-selected="false">Wallet</a>


          </div>
          {/* Tab navs */}
        </div>
        <div className="col-8">
          {/* Tab content */}

          <div className="tab-content" id="v-pills-tabContent">
            {currentTab === 1 && <UserDetails />}
            {currentTab === 2 && <WalletDetail />}
          </div>
          {/* Tab content */}
        </div>
      </div>

    </div>

  );
};



export default Profile