import React,{useEffect,useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { successTxnSummary } from '../../../slices/auth';
import ProgressBar from '../../../_components/reuseable_components/ProgressBar';
import '../css/Home.css';

function Home() {
  // console.log("home page call");
  const dispatch = useDispatch();
  var currentDate = new Date().toJSON().slice(0, 10);
  const [fromDate, setFromDate] = useState(currentDate);
  const [toDate, setToDate] = useState(currentDate);
  const [clientCode, setClientCode] = useState("1");
  const [isLoading,setIsLoading] = useState(false);
  const [search, SetSearch] = useState("");
  const [txnList, SetTxnList] = useState([]);



  var {successTxnsumry,user} = useSelector((state)=>state.auth);
  console.log('successTxnsumry',successTxnsumry);
  // console.log('user call',user);
  if(user.clientMerchantDetailsList.length>0){
    var clientCodeArr = user.clientMerchantDetailsList.map((item)=>{ 
      return item.clientCode;
      });
  }else{
    clientCodeArr = []
  }
  
  var filterData =[];
  useEffect(() => {
    if(successTxnsumry?.length>0){
      setIsLoading(false)
       filterData = successTxnsumry?.filter((txnsummery)=>{
        if(clientCodeArr.includes(txnsummery.clientCode)){
          return clientCodeArr.includes(txnsummery.clientCode);
        }
      });
      SetTxnList(filterData);
      console.log('filterData',filterData)
    }else{
      successTxnsumry=[];
    }

    const objParam = {fromDate,toDate,clientCode};
    dispatch(successTxnSummary(objParam));
    setIsLoading(true);
    // console.log('useEffect call');
  }, [clientCode]);

  useEffect(() => {
    SetTxnList(successTxnsumry.filter((txnItme)=>txnItme.clientName.toLowerCase().includes(search.toLocaleLowerCase())));
  }, [search]);
  


const handleChange= (e)=>{
      SetSearch(e);
}
    console.log('loading ',isLoading);
   

    return (
      <section className="ant-layout">
      <div className="profileBarStatus">
        {/*  <div class="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span class="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Home</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a" id="features08-3-">
            <div className="container-fluid">
              <div className="row">
                {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                  lazy dog.The quick brown fox jumps over the lazy dog.</p> */}
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Sucessful TRansaction Summary</label>
                  <select className="ant-input" value={clientCode} onChange={(e)=>setClientCode(e.currentTarget.value)}>
                    <option defaultValue='selected' value="1">Today</option>
                    <option value="2">Yesterday</option>
                    <option value="3">Last 7 Days</option>
                    <option value="4">Current Month</option>
                    <option value="5">Last Month</option>
                  </select>
                </div>
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Search</label>
                  <input type="text" className="ant-input" onChange={(e)=>{handleChange(e.currentTarget.value)}} placeholder="Search from here" />
                </div>
                <table cellspaccing={0} cellPadding={10} border={0} width="100%" className="tables">
                  <tbody><tr>
                      <th>Sr. No.</th>
                      <th>Client's Name</th>
                      <th>Transactions</th>
                      <th>Amount</th>
                    </tr>
                   {filterData && filterData.map((item,i)=>{
                        return(
                          <tr key={i}>
                            <td>{i+1}</td>
                            <td>{item.clientName}</td>
                            <td>{item.noOfTransaction}</td>
                            <td>Rs {item.payeeamount}</td>
                          </tr>

                        )
                      }) }
                  </tbody>
                  </table>
                  {clientCodeArr && clientCodeArr===null ? <ProgressBar />:<></>}
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

export default Home