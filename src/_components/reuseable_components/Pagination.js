import React, { useEffect, useState } from 'react'
import _, { map } from 'lodash';

function Pagination(props) {
    // console.log(props);
    const {data,tableHeader,tableBody} = props.paginationProps;
    const [pageSize, setPageSize] = useState(10);
    const [paginatedata, setPaginatedData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
  
    
  const pageCount = data ? Math.ceil(data.length/pageSize) : 0;
  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  
    const startIndex = (pageNo - 1) * pageSize;
    const paginatedPost = _(data).slice(startIndex).take(pageSize).value();
    setPaginatedData(paginatedPost);
  
  }

//   const getData = async (e) => { 
//     await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getReports/${clientCode}`)  
//   .then(res => {     
//     setData(res.data);  
//     setPaginatedData(_(res.data).slice(0).take(pageSize).value())
//     console.log(res.data)

//   })  
//   .catch(err => {  
//     console.log(err)
//   });
  
// }

  useEffect(()=>{
    setPaginatedData(_(data).slice(0).take(pageSize).value())
  },[pageSize]);

  // if ( pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1)
  var tableContent = (   <table className='table' style={{marginLeft: 10}}>
  {/* table head */}
<tr>
  {tableHeader.map((thd,i)=><th key={i}>{thd}</th>)}
</tr>

{/* table body */}
  { paginatedata.map((report, i) => (
      <tr>
          {tableBody.map((allowedData,i)=>
                ( Object.keys(report).includes(allowedData) ? <td>{Object.values(report)[i]}</td> : '' )
          
          )}

          {/* <td>{i+1}</td>
          <td>{report.customer_name}</td>
          <td>{report.customer_email}</td>
          <td>{report.customer_phone_number}</td>
          <td>{report.type}</td>
          <td>{report.transaction_status}</td>
          <td>{report.client_transaction_id}</td>
          <td>{report.link_id}</td>
          <td>{report.link_valid_date}</td>
          <td>{report.created_at}</td>
          <td>{report.payment_collected}</td>
          <td>{report.numeric_link_id}</td> */}
      </tr>
  ))}
</table>);


  return (
    <div>Pagination
     {tableContent}
    </div>
  )
}

export default Pagination