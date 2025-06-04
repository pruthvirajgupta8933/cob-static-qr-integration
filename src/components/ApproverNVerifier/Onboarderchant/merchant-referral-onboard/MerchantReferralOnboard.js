import { useState } from 'react'
import classes from "../../approver.module.css"
import BankRefMerchantList from './merchant-product-subscription/BankRefMerchantList';
import CardLayout from '../../../../utilities/CardLayout';

function MerchantReferralOnboard() {
    const [currentTab, setCurrentTab] = useState(3)
    const handleTabClick = (currenTab) => {
        setCurrentTab(currenTab)
    };


    return (
        <CardLayout title="Referral Onboarding">
            <div className="row mt-3">
                <div className="col-lg-12 mb-4">
                    <ul className="nav nav-tabs approv">
                        {/* <li className="nav-item ">
                                            <a
                                                href={() => false}
                                                className={`nav-link ${currentTab === 2 && 'active-tab'} ${classes.cursor_pointer}`}
                                                onClick={() => handleTabClick(2)}
                                            >
                                                Add Referral
                                            </a>
                                        </li> */}

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



            <section>
                <div className="row">
                    {/* {currentTab === 2 && <ReferralOnboard />} */}
                    {/* {currentTab === 2 && <h5><Link to={"/dashboard/multi-user-onboard"}>Referral Onboard Form</Link></h5>} */}
                    {currentTab === 3 && <BankRefMerchantList />}


                </div>
            </section>


        </CardLayout >
        // </ThemeContext.Provider>
    )
}
export default MerchantReferralOnboard