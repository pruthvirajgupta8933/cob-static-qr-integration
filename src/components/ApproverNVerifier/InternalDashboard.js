import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { roleBasedAccess } from '../../_components/reuseable_components/roleBasedAccess';
import { getApprovedCount } from '../../services/internalDashboard.service';
import { getMyMerchantsCount } from '../../services/internalDashboard.service';


function InternalDashboard() {
    const roles = roleBasedAccess();

    const [approved, setApproved] = useState(0)
    const [myMerchants, setMymerchants] = useState(0)
    const { user } = useSelector((state) => state.auth);
    const loginId = user?.loginId;


    useEffect(() => {
        const todayDate = new Date()
        const from_date = moment(todayDate).startOf('day').format('YYYY-MM-DD')
        const to_date = moment(todayDate).startOf('day').format('YYYY-MM-DD')



        // signup data
        //     {roles.approver &&
        //     axiosInstanceJWT.post(`${API_URL.GET_SIGNUP_DATA_INFO}?page=1&page_size=10`, postDataSignUp).then(resp => {
        //         setNewSignUp(resp?.data?.count)
        //     })
        // }

        // // verified data
        // axiosInstanceJWT.get(`${API_URL.KYC_FOR_ONBOARDED}?search=Verified&order_by=-verified_date&search_map=verified_date&page=1&page_size=10&from_date=${from_date}&to_date=${to_date}`).then(resp => {
        //     setVerified(resp?.data?.count)
        // })

        // approved data 
        roles.approver &&
            getApprovedCount(from_date, to_date)
                .then((count) => {
                    setApproved(count);
                })
                .catch((error) => {
                    // Handle errors as needed
                });

        // My Merchant List
        (roles.viewer || roles?.accountManager) &&
            getMyMerchantsCount(loginId)
                .then((count) => {
                    setMymerchants(count);
                })
                .catch((error) => {
                    // Handle errors as needed
                })
    }, [])

    return (
        <div className='row'>
            <div className="mb-5">
                <h5 className="">Internal Dashboard</h5>
            </div>

            {/* {roles.verifier || roles.approver===true &&
            <div className="col-lg-4">
                <div className="card webColorBg1">
                    <div className="card-body">
                        <h5>New Sign-up </h5>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                        <h6>Today</h6>
                        <h6>{newSignUp}</h6>
                    </div>
                </div>
            </div>
} */}

            {/* <div className="col-lg-4">
                <div className="card webColorBg1">
                    <div className="card-body">
                        <h5>Verified Merchant's</h5>
                    </div>

                    <div className="card-footer d-flex justify-content-between">
                        <h6>Today</h6>
                        <h6>{verified}</h6>
                    </div>
                </div>
            </div> */}
            {(roles.viewer || roles?.accountManager) && (
                <div className="col-lg-4">
                    <div className="card webColorBg1">
                        <div className="card-body">
                            <h5>My Merchants</h5>
                        </div>

                        <div className="card-footer d-flex justify-content-between">
                            <h6>Total Approved</h6>
                            <h6>{myMerchants}</h6>
                        </div>
                    </div>
                </div>
            )}

            {roles.verifier || roles.approver === true &&

                <div className="col-lg-4">
                    <div className="card webColorBg1">
                        <div className="card-body">
                            <h5>Approved Merchants</h5>
                        </div>

                        <div className="card-footer d-flex justify-content-between">
                            <h6>Total</h6>
                            <h6>{approved}</h6>
                        </div>
                    </div>
                </div>
            }




        </div>
    )
}

export default InternalDashboard