import React, { useEffect } from 'react'
import { Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess';


const VerifierRoute = (props) => {

  const { Component } = props;

  let history = useHistory();

  const roleBasedShowTab = roleBasedAccess();

  useEffect(() => {
    if (roleBasedShowTab?.verifier === false) {
      history.replace('/login-page')
    }
  })

  return (
    <>
      {roleBasedShowTab.verifier === true ? <Route><Component /></Route> : <></>}
    </>
  )
}

export default VerifierRoute