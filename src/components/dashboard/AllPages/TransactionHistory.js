import React,{useEffect, useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useRouteMatch, Redirect,useHistory} from 'react-router-dom'
import getPaymentStatusList from '../../../services/home.service'

import axios from "axios"
import _ from 'lodash';
import { fetchTransactionHistorySlice } from '../../../slices/dashboardSlice';
import { exportToSpreadsheet } from '../../../utilities/exportToSpreadsheet';



function TransactionHistory() {
  const dispatch = useDispatch();
  const {path} = useRouteMatch();
  
  let history = useHistory();
  const {auth,dashboard} = useSelector((state)=>state);
  var {user} = auth

  const {isLoadingTxnHistory} = dashboard

  const [paymentStatusList,SetPaymentStatusList] = useState([]);
  const [paymentModeList,SetPaymentModeList] = useState([]);
  const [clientCode,SetClientCode] = useState("");
  const [fromDate,SetFromDate] = useState("");
  const [toDate,SetToDate] = useState("");
  const [txnStatus,SetTxnStatus] = useState("All");
  const [payModeId,SetPayModeId] = useState("All")
  const [txnList,SetTxnList] = useState([])
  const [filterList,SetFilterList] = useState([])
  const [searchText,SetSearchText] = useState('')
  const [show, setShow] = useState('')
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [showData,setShowData] = useState([])
  const [pageCount,setPageCount] = useState(0);
  const [buttonClicked,isButtonClicked] = useState(false);


  function dayDiff(dateFrom, dateTo) {
    var from = new Date(dateFrom);
    var to = new Date(dateTo);
    var diffInMs   =to - from
    return Math.abs(diffInMs / (1000 * 60 * 60 * 24));
   }
   

  const getInputValue=(label,val)=>{
      if(label==='fromDate'){
        SetFromDate(val);
        // console.log(val);
      }else if(label==='toDate'){
        SetToDate(val);
      }else if(label==='clientCode'){
        SetClientCode(val);
      }else if(label==='txnStatus'){
        SetTxnStatus(val);
      }else if(label==='payMode'){
        SetPayModeId(val);
      }
  }

  const getPaymentStatusList = async () => {  
    await axios.get('https://adminapi.sabpaisa.in/REST/admin/getPaymentStatusList')  
    .then(res => {  
      // console.log(res)  
      SetPaymentStatusList(res.data);
    })  
    .catch(err => {  
      console.log(err)  
    });  
  }  

  const paymodeList = async () => {  
    await axios.get('https://adminapi.sabpaisa.in/REST/paymode/paymodeList')  
    .then(res => {  
      // console.log(res)
      SetPaymentModeList(res.data);  
    })  
    .catch(err => {  
      console.log(err)  
    });  
  }  


  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  }


const checkValidation = ()=>{
    var flag = true
    if(fromDate==='' || toDate===''){
        alert("Please select the date.");
        flag = false;
    }else if(fromDate!=='' || toDate!==''){
      //check date range
      var days =  dayDiff(fromDate,toDate);

      if(days < 0 || days >= 90 ){
        // alert(days)
        flag = false;
        alert("The date range should be under 3 months");
      }
      
    }else{
      flag = true;
    }

    return flag;
}


  const txnHistory =  () => {  
    var isValid = checkValidation();
          if(isValid){ 
            // isLoading(true);
            isButtonClicked(true);
            var paramData = {
              clientCode:clientCode,
              txnStatus:txnStatus,
              payModeId:payModeId,
              fromDate:fromDate,
              toDate:toDate,
              ref1:0,
              ref2:0
            }
            clientCode==='0'? 
              clientMerchantDetailsList?.map((item) => {
                paramData.clientCode = item.clientCode;
                // console.log(paramData.clientCode);
                dispatch(fetchTransactionHistorySlice(paramData))
              })
              :
              dispatch(fetchTransactionHistorySlice(paramData))


            // console.log(paramData);
            
            
      }else{
        // isLoading(false);
        console.log('API not trigger!');
      }
  } 
  
  useEffect(() => {
     setShowData(dashboard.transactionHistory);
     SetTxnList(dashboard.transactionHistory);
     setPaginatedData(_(dashboard.transactionHistory).slice(0).take(pageSize).value())
     if(dashboard.transactionHistory.length){
       isButtonClicked(false);
     }

  }, [dashboard])
  
  // console.log("buttonclicked",buttonClicked);
  
  useEffect(()=>{
     setPaginatedData(_(showData).slice(0).take(pageSize).value())
     setPageCount(showData.length>0 ? Math.ceil(showData.length/pageSize) : 0)

 },[pageSize,showData]);

 useEffect(() => {
  //  console.log("page chagne no")
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPost = _(showData).slice(startIndex).take(pageSize).value();
   setPaginatedData(paginatedPost);
 
 }, [currentPage])

 
  
 useEffect(() => {     
  getPaymentStatusList();
  paymodeList();  
  // txnList.length >0 ? setShow(true) : setShow(false)
}, [])

