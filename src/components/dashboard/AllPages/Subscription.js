import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { subscriptionplan, subscriptionPlanDetail } from "../../../slices/dashboardSlice";
import { Link } from 'react-router-dom';
import Emandate from '../AllPages/Mandate';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
// import paymentGateWay from '../../../payment-gateway/'


const Subsciption = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(false);
  const { message } = useSelector((state) => state.message);

  const subscriptionData = useSelector(state => state.subscribe);
  const [subscriptionPlanData,setSubscriptionData] = useState([]);
  const [emandateDetails, setEmandateDetails] = useState(false);
  const [termAndCnd, setTermAndCnd] = useState(false);
  const [subscriptionPlanChargesData,setSubscriptionPlanChargesData] = useState([]);
  const [subscribePlanData,setSubscribePlanData] = useState([]);
  const [isModelClosed,setIsModelClosed] = useState(false);
  const [paymentGatewayUrl,setPaymentGatewayUrl] = useState([]);

  
  const [Plans,setPlans] = useState([]);
  const {dashboard,auth} = useSelector((state)=>state);
  const {user} = auth;
  let history = useHistory();

  if(user && user.clientMerchantDetailsList===null){
    // alert(`${path}/profile`);
    // return <Redirect to={`${path}/profile`} />
    history.push('/dashboard/profile');
  } 
  
  const {clientMerchantDetailsList , accountHolderName,accountNumber,bankName,clientEmail,clientMobileNo,ifscCode,loginStatus,pan} =user;
  const { isLoading , subscribe } = dashboard;
  let clientAuthenticationType,clientCode = '';
  if(clientMerchantDetailsList!==null){

    let {clientAuthenticationType,clientCode} = clientMerchantDetailsList[0];

  }
  var authenticationMode ='';
  // console.log(clientAuthenticationType);
  if(clientAuthenticationType==='NetBank'){
    authenticationMode='Netbanking';
  }else{
    authenticationMode='Debitcard';
  }


 const dispatch = useDispatch();

 const getSubscriptionService = async () => {  
    await axios.get('https://spl.sabpaisa.in/client-subscription-service/fetchAppAndPlan')  
    .then(res => {  
      setSubscriptionData(res.data);
      localStorage.setItem("subscriptionData", JSON.stringify(res.data));
    })  
    .catch(err => {  
      console.log(err)
    });  
  }

  const userDetails = JSON.parse(localStorage?.getItem("user"));

  const subsData = JSON.parse(localStorage?.getItem("subscriptionData"));

  const d = new Date();
  let formattedDate = d.toISOString();

  const [planPrice,setPlanPrice]=useState('');
  const [planType,setPlanType]=useState('');
  const [planValidityDays,setPlanValidityDays]=useState('');
  const [mandateEndData,setMandateEndData]=useState('');
  const [subscribeData,setSubscribeData]=useState({});

// console.log(mandateEndData);

  const handleChecked=(e,data={})=>{
    if(e.target.checked){
      setSubscribePlanData({...subscribePlanData,
                              planId:data.planId ,
                              planName: data.planName,
                              planType:data.planType
                            });
    
      setPlanPrice(data.planPrice);
      setPlanType(data.planType);
      setPlanValidityDays(data.planValidityDays);
     
      const ed = new Date();
      var mandateEndDate = ed.setDate(ed.getDate() + data.planValidityDays);
      mandateEndDate = new Date(mandateEndDate).toISOString();
      setMandateEndData(mandateEndDate);
      
    }else{
      setPlanPrice('');
      setPlanType('');
      setPlanValidityDays('');

    }
  }

