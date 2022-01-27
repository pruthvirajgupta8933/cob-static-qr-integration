import React from 'react'
import { useSelector } from 'react-redux';
import { useRouteMatch, Redirect} from 'react-router-dom'

export function RedirectToProfile() {
    let { path } = useRouteMatch();
    const {  user } = useSelector((state) => state.auth);
    if(user && user.clientMerchantDetailsList===null){
        return <Redirect to={`${path}/profile`} />
    } 
  
}
