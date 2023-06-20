import React , { useEffect }from 'react'
import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess'
import { useHistory } from 'react-router-dom'
import {useSelector } from "react-redux";

const AllowedRoute = (props) => {

  const authLogin = useSelector((state) => state.auth);
  console.log(authLogin,"This is authLogin")
  const { userAlreadyLoggedIn } = authLogin ;
  console.log(userAlreadyLoggedIn,"this is userAlreadyLoggedIn")



    const {Component} = props;

    let history = useHistory();

  const roleBasedShowTab = roleBasedAccess();

  useEffect(() => {
    if(userAlreadyLoggedIn) {
        history.push('/login-page')
    }
  })

  return (
    <div>AllowedRoute</div>
  )
}

export default AllowedRoute