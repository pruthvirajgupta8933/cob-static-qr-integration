import React from 'react'
import ContactDetailsOps from './kyc-form/ContactDetailsOps'
import BankDetailsOps from './kyc-form/BankDetailsOps'
import { useState } from 'react'
import BusinessDetailsOps from './kyc-form/BusinessDetailsOps'
import DocumentCenter from './kyc-form/DocumentCenter'

function OperationKycModalForOnboard() {

    const [currentTab, setCurrentTab] = useState(1)

    const handleTabClick = (currenTabVal) => {
        setCurrentTab(currenTabVal)
    };


    return (
        <div className="row">
            <div className="col-2 bg-light p-1">
                {/* Tab navs */}
                <div className="nav flex-column nav-pills text-start " id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a className={`nav-link ${currentTab === 1 && 'active'}`} onClick={() => handleTabClick(1)} id="v-pills-link1-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link1" aria-selected="true">Contact Details</a>
                    <a className={`nav-link ${currentTab === 2 && 'active'}`} onClick={() => handleTabClick(2)} id="v-pills-link2-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link2" aria-selected="false">Bank Details</a>
                    <a className={`nav-link ${currentTab === 3 && 'active'}`} onClick={() => handleTabClick(3)} id="v-pills-link3-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link3" aria-selected="false">Business Details</a>
                    <a className={`nav-link ${currentTab === 4 && 'active'}`} onClick={() => handleTabClick(4)} id="v-pills-link4-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link4" aria-selected="false">Document Center</a>
                </div>
                {/* Tab navs */}
            </div>
            <div className="col-10">
                {/* Tab content */}
                <div className="tab-content" id="v-pills-tabContent">
                    {currentTab === 1 && <ContactDetailsOps />}

                    {currentTab === 2 && <BankDetailsOps />}

                    {currentTab === 3 && <BusinessDetailsOps />}

                    {currentTab === 4 && <DocumentCenter />}

                </div>
                {/* Tab content */}
            </div>
        </div>

    )
}

export default OperationKycModalForOnboard