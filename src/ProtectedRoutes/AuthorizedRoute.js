import React, { useEffect } from "react";
import { roleBasedAccess } from "../_components/reuseable_components/roleBasedAccess";
import { Route, useHistory } from "react-router-dom";
import { clearLocalStore } from "../utilities/clearLocalStorage";
// import CustomModal from "../_components/custom_modal";
// import { useHistory } from "react-router-dom";


const AuthorizedRoute = (props) => {
    // console.log("props",props)
    const { Component } = props;

    let history = useHistory();

    const roleBasedShowTab = roleBasedAccess();
    // console.log("roleBasedShowTab", roleBasedShowTab)



    const arr = roleBasedShowTab;
    const brr = props?.roleList;
    // console.log(arr,brr)
    const isAuth = (arr1, brr1) => {
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

    useEffect(() => {
        if (isValid === false) {
            setTimeout(() => {
                clearLocalStore()
                history.replace("/login");
            }, 2000);
        }
    })

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