useEffect(() => {
  // console.log("length",txnList.length);
  txnList.length > 0 ? setShow(true) : setShow(false)
//  console.log("show",show)

}, [txnList])



useEffect(() => {
  if(searchText !== ''){
    setShowData( dashboard.transactionHistory.filter((txnItme)=>
        Object.values(txnItme).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    }
    else{
      setShowData(dashboard.transactionHistory)
    }
  //  txnList.length >0 ? setShow(true) : setShow(false)
  
}, [searchText])


//  if ( pageCount === 1) return null;

const pages = _.range(1, pageCount + 1)
// console.log("pages",pages)
 


  var clientMerchantDetailsList =[];
  if(user && user.clientMerchantDetailsList===null && user.roleId!==3 && user.roleId!==13){
    history.push('/dashboard/profile');
  }else{
    clientMerchantDetailsList = user.clientMerchantDetailsList;
  }
  
  
  const exportToExcelFn=()=>{
    // const dataWithoutNull = JSON.stringify(txnList).replaceAll('null',"NA");
    // console.log(JSON.parse(dataWithoutNull));
    
    const excelHeaderRow =
  ["S.No",	"Trans ID",	"Client Trans ID",	"Challan Number / VAN",	"Amount",	"Trans Initiation Date",	"Trans Complete Date",	"Payment Status	", "Payee First Name", 	"Payee Last Name",	"Payee Mob number",	"Payee Email",	"Client Code",	"Payment Mode",	"Payee Address",	"Udf1",	"Udf2",	"Udf3",	"Udf4",	"Udf5",	"Udf6",	"Udf7",	"Udf8",	"Udf9",	"Udf10" , "Udf11",	"Udf20",	"Gr.No",	"Bank Message",	"IFSC Code",	"Payer Account No",	"Bank Txn Id"];
    let excelArr = [excelHeaderRow];
    txnList.map((item,index)=>{
      // console.log(JSON.stringify(item));
    
      const allowDataToShow ={
        srNo:item.srNo === null? "" : item.srNo ,
        txn_id:item.txn_id  === null? "" : item.txn_id ,
        client_txn_id:item.client_txn_id  === null? "" : item.client_txn_id ,
        challan_no:item.challan_no  === null? "" : item.challan_no ,
        payee_amount:item.payee_amount  === null? "" : item.payee_amount ,
        trans_date:item.trans_date  === null? "" : item.trans_date ,
        trans_complete_date:item.trans_complete_date  === null? "" : item.trans_complete_date ,
        status:item.status === null? "" : item.status ,
        payee_first_name:item.payee_first_name === null? "" : item.payee_first_name ,
        payee_lst_name:item.payee_lst_name === null? "" : item.payee_lst_name ,
        payee_mob:item.payee_mob === null? "" : item.payee_mob ,
        payee_email:item.payee_email === null? "" : item.payee_email ,
        client_code:item.client_code === null? "" : item.client_code ,
        payment_mode:item.payment_mode === null? "" : item.payment_mode ,
        payee_address:item.payee_address === null? "" : item.payee_address ,
        udf1:item.udf1 === null? "" : item.udf1 ,
        udf2:item.udf2 === null? "" : item.udf2 ,
        udf3:item.udf3 === null? "" : item.udf3 ,
        udf4:item.udf4 === null? "" : item.udf4 ,
        udf5:item.udf5 === null? "" : item.udf5 ,
        udf6:item.udf6 === null? "" : item.udf6 ,
        udf7:item.udf7 === null? "" : item.udf7 ,
        udf8:item.udf8 === null? "" : item.udf8 ,
        udf9:item.udf9 === null? "" : item.udf9 ,
        udf10:item.udf10 === null? "" : item.udf10 ,
        udf11:item.udf11 === null? "" : item.udf11 ,
        udf20:item.udf20 === null? "" : item.udf20 ,
        gr_number:item.gr_number === null? "" : item.gr_number ,
        bank_message:item.bank_message === null? "" : item.bank_message ,
        ifsc_code:item.ifsc_code === null? "" : item.ifsc_code ,
        payer_acount_number:item.payer_acount_number === null? "" : item.payer_acount_number ,
        bank_txn_id:item.bank_txn_id === null? "" : item.bank_txn_id 
        };
        
        // var tempStr = JSON.stringify(allowDataToShow).replaceAll('null','"NA"');
        // var data = JSON.parse(tempStr);
      
        // console.log("tempStr",tempStr);
    excelArr.push(Object.values(allowDataToShow));
  })
  // console.log("excelArr",excelArr)
  const fileName = "Transactions Report"; 
  exportToSpreadsheet(excelArr, fileName);

  }
  
  const today = new Date()
  const lastThreeMonth = new Date(today)
  lastThreeMonth.setDate(lastThreeMonth.getDate() - 90)
  lastThreeMonth.toLocaleDateString('en-ca')
  var month = lastThreeMonth.getUTCMonth() + 1; //months from 1-12
  var day = lastThreeMonth.getUTCDate();
  var year = lastThreeMonth.getUTCFullYear();
  
  const finalDate = year +'-'+month+'-'+day;
  return (
    <section className="ant-layout">
      <div className="profileBarStatus">
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Transactions History</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a" id="features08-3-">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-4 mrg-btm- bgcolor">
                  <label>Client Name</label>
                  <select
                    className="ant-input"
                    onChange={(e) => {
                      getInputValue("clientCode", e.target.value);
                    }}
                  
                    
                  >
                    {user.roleId===3 || user.roleId===13 ?
                    <option value="0">All</option>
                      :
                    <option value="">Select</option> }
                    {clientMerchantDetailsList?.map((item) => {
                      return (
                        <option value={item.clientCode}>
                          {item.clientCode + " - " + item.clientName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-lg-4 mrg-btm- bgcolor">
                  <label>From Date</label>
                  <input
                  rel={finalDate}
                    type="date"
                    min= {finalDate}
                    className="ant-input"
                    placeholder="From Date"
                    onChange={(e) => {
                      getInputValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-4 mrg-btm- bgcolor">
                  <label>To Date</label>
                  <input
                    type="date"
                    min= {finalDate}
                    max= {new Date().toLocaleDateString('en-ca')}
                    className="ant-input"
                    placeholder="To Date"
                    onChange={(e) => {
                      getInputValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-4 mrg-btm- bgcolor">
                  <label>Transactions Status</label>
                  <select
                    className="ant-input"
                    onChange={(e) => {
                      getInputValue("txnStatus", e.target.value);
                    }}
                  >
                    <option value="All">All</option>
                    {paymentStatusList.map((item, i) => {
                      return <option value={item}>{item} </option>;
                    })}
                  </select>
                </div>
                <div className="col-lg-4 mrg-btm- bgcolor">
                  <label>Payment Mode</label>
                  <select
                    className="ant-input"
                    onChange={(e) => {
                      getInputValue("payMode", e.target.value);
                    }}
                  >
                    <option value="All">All</option>
                    {paymentModeList.map((item) => {
                      return (
                        <option value={item.paymodeId}>
                          {item.paymodeName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-lg-4 mrg-btm- bgcolor">
                  <button
                    className="view_history topmarg"
                    onClick={() => txnHistory()}
                  >
                    Search
                  </button>
                      {  show ? 
                        <button className="view_history topmarg" onClick={()=>exportToExcelFn()}>Export </button>
                    :  '' }
                  </div>
                  {  show ? 
                  <React.Fragment>
                  <div className="col-lg-6 mrg-btm- bgcolor">
                    <label>Search Transaction ID</label>
                    <input type="text" className="ant-input" placeholder="Search here" onChange={(e)=>{SetSearchText(e.target.value)}} />
                  </div>
                  <div className="col-lg-4 mrg-btm- bgcolor">
                  <label>Count per page</label>
                  <select value={pageSize} rel={pageSize} className="ant-input" onChange={(e) =>setPageSize(parseInt(e.target.value))} >
                  <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                  </select>
                </div>                 
                  </React.Fragment> : <></> }

                  <div style={{overflow:"auto"}} > 
                  <table cellspaccing={0} cellPadding={10} border={0} width="100%" className="tables" >
                    <tbody>
                    {txnList.length>0 ?
                      <tr>
                            <th> S.No </th>
                            <th> Trans ID </th>
                            <th> Client Trans ID </th>
                            <th> Challan Number / VAN </th>
                            <th> Amount </th>
                            <th> Trans Initiation Date </th>
                            <th> Trans Complete Date </th>
                            <th> Payment Status </th>
                            <th> Payee First Name </th>
                            <th> Payee Last Name </th>
                            <th> Payee Mob number </th>
                            <th> Payee Email </th>
                            <th> Client Code </th>
                            <th> Payment Mode </th>
                            <th> Payee Address </th>
                            <th> Udf1 </th>
                            <th> Udf2 </th>
                            <th> Udf3 </th>
                            <th> Udf4 </th>
                            <th> Udf5 </th>
                            <th> Udf6 </th>
                            <th> Udf7 </th>
                            <th> Udf8 </th>
                            <th> Udf9 </th>
                            <th> Udf10 </th>
                            <th> Udf11 </th>
                            <th> Udf20 </th>
                            <th> Gr.No </th>
                            <th> Bank Message </th>
                            <th> IFSC Code </th>
                            <th> Payer Account No </th>
                            <th> Bank Txn Id </th>
                          </tr>:
                          <></>
                     }
                   
                          {/* {console.log("filterList",filterList)} */}
                          {txnList.length>0 && paginatedata.map((item,i)=>{return(
                            <tr>
                            <td>{item.srNo}</td>
                            <td>{item.txn_id}</td>
                            <td>{item.client_txn_id}</td>
                            <td>{item.challan_no}</td>
                            <td>{item.payee_amount}</td>
                            <td>{item.trans_date}</td>
                            <td>{item.trans_complete_date}</td>
                            <td>{item.status}</td>
                            <td>{item.payee_first_name}</td>
                            <td>{item.payee_lst_name}</td>
                            <td>{item.payee_mob}</td>
                            <td>{item.payee_email}</td>
                            <td>{item.client_code}</td>
                            <td>{item.payment_mode}</td>
                            <td>{item.payee_address}</td>
                            <td>{item.udf1}</td>
                            <td>{item.udf2}</td>
                            <td>{item.udf3}</td>
                            <td>{item.udf4}</td>
                            <td>{item.udf5}</td>
                            <td>{item.udf6}</td>
                            <td>{item.udf7}</td>
                            <td>{item.udf8}</td>
                            <td>{item.udf9}</td>
                            <td>{item.udf10}</td>
                            <td>{item.udf11}</td>
                            <td>{item.udf20}</td>
                            <td>{item.gr_number}</td>
                            <td>{item.bank_message}</td>
                            <td>{item.ifsc_code}</td>
                            <td>{item.payer_acount_number}</td>
                            <td>{item.bank_txn_id}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                </div>
                
               
                <div>
               {/* {console.log("show",show)} */}
                {txnList.length>0  ? 
                    <nav aria-label="Page navigation example"  >
                    <ul className="pagination">
      
                   <a className="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1) } href={void(0)}>Previous</a>
                    { 



                      pages.slice(currentPage-1,currentPage+6).map((page,i) => (
                        <li className={
                          page === currentPage ? " page-item active" : "page-item"
                        }> 
                      {/* {console.log("currentPage",currentPage)} */}
                      {/* {console.log("page",page)} */}
                            <a className={`page-link data_${i}`} >  
                              <p onClick={() => pagination(page)}>
                              {page}
                              </p>
                            </a>
                        </li>
                      
                      ))
                    }

                { pages.length!==currentPage? <a className="page-link"  onClick={(nex) => setCurrentPage((nex) => nex === pages.length>9 ? nex : nex + 1)} href={void(0)}>
                      Next</a> : <></> }
                      
                    </ul>
                  </nav>
                  : <></> }
                  </div>
                  {/* {console.log(filterList.length,txnList.length)} */}
                {isLoadingTxnHistory ? 
                  <div className="col-lg-12 col-md-12 mrg-btm- bgcolor"><div className="text-center"><div className="spinner-border" role="status" style={{width: '3rem', height: '3rem'}}><span className="sr-only">Loading...</span></div></div></div> 
                  : 
                  buttonClicked && (showData.length <= 0 || txnList.length <= 0) ? 
                    <div className='showMsg'>No Data Found</div>
                     :
                      <div></div>
                      }  
                {/* { : <div></div>} */}
              </div>
            </div>
          </section>
        </div>
        <footer className="ant-layout-footer">
          <div className="gx-layout-footer-content">
            © 2021 Ippopay. All Rights Reserved.{" "}
            <span className="pull-right">
              Ippopay's GST Number : 33AADCF9175D1ZP
            </span>
          </div>
        </footer>
      </main>
    </section>
  );
}

export default TransactionHistory
