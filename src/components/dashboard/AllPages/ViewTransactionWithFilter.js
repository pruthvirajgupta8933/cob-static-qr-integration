import React from 'react'
import { useHistory} from 'react-router-dom'
import { useSelector } from 'react-redux';
import TransactionEnqMultiParam from './TransactionEnqMultiParam'


function ViewTransactionWithFilter() {
    let history = useHistory();
    const {auth} = useSelector((state)=>state);
    var {user} = auth
    
  if(user && user?.clientMerchantDetailsList===null && user?.roleId!==3 && user?.roleId!==13){
    history.push('/dashboard/profile');
  }


  return (
    <TransactionEnqMultiParam />
  )
}

export default ViewTransactionWithFilter