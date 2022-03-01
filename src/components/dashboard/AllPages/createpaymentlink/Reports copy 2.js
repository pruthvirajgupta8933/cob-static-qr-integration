import React, { useEffect, useState } from 'react'
import axios from 'axios' ;
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { Zoom } from 'react-toastify';
import Pagination from '../../../../_components/reuseable_components/Pagination';

const Reports = () => {


  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
 

  // Parameters for Reports
  // const initialState = {

  //   client_transaction_id: null,
  //   created_at: null,
  //   customer_email: "",
  //   customer_name: "",
  //   customer_phone_number: "",
  //   link_id: "",
  //   link_valid_date: "",
  //   numeric_link_id: "",
  //   payment_collected: null,
  //   pg_response: null,
  //   pg_transaction_id: null,
  //   transaction_status: null,
  //   type: "",
  // }

  const [data , setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([])
  const {user} = useSelector((state)=>state.auth);
  var clientSuperMasterList = user.clientSuperMasterList;
  const {clientCode} = clientSuperMasterList[0];


  const pageCount = data ? Math.ceil(data.length/pageSize) : 0;


  
const pagination = (pageNo) => {
  setCurrentPage(pageNo);

  const startIndex = (pageNo - 1) * pageSize;
  const paginatedPost = _(data).slice(startIndex).take(pageSize).value();
  setPaginatedData(paginatedPost);

}


  
  const getData = async (e) => { 
    await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getReports/${clientCode}`)  
  .then(res => {     
    setData(res.data);  
    setPaginatedData(_(res.data).slice(0).take(pageSize).value())
    // console.log(res.data)

  })  
  .catch(err => {  
    console.log(err)
  });
  
}

useEffect(() => {
  const loading = getData();
  toast.promise(
    loading,
    {
      pending: "In Process",
      success: "Data Loaded Successfully",
      error: "Error Occured in Data",
    },
    {
      position: "bottom-center",
      autoClose: 1000,
      limit: 2,
      transition: Zoom,
    }
  );
}, []);



const getSearchTerm  = (e) => {
  setSearchText(e.target.value);

  // if(searchText !== "") {
  //   const newData = data.filter((dataitem) => {
  //     return dataitem.customer_phone_number.toLowerCase().includes(searchText.toLowerCase());
  //   })

  //   setSearchResults(newData);
  // }
  // else {
  //   setSearchResults(data)
  // }

  // console.log(data)
}

useEffect(()=>{
  setPaginatedData(_(data).slice(0).take(pageSize).value())
},[pageSize]);


// if ( pageCount === 1) return null;

const pages = _.range(1, pageCount + 1)


const tableHeader = ["Name","Email","Mobile No.","Action","Status","Client Txn Id","Link Id","Link Valid Date","Created At","Payment Collected","Numeric Link Id"];

const tableBody = ["customer_name","customer_email","customer_phone_number","type","transaction_status","client_transaction_id","link_id","link_valid_date","created_at","payment_collected","numeric_link_id"];

const paginationProps = {data:data,tableHeader:tableHeader,tableBody:tableBody};



  return (

    <Pagination paginationProps={paginationProps} />
  )

};

export default Reports;
