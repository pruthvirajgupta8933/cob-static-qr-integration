import React, { useState } from 'react'
import BankDetailsOps from './bank-kyc-form/BankDetailsOps'
import BusinessDetailsOps from './bank-kyc-form/BusinessDetailsOps'
import DocumentCenter from './bank-kyc-form/DocumentCenter'
import BasicDetailsOps from './bank-kyc-form/BasicDetailsOps'
import SubmitKyc from './bank-kyc-form/SubmitKyc'
import { useSelector } from 'react-redux'

function OperationKycModalForOnboard() {

    const [currentTab, setCurrentTab] = useState(1)
    // const {} = useSelector(state=>state)

    const handleTabClick = (currenTabVal) => {
        setCurrentTab(currenTabVal)
    };


    return (
        <div className="row">
         <div className="d-flex bg-light justify-content-between px-0 my-2">
                        <p className="p-2 m-0">Session Start : Abhishek Verma</p>
                        <p className="p-2 m-0">Merhcant Onboard Login ID : 12333</p>
                    </div>
            <div className="col-2 bg-light p-1">
                {/* Tab navs */}

                <div className="nav flex-column nav-pills text-start " id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a className={`nav-link cursor_pointer px-2 ${currentTab === 1 && 'active-secondary'}`} onClick={() => handleTabClick(1)} id="v-pills-link1-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link1" aria-selected="true">Basic Details</a>
                    <a className={`nav-link cursor_pointer px-2 ${currentTab === 2 && 'active-secondary'}`} onClick={() => handleTabClick(2)} id="v-pills-link2-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link2" aria-selected="false">Bank Details</a>
                    <a className={`nav-link cursor_pointer px-2 ${currentTab === 3 && 'active-secondary'}`} onClick={() => handleTabClick(3)} id="v-pills-link3-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link3" aria-selected="false">Business Details</a>
                    <a className={`nav-link cursor_pointer px-2 ${currentTab === 4 && 'active-secondary'}`} onClick={() => handleTabClick(4)} id="v-pills-link4-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link4" aria-selected="false">Document Center</a>
                    <a className={`nav-link cursor_pointer px-2 ${currentTab === 5 && 'active-secondary'}`} onClick={() => handleTabClick(5)} id="v-pills-link4-tab" data-mdb-toggle="pill" href={() => false} role="tab" aria-controls="v-pills-link4" aria-selected="false">Submit KYC</a>
                </div>
                {/* Tab navs */}
            </div>
            <div className="col-8">
                {/* Tab content */}

                <div className="tab-content" id="v-pills-tabContent">
                    {currentTab === 1 && <BasicDetailsOps />}

                    {currentTab === 2 && <BankDetailsOps />}

                    {currentTab === 3 && <BusinessDetailsOps />}

                    {currentTab === 4 && <DocumentCenter />}

                    {currentTab === 5 && <SubmitKyc />}

                </div>
                {/* Tab content */}
            </div>
        </div>

    )
}

export default OperationKycModalForOnboard