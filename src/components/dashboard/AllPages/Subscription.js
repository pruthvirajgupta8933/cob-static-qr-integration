import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { subscriptionplan, subscriptionPlanDetail } from "../../../slices/dashboardSlice";
import { Link } from 'react-router-dom';
import Emandate from '../AllPages/Mandate';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

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

  
  const [Plans,setPlans] = useState([]);
  const {dashboard,auth} = useSelector((state)=>state);
  const {user} = auth;
  let history = useHistory();

  if(user && user.clientSuperMasterList===null){
    // alert(`${path}/profile`);
    // return <Redirect to={`${path}/profile`} />
    history.push('/dashboard/profile');
  } 
  
  const {clientSuperMasterList , accountHolderName,accountNumber,bankName,clientEmail,clientMobileNo,ifscCode,loginStatus,pan} =user;
  const { isLoading , subscribe } = dashboard;
  let clientAuthenticationType,clientCode = '';
  if(clientSuperMasterList!==null){

    let {clientAuthenticationType,clientCode} = clientSuperMasterList[0];

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
    await axios.get('http://18.189.11.232:8081/client-subscription-service/fetchAppAndPlan')  
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

    <h1 style={{fontSize:"21px"}}>Services</h1>
    <div className="row" style={{overflow:"scroll"}}>
    {subscriptionPlanData.map((s) => 
        <div className="col-3" >
        <div class="col mb-4">  
        <div >
          <div className="card" style={{ background: "aquamarine" }}>
            <div className="card-body" style={{ height: "200px" }}>
              <h5 className="card-title" style={{ fontWeight: "700", fontSize: "large" }}>{s.applicationName}</h5>
              <p className="card-text">{s.applicationDescription}</p>
            </div>
            <div class="container">
                <a target="blank" href={s.applicationUrl}  style={{ padding: "0", top: "155px" }} className="btn btn-warning">Read More</a>
                <button type="button" style={{ top: "200px" }} className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={()=>handleSubscribe(s.planMaster,{applicationName:s.applicationName,applicationId:s.applicationId})}>subscribe</button>                
            </div>
          </div>
        </div>
        {subscriptionDetails &&
        <div class="modal fade" id="exampleModal" style={{ top: "25%" }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Welcome - {subscribePlanData.applicationName} !</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={()=>modalHandler()}>
                <span aria-hidden="true" onClick={()=>setIsModelClosed(false)}>&times;</span>
              </button>
            </div>
            <div class="modal-body">
            
            {Plans && Plans.map((sp) =>
            <table className="tables" cellpadding="10" cellspacing="10" width="100%">
                <tbody>
                    <><>
                        <th><input type="radio" id="plantype" name="plantype" value={sp.planType} onChange={(e)=>{handleChecked(e,sp)}} /><span style={{ textTransform: "uppercase"}}>
                        {sp.planType}
                        </span>  {sp.planName}</th>
                          </>
                            <tr>
                                <td>Rs - {sp.planPrice}</td>
                            </tr>
                            <tr></tr>
                          </>    
                </tbody>
            </table>
            )}
            </div>
            <div >
                    <input type="checkbox" id="termandcnd" name="termandcnd" value="termandcnd" checked={termAndCnd}
                        onChange={e => setTermAndCnd(e.target.checked)} />
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
