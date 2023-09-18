import React, { useState } from 'react'
import classes from "../../approver.module.css"
import OperationKycModalForOnboard from './operation-kyc/OperationKycModalForOnboard';
import MerchantProductSubscription from './merchant-product-subscription/MerchantProductSubscription';


function MerchantReferralOnboard() {

  const [currentTab, setCurrentTab] = useState(1)

    const handleTabClick = (currenTab) => {
      setCurrentTab(currenTab)
        // dispatch(merchantTab(currenTab));
    };

    return (
        <section>
            <main >
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6">
                            <h5>
                                Merchant Referral Onboard
                            </h5>
                        </div>
                    </div>

                    <section>
                        <div className="row mt-5">
                            <div className="col-lg-12 mb-4">
                                <ul className="nav nav-tabs approv">
                                    <li className="nav-item ">
                                        <a
                                            href={() => false}
                                            className={`nav-link ${currentTab === 1 &&  'active-tab'} ${classes.cursor_pointer}`}
                                            onClick={() => handleTabClick(1)}
                                        >
                                            Add Bank Merchant
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            href={() => false}
                                            className={`nav-link  ${currentTab === 2 &&  'active-tab'} ${classes.cursor_pointer}`}

                                            onClick={() => handleTabClick(2)}
                                        >
                                            Product Subscription
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </section>

                    <section>

                        <div className="row">
                        {currentTab === 1 && <OperationKycModalForOnboard />}
                        {currentTab === 2 && <MerchantProductSubscription />}
                            {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
              lazy dog.The quick brown fox jumps over the lazy dog.</p> */}

                            {/* {(currenTab === 1 && <NotFilledKYC />) ||
              (currenTab === 2 && <PendindKyc />) ||
              (currenTab === 3 && <PendingVerification />) ||
              (currenTab === 4 && <VerifiedMerchant />) ||
              (currenTab === 5 && <ApprovedMerchant />) ||
              (currenTab === 6 && <RejectedKYC />) || (
                <NotFilledKYC />
              )} */}
                        </div>
                    </section>
                </div>
            </main>
        </section>
    )
}

export default MerchantReferralOnboard