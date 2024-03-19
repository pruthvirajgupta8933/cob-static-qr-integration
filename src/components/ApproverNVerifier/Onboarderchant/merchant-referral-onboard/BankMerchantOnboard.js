import React, {useState} from 'react'
import classes from "../../approver.module.css"
import OperationKycModalForOnboard from './operation-kyc/OperationKycModalForOnboard';


function BankMerchantOnboard({zoneCode,referrerLoginId,heading}) {
    const [currentTab, setCurrentTab] = useState(1)
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
                            {heading===false ? null: heading===undefined ? <h5 className="">Bank Onboarding</h5>:""}
                            </h5>
                        </div>
                    </div>

                    <section>
                        <div className="row mt-5">
                        {heading===false ? null : heading===undefined ?
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
                                </ul>
                            </div> : ""}
                        </div>
                    </section>

                    <section>
                        <div className="row">
                            {currentTab === 1 && <OperationKycModalForOnboard zoneCode={zoneCode} bankLoginId={referrerLoginId}/>}
                        </div>
                    </section>
                </div>
            </main>
        </section>
        // </ThemeContext.Provider>
    )
}
export default BankMerchantOnboard