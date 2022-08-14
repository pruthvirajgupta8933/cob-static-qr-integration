import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import {kycForPending} from "../../slices/kycSlice"
import DropDownCountPerPage from '../../_components/reuseable_components/DropDownCountPerPage';




function NewRegistraion() {
const [data, setData] = useState([]);
const [searchText, setSearchText] = useState("");
const [pageSize, setPageSize] = useState(10);
  const dispatch=useDispatch();


   //---------------GET Api for KycPending-------------------
  
  useEffect(() => {
    dispatch(kycForPending()).then((resp) => {
     const data = resp.payload.results
   
      setData(data);
 })
     
       .catch((err) => console.log(err));
   }, []);

///////////Kyc Search filter
   useEffect(() => {
    if (searchText.length > 0) {
        setData(data.filter((item) => 
        
        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    } else {
      dispatch(kycForPending()).then((resp) => {
        const data = resp.payload.results
      
         setData(data);
    })
       
    }
}, [searchText])


   const kycSearch = (e) => {
    setSearchText(e.target.value);
};
useEffect(()=>{
  setData(_(data).slice(0).take(pageSize).value())
  // setPageCount(displayList.length>0 ? Math.ceil(displayList.length/pageSize) : 0)
},[pageSize]);


  

  return (

    <div className="row">  
    <div className="col-lg-4 mrg-btm- bgcolor">
    <label>Search</label>
        <input className='form-control' onChange={ kycSearch} type="text" placeholder="Search Here" />
    </div>
  
    <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Count Per Page</label>
        <select value={pageSize} rel={pageSize} onChange={(e) =>setPageSize(parseInt(e.target.value))}  className="ant-input" >
        <DropDownCountPerPage datalength={data.length} />
        </select>
  </div>
    
    
    <div className="col-md-12 col-md-offset-4">   
   
   <table className="table table-bordered">
                    <thead>
                    <tr>
                     
                      <th>Merchant Id</th>
                      <th>Contact Number</th>
                      <th>Name</th>
                      <th> Email</th>
                      <th>Bank</th>
                      <th>Adhar Number</th>
                      <th>Pan card</th>
                      <th>State</th>
                      <th>Pin code</th>
                      <th>Status</th>
                    </tr>
                    </thead>
                        <tbody>
                        {data.map((user,i) => (
                          <tr key={i}>
                          
                            <td>{user.merchantId}</td>
                            <td>{user.contactNumber}</td>
                            <td>{user.name}</td>
                            <td>{user.emailId}</td>
                            <td>{user.bankName}</td>
                            <td>{user.aadharNumber}</td>
                            <td>{user.panCard}</td>
                            <td>{user.stateId}</td>
                            <td>{user.pinCode}</td>
                            <td>{user.status}</td>
                          </tr>
                        ))}
                    </tbody>
                </table>
   
  </div>
  </div>
  )
}

export default NewRegistraion
