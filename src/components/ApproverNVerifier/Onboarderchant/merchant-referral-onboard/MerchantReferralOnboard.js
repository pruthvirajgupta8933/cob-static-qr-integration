import React, {useState, useContext, createContext} from 'react'
import classes from "../../approver.module.css"
import OperationKycModalForOnboard from './operation-kyc/OperationKycModalForOnboard';
import BankRefMerchantList from './merchant-product-subscription/BankRefMerchantList';


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
                                {currentTab === 2 && <BankRefMerchantList />}
                        </div>
                    </section>
                </div>
            </main>
        </section>
        // </ThemeContext.Provider>
    )
}
export default MerchantReferralOnboard