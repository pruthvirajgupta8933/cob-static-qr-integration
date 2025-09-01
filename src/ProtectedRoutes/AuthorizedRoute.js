import React, { useEffect } from "react";
import { roleBasedAccess } from "../_components/reuseable_components/roleBasedAccess";
import { Route, useHistory } from "react-router-dom";
import { clearLocalStore } from "../utilities/clearLocalStorage";
// import CustomModal from "../_components/custom_modal";
// import { useHistory } from "react-router-dom";


const AuthorizedRoute = (props) => {
    console.log("AuthorizedRoute props:", props)
    const { Component } = props;

    let history = useHistory();

    const roleBasedShowTab = roleBasedAccess();
    console.log("roleBasedShowTab:", roleBasedShowTab)



    const arr = roleBasedShowTab;
    const brr = props?.roleList;
    console.log("arr (roleBasedShowTab):", arr)
    console.log("brr (props.roleList):", brr)
    const isAuth = (arr1, brr1) => {
        // If no roleList is provided, allow access based on any role being true
        if (!brr1 || Object.keys(brr1).length === 0) {
            // Check if user has any valid role
            return arr1.merchant || arr1.approver || arr1.verifier || 
                   arr1.bank || arr1.referral || arr1.viewer || 
                   arr1.b2b || arr1.accountManager || arr1.businessDevelopment || 
                   arr1.zonalManager;
        }
        
        // If roleList is provided, check specific roles
        for (const key in brr1) {
            if (brr1.hasOwnProperty(key)) {
                if (key in arr1 && arr1[key] === true && brr1[key] === true) {
                    return true;
                }
            }
        }
        return false;
    };

    const isValid = isAuth(arr, brr);
    console.log("isValid result:", isValid)

    useEffect(() => {
        if (isValid === false) {
            setTimeout(() => {
                clearLocalStore()
                history.replace("/login");
            }, 2000);
        }
    }, [isValid, history])

    // console.log("isValid", isValid);

    return (
        <>
            {isValid === true ? <Route><Component /></Route> :
                <div className="card p-3">
                    <h5>It seems your session has expired. Please log in again.
                        You will be redirected to the login page.
                    </h5>
                </div>}
        </>
    );
};

export default AuthorizedRoute;
