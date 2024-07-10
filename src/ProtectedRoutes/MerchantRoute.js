import React, { useEffect } from "react";
import { roleBasedAccess } from "../_components/reuseable_components/roleBasedAccess";
import { Route } from "react-router-dom";
import { useHistory } from "react-router-dom";


const MerchantRoute = (props) => {

  const { Component } = props;

  let history = useHistory();

  const roleBasedShowTab = roleBasedAccess();

  useEffect(() => {
    if (roleBasedShowTab?.merchant === false) {
      history.replace('/login-page')
    }
  })

  return (
    <>
      {roleBasedShowTab.merchant === true ? <Route><Component /></Route> : <></>}
    </>
  );
};

export default MerchantRoute;
