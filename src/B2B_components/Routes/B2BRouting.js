import React, {useEffect} from 'react'
import { Route } from 'react-router-dom';
import { roleBasedAccess } from '../../_components/reuseable_components/roleBasedAccess';
import { useHistory } from 'react-router-dom';


const B2BRouting = (props) => {

    const {Component} = props;

    let history = useHistory();

    const roleBasedShowTab = roleBasedAccess();

  useEffect(() => {
    if(roleBasedShowTab?.b2b === false) {
        history.push('/login-page')
    }
  })


  return (
    <>
    {roleBasedShowTab.b2b === true  ? <Route><Component /></Route> : <></>}
    </>
  )
}

export default B2BRouting