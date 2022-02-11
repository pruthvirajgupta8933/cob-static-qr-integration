import React,{useEffect, useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useRouteMatch, Redirect,useHistory} from 'react-router-dom'
import getPaymentStatusList from '../../../services/home.service'
import axios from "axios"


function TransactionHistory() {
  const dispatch = useDispatch();
  const {path} = useRouteMatch();
  
  let history = useHistory();
  var {user} = useSelector((state)=>state.auth);

  const [paymentStatusList,SetPaymentStatusList] = useState([]);
  const [paymentModeList,SetPaymentModeList] = useState([]);
  const [clientCode,SetClientCode] = useState("All");
  const [fromDate,SetFromDate] = useState("");
  const [toDate,SetToDate] = useState("");
  const [txnStatus,SetTxnStatus] = useState("All");
  const [payModeId,SetPayModeId] = useState("All")
  const [txnList,SetTxnList] = useState([])
  const [filterList,SetFilterList] = useState([])
  const [searchText,SetSearchText] = useState('')

  function dayDiff(dateFrom, dateTo) {
    var from = new Date(dateFrom);
    var to = new Date(dateTo);
    var diffInMs   =to - from
    return Math.abs(diffInMs / (1000 * 60 * 60 * 24));
   }
   

  const getInputValue=(label,val)=>{
      if(label==='fromDate'){
        SetFromDate(val);
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



const checkValidation = ()=>{
    var flag = true
    if(fromDate==='' || toDate===''){
        alert("Please select the date.");
        flag = false;
    }else if(fromDate!=='' || toDate!==''){
      //check date range
      var days =  dayDiff(fromDate,toDate);
      if(days <= 0 || days >= 90 ){
        flag = false;
          alert("The date range should be under 3 months");
      }
      
    }else{
      flag = true;
    }

    return flag;
}


  const txnHistory = async () => {  
    var isValid = checkValidation();
          if(isValid){ await axios.get(`https://reportapi.sabpaisa.in/REST/txnHistory/${clientCode}/${txnStatus}/${payModeId}/${fromDate}/${toDate}/0/0`)  
          .then(res => {  
            SetTxnList(res.data);
            SetFilterList(res.data)
            // console.log(res)
          })  
          .catch(err => {  
            console.log(err)  
          });    
      }else{
        console.log('API not trigger!');
      }
  }  

  
  useEffect(() => {     
    getPaymentStatusList();
    paymodeList();  
  }, [])


  useEffect(() => {
    if(searchText !== ''){ SetFilterList(txnList.filter((txnItme)=>txnItme.txn_id.toLowerCase().includes(searchText.toLocaleLowerCase())))}else{SetFilterList(txnList)}
  }, [searchText])


  var clientSuperMasterList =[];
  if(user && user.clientSuperMasterList===null){
    history.push('/dashboard/profile');
  }else{
    clientSuperMasterList = user.clientSuperMasterList;
  }
  
  
  console.log(txnList.lenth)




  return (
        <section className="ant-layout">
        <div className="profileBarStatus">
          {/*
                    <div class="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span
                                class="btn">Upload Here</span></span></div>*/}
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
                    <select className="ant-input" onChange={(e)=>{getInputValue('clientCode',e.target.value)}}>
                    <option value="0">All</option>
                     {clientSuperMasterList.map((item)=>{
                       return (<option value={item.clientCode}>{ item.clientCode + ' - ' +item.clientName} </option>);
                     })}
                      
                    </select>
                  </div>
                  <div className="col-lg-4 mrg-btm- bgcolor">
                    <label>From Date</label>
                    <input type="date" className="ant-input" placeholder="From Date" onChange={(e)=>{getInputValue('fromDate',e.target.value)}} />
                  </div>
                  <div className="col-lg-4 mrg-btm- bgcolor">
                    <label>To Date</label>
                    <input type="date" className="ant-input" placeholder="To Date" onChange={(e)=>{getInputValue('toDate',e.target.value)}} />
                  </div>
                  <div className="col-lg-4 mrg-btm- bgcolor">
                    <label>Transactions Status</label>
                    <select className="ant-input" onChange={(e)=>{getInputValue('txnStatus',e.target.value)}}>
                    <option value="All">All</option>
                     {paymentStatusList.map((item,i)=>{
                       return (<option value={item}>{item} </option>);
                     })}
                    </select>
                  </div>
                  <div className="col-lg-4 mrg-btm- bgcolor">
                    <label>Payment Mode</label>
                    <select className="ant-input" onChange={(e)=>{getInputValue('payMode',e.target.value)}}>
                    <option value="All">All</option>
                     {paymentModeList.map((item)=>{
                       return (<option value={item.paymodeId}>{item.paymodeName } </option>);
                     })}
                    </select>
                  </div>
                  <div className="col-lg-4 mrg-btm- bgcolor">
                    <button className="view_history" style={{margin: '22px 8px 0 0'}} onClick={()=>txnHistory()}>Search</button>
                    <button className="view_history" style={{margin: '22px 8px 0 0'}}>Export to
                      Excel</button>
                  </div>
                  <div className="col-lg-6 mrg-btm- bgcolor">
                    <label>Search Transaction ID</label>
                    <input type="text" className="ant-input" placeholder="Search here" onChange={(e)=>{SetSearchText(e.target.value)}} />
                  </div>
                  <div className="col-lg-6 mrg-btm- bgcolor">
                    <label>Count per page</label>
                    <select className="ant-input">
                      <option selected>10</option>
                      <option>20</option>
                      <option>50</option>
                    </select>
                  </div>
                  <table cellspaccing={0} cellPadding={10} border={0} width="100%" className="tables">
                    <tbody><tr>
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
                          </tr>
                          {txnList.length>0 && filterList.map((item,i)=>{return(
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
                          )})}
                          
                    </tbody></table>
                  {filterList.length<0? <div>No Data Found</div>:<div></div>}
                </div>
              </div></section>
          </div>
          <footer className="ant-layout-footer">
            <div className="gx-layout-footer-content">© 2021 Ippopay. All Rights Reserved. <span className="pull-right">Ippopay's GST Number : 33AADCF9175D1ZP</span></div>
          </footer>
        </main>
      </section>
    )
}

export default TransactionHistory
