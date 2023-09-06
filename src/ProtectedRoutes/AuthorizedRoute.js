import React, { useEffect } from "react";
import { roleBasedAccess } from "../_components/reuseable_components/roleBasedAccess";
import { Route, useHistory } from "react-router-dom";
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
            history.push('/login-page')
        }
    })

    // console.log("isValid", isValid);

    return (
        <>
            {isValid === true ? <Route><Component /></Route> : <></>}
        </>
    );
};

export default AuthorizedRoute;
