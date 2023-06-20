import React,{useEffect}from 'react';
import { Route } from 'react-router-dom';
// import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess';
import { roleBasedAccess } from '../_components/reuseable_components/roleBasedAccess';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux';

const AllowedForAll = (props) => {
  
  const { user } = useSelector((state) => state.auth);
const { Component } = props;
  let history = useHistory();
  
 
  
  useEffect(() => {
    
    if( user.isLoggedIn) {
        history.push('/login-page')
    }
  })

  

  return (
   <Route><Component /></Route> 
   
  );
};

export default AllowedForAll;