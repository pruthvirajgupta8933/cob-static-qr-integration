import React, {useState, useContext, createContext} from 'react'
import classes from "../../approver.module.css"
import OperationKycModalForOnboard from './operation-kyc/OperationKycModalForOnboard';
import BankRefMerchantList from './merchant-product-subscription/BankRefMerchantList';
import ReferralOnboard from "./operation-kyc/ReferralOnboardForm/ReferralOnboard";


function MerchantReferralOnboard() {
    const [currentTab, setCurrentTab] = useState(1)
    // const MroContext = createContext(null)
    // const ThemeContext = createContext(null);
    const handleTabClick = (currenTab) => {
      setCurrentTab(currenTab)
    };


    return (
        // <ThemeContext.Provider value="dark">
        <section>
            <main >
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6">
                            <h5>
                                Bank Onboarding
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
                                            className={`nav-link ${currentTab === 1 && 'active-tab'} ${classes.cursor_pointer}`}
                                            onClick={() => handleTabClick(1)}
                                        >
                                            Add Bank Merchant
                                        </a>
                                    </li>

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
                    </section>

                    <section>
                        <div className="row">
                            {currentTab === 1 && <OperationKycModalForOnboard/>}
                            {currentTab === 2 && <ReferralOnboard/>}
                            {currentTab === 3 && <BankRefMerchantList/>}

                        </div>
                    </section>
                </div>
            </main>
        </section>
        // </ThemeContext.Provider>
    )
}
export default MerchantReferralOnboard