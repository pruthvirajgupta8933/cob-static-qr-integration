
import React,{useEffect,useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { successTxnSummary, subscriptionplan, subscriptionPlanDetail } from '../../../slices/dashboardSlice';
import ProgressBar from '../../../_components/reuseable_components/ProgressBar';
import { useRouteMatch, Redirect} from 'react-router-dom'
import NavBar from '../NavBar/NavBar';
import '../css/Home.css';



function TransactionSummery() {

  
  // console.log("home page call");
  const dispatch = useDispatch();
  let { path } = useRouteMatch();
  var currentDate = new Date().toJSON().slice(0, 10);
  const [fromDate, setFromDate] = useState(currentDate);
  const [toDate, setToDate] = useState(currentDate);
  const [clientCode, setClientCode] = useState("1");
  
  const [search, SetSearch] = useState("");
  const [txnList, SetTxnList] = useState([]);
  const [showData, SetShowData] = useState([]);



  const {dashboard,auth} = useSelector((state)=>state);
  // console.log("dashboard",dashboard)
  const { isLoading , successTxnsumry, subscribedService } = dashboard;
  const {user} = auth;
  var clientCodeArr = [];
  var totalSuccessTxn = 0;
  var totalAmt = 0;

  // dispatch action when client code change
  useEffect(() => {
    const objParam = {fromDate,toDate,clientCode};
    var DefaulttxnList = [];
    SetTxnList(DefaulttxnList);
    SetShowData(DefaulttxnList);
    // console.log(objParam);
    dispatch(subscriptionplan);
    dispatch(successTxnSummary(objParam));
  }, [clientCode]);

  // console.log('successTxnsumry',successTxnsumry );
  // console.log('clientMerchantDetailsList',user.clientMerchantDetailsList);

  
  //make client code array
  if(user?.clientMerchantDetailsList!==null && user.clientMerchantDetailsList?.length>0){
        clientCodeArr = user.clientMerchantDetailsList.map((item)=>{ 
      return item.clientCode;
      });
  }else{
        clientCodeArr = []
  }

  

  // filter api response data with client code
  useEffect(() => {
    if(successTxnsumry?.length>0){
       var filterData = successTxnsumry?.filter((txnsummery)=>{
      if(clientCodeArr.includes(txnsummery.clientCode)){
        return clientCodeArr.includes(txnsummery.clientCode);
        }
      });
      SetTxnList(filterData);
      SetShowData(filterData);
    }else{
      //successTxnsumry=[];
    }
    
  }, [successTxnsumry])
  

  useEffect(() => {
    search!==''
    ? SetShowData(txnList.filter((txnItme)=>
    Object.values(txnItme).join(" ").toLowerCase().includes(search.toLocaleLowerCase())))
    : SetShowData(txnList);
  }, [search]);
  

  const handleChange= (e)=>{
        SetSearch(e);
  }

 
  if(user.roleId!==3 && user.roleId!==13){
    if(user.clientMerchantDetailsList===null){
      return <Redirect to={`${path}/profile`} />
    }
  } 


showData.map((item)=>{
      totalSuccessTxn += item.noOfTransaction;
      totalAmt +=item.payeeamount
})

    return (
      <section className="ant-layout">
          <div>
        <NavBar />
      </div>
        {/* <div className="profileBarStatus">
        </div> */}
        <main className="gx-layout-content ant-layout-content">
          <div className="gx-main-content-wrapper">
            <div className="right_layout my_account_wrapper right_side_heading">
              <h1 className="m-b-sm gx-float-left">Transaction Summary</h1>
            </div>
            <section className="features8 cid-sg6XYTl25a flleft" id="features08-3-">
              <div className="container-fluid">
                <div className="row bgcolor">
                  <div className="col-lg-6 mrg-btm- bgcolor-">
                    <label>Successful Transaction Summary</label>
                    <select
                      className="ant-input"
                      value={clientCode}
                      onChange={(e) => setClientCode(e.currentTarget.value)}
                    >
                      <option defaultValue="selected" value="1">
                        Today
                      </option>
                      <option value="2">Yesterday</option>
                      <option value="3">Last 7 Days</option>
                      <option value="4">Current Month</option>
                      <option value="5">Last Month</option>
                    </select>
                  </div>

                  {txnList.length > 0 ? (
                    <div className="col-lg-6 mrg-btm-">
                      <label>Search</label>
                      <input
                        type="text"
                        className="ant-input"
                        onChange={(e) => {
                          handleChange(e.currentTarget.value);
                        }}
                        placeholder="Search from here"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="gap">
                    <p>
                      Total Successful Transactions: {totalSuccessTxn} | Total
                      Amount {`(INR)`}: {totalAmt}{" "}
                    </p>
                  </div>
                  <table
                    cellspaccing={0}
                    cellPadding={10}
                    border={0}
                    width="100%"
                    className="tables"
                  >
                    <tbody>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Client's Name</th>
                        <th>Transactions</th>
                        <th>Amount</th>
                      </tr>
                      {showData &&
                        !isLoading &&
                        showData.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.clientName}</td>
                              <td>{item.noOfTransaction}</td>
                              <td>Rs {item.payeeamount}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  {showData.length <= 0 && isLoading === false ? (
                    <div className="showMsg"> No Record Found</div>
                  ) : (
                    <></>
                  )}

                  {isLoading ? <ProgressBar /> : <></>}
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

export default TransactionSummery;