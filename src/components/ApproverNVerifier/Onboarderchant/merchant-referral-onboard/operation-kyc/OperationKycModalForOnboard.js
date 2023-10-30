import React, {useEffect, useState} from 'react'
import BankDetailsOps from './bank-kyc-form/BankDetailsOps'
import BusinessDetailsOps from './bank-kyc-form/BusinessDetailsOps'
import DocumentCenter from './bank-kyc-form/DocumentCenter'
import BasicDetailsOps from './bank-kyc-form/BasicDetailsOps'
import SubmitKyc from './bank-kyc-form/SubmitKyc'
import {useSelector} from 'react-redux'
import {Prompt} from "react-router-dom";

function OperationKycModalForOnboard() {
    const [currentTab, setCurrentTab] = useState(1)
    const {merchantReferralOnboardReducer} = useSelector(state => state)

    const {merchantOnboardingProcess, merchantBasicDetails, kyc} = merchantReferralOnboardReducer
    const handleTabClick = (currenTabVal) => {
        setCurrentTab(currenTabVal)
    };

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])
    const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''
    }


    const isOnboardStartM = merchantOnboardingProcess?.isOnboardStart;

    return (<div className="row">
            <Prompt
                // when={isPrompt()}
                message={() => 'Are you sure you want to leave this page?'}
            />
            {merchantOnboardingProcess?.isOnboardStart && <div className="d-flex bg-light justify-content-between px-0 my-2">
                <p className="p-2 m-0">Session Start : {merchantBasicDetails?.resp?.name}</p>
                <p className="p-2 m-0">Merchant Onboard Login ID : {merchantOnboardingProcess?.merchantLoginId}</p>
            </div>}
            <div className="col-2 bg-light p-1">
                {/* Tab navs */}
                <div className="nav flex-column nav-pills text-start " id="v-pills-tab" role="tablist"
                     aria-orientation="vertical">
                <a className={`nav-link cursor_pointer px-2 ${currentTab === 1 && 'active-secondary'}  `}
                       onClick={() => handleTabClick(1)} id="v-pills-link1-tab" data-mdb-toggle="pill"
                       href={() => false}   role="tab" aria-controls="v-pills-link1" aria-selected="true">Basic
                        Details</a>
                    <a className={`nav-link cursor_pointer px-2 ${currentTab === 2 && 'active-secondary'} ${!isOnboardStartM && 'disabled'}`}
                       onClick={() => handleTabClick(2)} id="v-pills-link2-tab" data-mdb-toggle="pill"
                       href={() => false} role="tab" aria-controls="v-pills-link2" aria-selected="false">Bank
                        Details</a>
                    <a className={`nav-link cursor_pointer px-2 ${currentTab === 3 && 'active-secondary'} ${!isOnboardStartM && 'disabled'}`}
                       onClick={() => handleTabClick(3)} id="v-pills-link3-tab" data-mdb-toggle="pill"
                       href={() => false} role="tab" aria-controls="v-pills-link3" aria-selected="false">Business
                        Details</a>
                    <a className={`nav-link cursor_pointer px-2 ${currentTab === 4 && 'active-secondary'} ${!isOnboardStartM && 'disabled'}`}
                       onClick={() => handleTabClick(4)} id="v-pills-link4-tab" data-mdb-toggle="pill"
                       href={() => false} role="tab" aria-controls="v-pills-link4" aria-selected="false">Document
                        Center</a>
                    <a className={`nav-link cursor_pointer px-2 ${currentTab === 5 && 'active-secondary'} ${!isOnboardStartM && 'disabled'}`}
                       onClick={() => handleTabClick(5)} id="v-pills-link4-tab" data-mdb-toggle="pill"
                       href={() => false} role="tab" aria-controls="v-pills-link4" aria-selected="false">Submit KYC</a>
                </div>
                {/* Tab navs */}
            </div>
            <div className="col-8">
                {/* Tab content */}

                <div className="tab-content" id="v-pills-tabContent">
                    {currentTab === 1 && <BasicDetailsOps  setCurrentTab={setCurrentTab}/>}
                    {currentTab === 2 && <BankDetailsOps setCurrentTab={setCurrentTab}/>}
                    {currentTab === 3 && <BusinessDetailsOps setCurrentTab={setCurrentTab}/>}
                    {currentTab === 4 && <DocumentCenter setCurrentTab={setCurrentTab}/>}
                    {currentTab === 5 && <SubmitKyc setCurrentTab={setCurrentTab}/>}
                </div>
                {/* Tab content */}
            </div>
        </div>

    )
}

export default OperationKycModalForOnboard