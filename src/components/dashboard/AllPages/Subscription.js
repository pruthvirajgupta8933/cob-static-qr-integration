import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { subscriptionplan, subscriptionPlanDetail } from "../../../slices/dashboardSlice";
import { Link } from 'react-router-dom';
import Emandate from '../AllPages/Mandate';

const Subsciption = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(false);
  const { message } = useSelector((state) => state.message);

  const subscriptionData = useSelector(state => state.subscribe);
  const [subscriptionPlanData,setSubscriptionData] = useState([]);
  const [emandateDetails, setEmandateDetails] = useState(false);
  const [subscriptionPlanChargesData,setSubscriptionPlanChargesData] = useState([]);
  const [Plans,setPlans] = useState([]);
  const {dashboard,auth} = useSelector((state)=>state);
  const {user} = auth;
  const {clientSuperMasterList , accountHolderName,accountNumber,bankName,clientEmail,clientMobileNo,ifscCode,loginStatus,pan} =user;
  const { isLoading , subscribe } = dashboard;
 
  const {clientAuthenticationType,clientCode} = clientSuperMasterList[0];

  var authenticationMode ='';
  // console.log(clientAuthenticationType);
  if(clientAuthenticationType==='NetBank'){
    authenticationMode='Netbanking';
  }else{
    authenticationMode='Debitcard';
  }


 const dispatch = useDispatch();

 const getSubscriptionService = async () => {  
    await axios.get('https://cobtestapi.sabpaisa.in/client-subscription-service/fetchAppAndPlan')  
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
    // console.log(e.target.checked);
    // console.log(data);
    if(e.target.checked){
      // console.log(e.target.checked);
      // console.log(data)
      setPlanPrice(data.planPrice);
      // console.log(typeof(data.planValidityDays))
      setPlanType(data.planType);
      setPlanValidityDays(data.planValidityDays);
     
      const ed = new Date();
      var mandateEndDate = ed.setDate(ed.getDate() + data.planValidityDays);
      mandateEndDate = new Date(mandateEndDate).toISOString();
      console.log(mandateEndDate);
      setMandateEndData(mandateEndDate);
    }else{
      setPlanPrice('');
      setPlanType('');
      setPlanValidityDays('');

    }
  }

  // --Working bodyFormData ---
  // const bodyFormData = {
  //   authenticationMode: 'Netbanking',
  //   clientCode: '70',
  //   clientRegistrationId: Math.floor(Math.random() * 90000) + 10000,
  //   consumerReferenceNumber: '96321',
  //   emiamount: "",
  //   frequency: 'ADHO',
  //   mandateCategory: 'A001',
  //   mandateEndDate: '',
  //   mandateMaxAmount: '1.00',
  //   mandatePurpose: "API mandate",
  //   mandateStartDate: "2021-11-11T17:34:29.033Z",
  //   mandateType: 'ONLINE',
  //   npciPaymentBankCode: 'BARB',
  //   panNo: '',
  //   payerAccountNumber: '62300100005139',
  //   payerAccountType: 'SAVINGS',
  //   payerBank: 'BARB',
  //   payerBankIfscCode: 'BARB0VJRAPH',
  //   payerEmail: 'rahmat.ali@sabpaisa.in',
  //   payerMobile: '+91-8750212347',
  //   payerName: 'Rahmat',
  //   payerUtilitityCode: 'NACH00000000022341',
  //   requestType: 'REGSTRN',
  //   schemeReferenceNumber: '741255',
  //   telePhone: '',
  //   untilCancelled: true,
  //   userType: 'merchant',
  // }



useEffect(() => {
  
  // update body by realtime data
  const bodyFormData = {
    authenticationMode: authenticationMode,
    clientCode: 70,
    clientRegistrationId: Math.floor(Math.random() * 90000) + 10000,
    consumerReferenceNumber: Math.floor(Math.random() * 92000) + 10000,
    emiamount:"",
    frequency:'ADHO',
    mandateCategory:'U099',
    mandateEndDate: mandateEndData,
    mandateMaxAmount:planPrice+'.00',
    mandatePurpose: "Others",
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
    telePhone: "",
    untilCancelled:false,
    userType:'merchant',
  }
//,{mandateEndData:mandateEndData,mandateMaxAmount:planPrice+'.00'}
  setSubscribeData(bodyFormData)

}, [mandateEndData,planPrice]);


  console.log("subscribeData",subscribeData);
  useEffect(() => {
    getSubscriptionService();
  },[])
  
  // console.log("Suscription Charges", subscriptionPlanData);    

  const handleSubscribe = (data) => {
    console.log(data);
    setSubscriptionDetails(true);
    setPlans(data)
  }


  // console.log("subscriptionPlanData",subscriptionPlanData);
return (
  <section className="ant-layout">

    <h1>Services</h1>
    <div className="row" style={{overflow:"scroll"}}>
    {subscriptionPlanData.map((s) => 
        <div className="col-3" >
        <div class="col mb-4">  
        <div >
          <div className="card" style={{ background: "aquamarine" }}>
            <div className="card-body" style={{ height: "200px" }}>
              <h5 className="card-title" style={{ fontWeight: "700", fontSize: "large" }}>{s.applicationName}</h5>
              <p className="card-text">{s.planMaster[0].planDescription}</p>
            </div>
            <div class="container">
                <a target="blank" href="https://sabpaisa.in/payout/"  style={{ padding: "0", top: "155px" }} className="btn btn-warning">Read More</a>
                <button type="button" style={{ top: "200px" }} className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={()=>handleSubscribe(s.planMaster)}>subscribe</button>                
            </div>
          </div>
        </div>
        {subscriptionDetails &&
        <div class="modal fade" id="exampleModal" style={{ top: "25%" }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Welcome {s.applicationName} !</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            
            {Plans && Plans.map((sp) =>
            <table className="tables" cellpadding="10" cellspacing="10" width="100%">
                <tbody>
               
                    <><>
                            <th><input type="checkbox" id="plantype" name="plantype" value={sp.planType} onChange={(e)=>{handleChecked(e,sp)}} /> {sp.planType} {sp.planName}</th>
                            </><tr>
                                <td>Rs - {sp.planPrice}</td>
                            </tr><tr>
                                {/* <td colspan="2"><a href="successsubscription.html" className="Click-here ant-btn ant-btn-primary float-right" >Create e-mandate</a></td> */}
                            </tr></>
                            
                </tbody>
            </table>
            )}
            </div>
            <div >
                    <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                    <label for="vehicle1"> I agree all terms and condition.</label>
                </div>
            
            <div class="modal-footer">
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

    
    </section>    
  );
}

export default Subsciption
