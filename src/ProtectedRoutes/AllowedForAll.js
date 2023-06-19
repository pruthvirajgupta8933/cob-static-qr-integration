import React,{useEffect}from 'react';
import { Route } from 'react-router-dom';
// import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess';
import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess';
import { useHistory } from 'react-router-dom'

const AllowedForAll = (props) => {
    console.log(props,"this is props")
  const { Component } = props;
  let history = useHistory();
  const roleBasedShowTab = roleBasedAccess();
  console.log(roleBasedShowTab,"roleBasedShowTab for allowedmerchant")
  
  useEffect(() => {
    
    if(roleBasedShowTab?.merchant === false) {
        history.push('/login-page')
    }
  })

  

  return (
   <Route><Component /></Route> 
   
  );
};

export default AllowedForAll;