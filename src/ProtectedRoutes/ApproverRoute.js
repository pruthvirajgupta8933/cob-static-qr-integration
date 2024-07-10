import React, { useEffect } from 'react'
import { Route, useHistory } from "react-router-dom";
import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess';


const ApproverRoute = (props) => {
  const { Component } = props;

  let history = useHistory();

  const roleBasedShowTab = roleBasedAccess();

  useEffect(() => {
    if (roleBasedShowTab?.approver === false) {
      history.replace('/login-page')
    }
  })

  return (
    <>
      {roleBasedShowTab.approver === true ? <Route><Component /></Route> : <></>}
    </>
  )
}

export default ApproverRoute