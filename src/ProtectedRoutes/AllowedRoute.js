import React , { useEffect }from 'react'
import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess'
import { useHistory } from 'react-router-dom'

const AllowedRoute = (props) => {

    const {Component} = props;

    let history = useHistory();

  const roleBasedShowTab = roleBasedAccess();

  useEffect(() => {
    if(roleBasedShowTab.bank || roleBasedShowTab.merchant === false) {
        history.push('/login-page')
    }
  })

  return (
    <div>AllowedRoute</div>
  )
}

export default AllowedRoute