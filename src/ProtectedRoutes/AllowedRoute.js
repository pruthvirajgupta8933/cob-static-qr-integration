import React, { useEffect } from 'react'
// import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess'
import { useHistory } from 'react-router-dom'
import { useSelector } from "react-redux";

const AllowedRoute = (props) => {
  const authLogin = useSelector((state) => state.auth);
  const { userAlreadyLoggedIn } = authLogin;




  // const {Component} = props;

  let history = useHistory();

  // const roleBasedShowTab = roleBasedAccess();

  useEffect(() => {
    if (userAlreadyLoggedIn) {
      history.replace('/login-page')
    }
  })

  return (
    <div>AllowedRoute</div>
  )
}

export default AllowedRoute