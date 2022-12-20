import React ,{useEffect} from 'react'
import { Route} from "react-router-dom";
import { useHistory } from "react-router-dom";
import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess';

const BankRoute = (props) => {

    const {Component} = props;

    let history = useHistory();

  const roleBasedShowTab = roleBasedAccess();

  useEffect(() => {
    if(roleBasedShowTab?.bank === false) {
        history.push('/login-page')
    }
  })
  return (
    <>
      {roleBasedShowTab.bank === true ? <Route><Component /></Route> : <></>}
    </>
  )
}

export default BankRoute