useEffect(() => {
  
  // update body by realtime data
  const bodyFormData = {
    authenticationMode: authenticationMode,
    clientCode: 70,
    clientRegistrationId: Math.floor(Math.random() * 90000) + 10000,
    consumerReferenceNumber: Math.floor(Math.random() * 92000) + 10000,
    emiamount:'',
    frequency:'ADHO',
    mandateCategory:'U099',
    mandateEndDate: mandateEndData,
    mandateMaxAmount:planPrice+'.00',
    mandatePurpose: 'Others',
    mandateStartDate: formattedDate,
    mandateType:'ONLINE',
    npciPaymentBankCode:bankName,
    panNo: '',
    payerAccountNumber:accountNumber,
    payerAccountType:'SAVINGS',
    payerBank:bankName,
    payerBankIfscCode:ifscCode,
    payerEmail: clientEmail,
    payerMobile: '+91-'+ clientMobileNo,
    payerName: accountHolderName,
    payerUtilitityCode:'NACH00000000022341',
    requestType:'REGSTRN',
    schemeReferenceNumber:Math.floor(Math.random() * 94000) + 10000,
    telePhone: '',
    untilCancelled:false,
    userType:'merchant',
    termAndCnd:termAndCnd,
    planId:subscribePlanData.planId,
    planName:subscribePlanData.planName,
    planType:subscribePlanData.planType,
    applicationId:subscribePlanData.applicationId,
    applicationName:subscribePlanData.applicationName,
    isModelClosed:isModelClosed

  }
//,{mandateEndData:mandateEndData,mandateMaxAmount:planPrice+'.00'}
  
  setSubscribeData(bodyFormData)

}, [mandateEndData,planPrice,termAndCnd,subscribePlanData,isModelClosed]);


  useEffect(() => {
    getSubscriptionService();
  },[])

  const modalHandler = () =>{
  
    setIsModelClosed(false)
  }
  
  // console.log("Suscription Charges", subscriptionPlanData);    

  const handleSubscribe = (data,applicationData) => {
    
    // console.log(applicationData);
    // console.log(applicationData)
    setSubscribePlanData({...subscribePlanData, 
                            applicationId:applicationData.applicationId,
                            applicationName:applicationData.applicationName
    });
    
    setSubscriptionDetails(true);
    setPlans(data)
  }

  useEffect(() => {
    // console.log("termAndCnd",termAndCnd);
  }, [subscribePlanData,termAndCnd]);
  


  // console.log("subscriptionPlanData",subscriptionPlanData);
return (
  <section className="ant-layout">
    <div className="profileBarStatus">
          {/*  <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span className="btn">Upload Here</span></span></div>*/}
    </div>
    <main className="gx-layout-content ant-layout-content">
          <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
              <h1 className="m-b-sm gx-float-left">Product Catalogue</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft" id="features08-3-">
              <div className="container-fluid">
              <div className="row">
              {/* {console.log(subscriptionPlanData.length)} */}
        {subscriptionPlanData.length <= 0 ? <h3>Loading...</h3> : subscriptionPlanData.map((s,i) => 
        <div className="col-3" key={i}>
        <div className="col mb-4">  
        <div >
          <div className="card" style={{ background: "aquamarine" }}>
            <div className="card-body" style={{ height: "200px" }}>
              <h5 className="card-title" style={{ fontWeight: "700", fontSize: "large" }}>{s.applicationName}</h5>
              <p className="card-text">{s.applicationDescription}</p>
              <div>
                <a href={s.applicationUrl} target="blank" className="btn btn-sm " style={{backgroundColor:"#ffc107"}} role="button" aria-pressed="true"> Read More</a>
                <button type="button"
                //  style={{ top: "200px" }}
                  className="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModal" onClick={()=>handleSubscribe(s.planMaster,{applicationName:s.applicationName,applicationId:s.applicationId})}>Subscribe</button>
                </div>
            </div>
            <div className="container">
            </div>
            {/* <div>
              <button type="button" className="btn btn-info sm" onClick={()=>makePayment()}>Make Payment</button>
            </div> */}
          </div>
        </div>
        {subscriptionDetails &&
        <div className="modal fade" id="exampleModal" style={{ top: "25%" }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Welcome - {subscribePlanData.applicationName} !</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=>modalHandler()}>
                <span aria-hidden="true" onClick={()=>setIsModelClosed(false)}>&times;</span>
              </button>
            </div>
            <div className="modal-body">
            
            {Plans && Plans.map((sp,i) =>
            <table className="tables" cellPadding="10" cellSpacing="10" width="100%" key={i}>
            
            <thead>
            <tr>
            <th>
              <input type="radio" id="plantype" name="plantype" value={sp.planType} onChange={(e)=>{handleChecked(e,sp)}} />
              <span style={{ textTransform: "uppercase",marginLeft:"8px"}}>
              {sp.planType}
              </span>  
              {sp.planName}
            </th> 
            </tr>  
            </thead>
            <tbody>
                <tr >
                    <td >Rs - {sp.planPrice}</td>
                </tr>
                <tr></tr>          
                </tbody>
            </table>
            )}
            </div>
            <div modal-body >
                    <input type="checkbox" id="termandcnd" name="termandcnd" value="termandcnd" checked={termAndCnd}
                        onChange={e => setTermAndCnd(e.target.checked)} />
                    <label htmlFor="vehicle1" style={{margin:"5px"}}> I agree all terms and condition.</label>
                </div>
            
            <div className="modal-footer">
              <Emandate bodyData={subscribeData}/>
              
            </div>
          </div>
        </div>
      )
      </div>        
    }
    </div>
      </div>
    )
  }
  </div>
  </div>
</section>    
</div>
</main>      
</section>    
  );
}

export default Subsciption