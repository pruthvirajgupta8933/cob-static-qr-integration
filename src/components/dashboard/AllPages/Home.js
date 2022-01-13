import React,{useEffect,useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { successTxnSummary } from '../../../slices/auth';
import '../css/Home.css';

function Home() {
const dispatch = useDispatch();
var currentDate = new Date().toJSON().slice(0, 10);
const [fromDate, setFromDate] = useState(currentDate);
const [toDate, setToDate] = useState(currentDate);
const [clientCode, setClientCode] = useState("1");

const [isLoading,setIsLoading] = useState(false);


    var {successTxnsumry,user} = useSelector((state)=>state.auth);
    if(user.clientMerchantDetailsList.length>0){
      var clientCodeArr = user.clientMerchantDetailsList.map((item)=>{ 
        return item.clientCode;
        });
    }else{
      var clientCodeArr = []
    }
    

    console.log('clientCodeArr',clientCodeArr);
    console.log('successTxnsumry',successTxnsumry);
    
    if(successTxnsumry?.length>0){
      successTxnsumry = successTxnsumry?.filter((txnsummery)=>{
        if(clientCodeArr.includes(txnsummery.clientCode)){
          return clientCodeArr.includes(txnsummery.clientCode);
        }
      });
    }else{
      successTxnsumry=[];
    }
    
    console.log(successTxnsumry);
  
  useEffect(() => {
   
    console.log(fromDate)
    const objParam = {fromDate,toDate,clientCode};
    dispatch(successTxnSummary(objParam));
    setIsLoading(true);
    
  }, [dispatch,clientCode]);

  const handler = (val) => {
    const value =val
    console.log(value)
    successTxnsumry=[];
    setClientCode(value)
}

const handleChange= (e)=>{
      console.log('search ',e);
}
    
   if(isLoading){
     console.log('loading true');
   }

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
                  <select className="ant-input" onChange={(e)=>handler(e.currentTarget.value)}>

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
                   {clientCodeArr && clientCodeArr!==null ? successTxnsumry.map((item,i)=>{
                        return(
                          <tr>
                            <td>{i+1}</td>
                            <td>{item.clientName}</td>
                            <td>{item.noOfTransaction}</td>
                            <td>Rs {item.payeeamount}</td>
                          </tr>
                        )
                      }) : <tr>No Record Found</tr>}
                  </tbody>
                  </table>
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
