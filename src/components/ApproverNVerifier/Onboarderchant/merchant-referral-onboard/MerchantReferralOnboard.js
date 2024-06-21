import React, { useState } from 'react'
import classes from "../../approver.module.css"
import BankRefMerchantList from './merchant-product-subscription/BankRefMerchantList';
// import ReferralOnboard from "./operation-kyc/ReferralOnboardForm/ReferralOnboard";
import { Link } from 'react-router-dom';

function MerchantReferralOnboard() {
    const [currentTab, setCurrentTab] = useState(2)
    const handleTabClick = (currenTab) => {
        setCurrentTab(currenTab)
    };


    return (

        <section>
            <main >
                <div>
                    <h5>
                        Referral Onboarding
                    </h5>
                    <section>
                        <div className="container-fluid p-0">
                            <div className="row mt-5">
                                <div className="col-lg-12 mb-4">
                                    <ul className="nav nav-tabs approv">
                                        <li className="nav-item ">
                                            <a
                                                href={() => false}
                                                className={`nav-link ${currentTab === 2 && 'active-tab'} ${classes.cursor_pointer}`}
                                                onClick={() => handleTabClick(2)}
                                            >
                                                Add Referral
                                            </a>
                                        </li>

                                        <li className="nav-item">
                                            <a
                                                href={() => false}
                                                className={`nav-link  ${currentTab === 3 && 'active-tab'} ${classes.cursor_pointer}`}
                                                onClick={() => handleTabClick(3)}
                                            >
                                                Product Subscription
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="row">
                            {/* {currentTab === 2 && <ReferralOnboard />} */}
                            {currentTab === 2 && <h5><Link to={"/dashboard/multi-user-onboard"}>Referral Onboard Form</Link></h5>}
                            {currentTab === 3 && <BankRefMerchantList />}


                        </div>
                    </section>
                </div>
            </main>
        </section>
        // </ThemeContext.Provider>
    )
}
export default MerchantReferralOnboard