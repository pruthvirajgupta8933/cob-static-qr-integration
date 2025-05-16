import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { roleBasedAccess } from '../../_components/reuseable_components/roleBasedAccess';
import { getApprovedCount } from '../../services/internalDashboard.service';
import { getMyMerchantsCount } from '../../services/internalDashboard.service';
import { getAssignedMerchantData } from '../BusinessDevlopment/businessDevelopmentSlice/BusinessDevelopmentSlice';
function InternalDashboard() {
    const roles = roleBasedAccess();
    const dispatch = useDispatch()
    const [approved, setApproved] = useState(0)
    const [myMerchants, setMymerchants] = useState(0)
    const { user } = useSelector((state) => state.auth);
    const loginId = user?.loginId;
    const assignmentType = useSelector((state) => state.
        assignAccountManagerReducer?.assignmentType?.value



    );

    console.log("assignmentType ", assignmentType)

    const assigneMerchantList = useSelector(
        (state) => state.merchantAssignedReducer.assignedMerchantList
    );



    useEffect(() => {


        // approved data 
        {
            (roles.verifier
                || roles.approver) &&
                getApprovedCount()
                    .then((count) => {
                        setApproved(count);
                    })
                    .catch((error) => {
                        // Handle errors as needed
                    })
        };

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


    useEffect(() => {
        if (!roles.businessDevelopment && !roles.zonalManager) return;

        const queryParams = {
            page: 1,
            page_size: 10,
        };

        const payload = {
            assignment_type: assignmentType,
            assigned_login_id: loginId,
        };

        dispatch(getAssignedMerchantData({ queryParams, payload }));
    }, [roles.businessDevelopment, roles.zonalManager, assignmentType, loginId, dispatch]);





    return (
        <div className='row'>
            <div className="mb-5">
                <h5 className="">Internal Dashboard</h5>
            </div>


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

            {(roles.businessDevelopment || roles.zonalManager) && (
                <div className="col-lg-4">
                    <div className="card webColorBg1">
                        <div className="card-body">
                            <h5>My Merchants</h5>
                        </div>

                        <div className="card-footer d-flex justify-content-between">
                            <h6>Total Approved</h6>
                            <h6>{assigneMerchantList?.count}</h6>
                        </div>
                    </div>
                </div>
            )}

            {(roles.verifier || roles.approver) &&

                <div className="col-lg-4">
                    <div className="card webColorBg1">
                        <div className="card-body">
                            <h5>Approved Merchants</h5>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                            <h6>Total Approved</h6>
                            <div className="d-flex align-items-center justify-content-center py-2">
                                {approved ? ( // Check if Approved is available
                                    <h6>{approved}</h6> // If available, display the value
                                ) : (
                                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }




        </div>
    )
}

export default InternalDashboard