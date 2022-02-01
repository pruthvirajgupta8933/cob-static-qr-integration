import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { subscriptionplan, subscriptionPlanDetail } from "../../../slices/dashboardSlice";
import { Link } from 'react-router-dom';

const Subsciption = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(false);
  const { message } = useSelector((state) => state.message);
  const subscriptionData = useSelector(state => state.subscribe);
  const [subscriptionPlanData,setSubscriptionData] = useState([]);
  const [emandateDetails, setEmandateDetails] = useState(false);
  const [subscriptionPlanChargesData,setSubscriptionPlanChargesData] = useState([]);
  const {dashboard,auth} = useSelector((state)=>state);
  const { isLoading , subscribe } = dashboard;
 console.log("subsciption.js", subscriptionplan);  
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

  // switch(planDate){
  //   case week:
  //     let planEndDateWeek = d.setDate(d.getDate() + 7);
  //     planEndDateWeek = new Date(planEndDateWeek).toISOString();
  //     break;
  //   case yearly:
  //     let planEndDateYear = d.setDate(d.getDate() + 365);
  //     planEndDateYear = new Date(planEndDateYear).toISOString();
  //     break;
  //   default:    
  // }
  let sevenDaysFromNow = d.setDate(d.getDate() + 7);
  sevenDaysFromNow = new Date(sevenDaysFromNow).toISOString();

  const emandate = () => {
    return axios
      .post("https://subscription.sabpaisa.in/subscription/mandateRegistration", {
        "authenticationMode": "Netbanking",
        "clientCode": 70,
        "clientRegistrationId": Math.floor(Math.random() * 90000) + 10000,
        "consumerReferenceNumber": Math.floor(Math.random() * 92000) + 10000,
        "emiamount":"",
        "frequency":"ADHO",
        "mandateCategory":"D001",
        "mandateEndDate": sevenDaysFromNow,
        "mandateMaxAmount":"12.00",
        "mandatePurpose": "Destination Bank Mandate",
        "mandateStartDate": formattedDate,
        "mandateType":"ONLINE",
        "npciPaymentBankCode":"BARB",
        "panNo": "",
        "payerAccountNumber":"62300100005139",
        "payerAccountType":"SAVINGS",
        "payerBank":"BARB",
        "payerBankIfscCode":"BARB0VJRAPH",
        "payerEmail": userDetails.clientEmail,
        "payerMobile": userDetails.clientMobileNo,
        "payerName": userDetails.payerName,
        "payerUtilitityCode":"NACH00000000022341",
        "requestType":"REGSTRN",
        "schemeReferenceNumber":Math.floor(Math.random() * 94000) + 10000,
        "telePhone": "",
        "untilCancelled":false,
        "userType":"merchant",
  })
  .then(res => {  
    setEmandateDetails(res.data);
  })  
  .catch(err => {  
    console.log(err)
  });
  };

  useEffect(() => {
    getSubscriptionService();
  },[])
  
  console.log("Suscription Charges", subscriptionPlanData);    

  const handleSubscribe = () => {
    setSubscriptionDetails(true);
  }

return (
    <>
    <h1 className="right_side_heading">Services</h1>
    {subscriptionPlanData.map((s) => 
        <div className="row row-cols-1 row-cols-md-2" style={{ marginLeft: "0px" , marginRight: "50px" }}>
        <div class="col mb-4">  
        <div style={{ width: "200px" }}>
          <div className="card" style={{ background: "aquamarine" }}>
            <div className="card-body" style={{ height: "200px" }}>
              <h5 className="card-title" style={{ fontWeight: "700", fontSize: "large" }}>{s.applicationName}</h5>
              <p className="card-text">{s.planMaster[0].planDescription}</p>
            </div>
            <div class="container">
                <a target="blank" href="https://sabpaisa.in/payout/"  style={{ padding: "0", top: "155px" }} className="btn btn-warning">Read More</a>
                <button type="button" style={{ top: "200px" }} className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={handleSubscribe}>subscribe</button>                
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
            <table className="tables" cellpadding="10" cellspacing="10" width="100%">
                <tbody>
                    <><>
                            <th><input type="checkbox" id="vehicle2" name="vehicle2" value="Yearly" /> {s.planMaster[0].planType}</th>
                            </><tr>
                                <td>Rs - {s.planMaster[0].planPrice}</td>
                            </tr><tr>
                                <td colspan="2">
                                    <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                                    <label for="vehicle1"> I agree all terms and condition.</label>
                                </td>
                            </tr><tr>
                                <td colspan="2"><a href="successsubscription.html" className="Click-here ant-btn ant-btn-primary float-right" onClick={emandate}>Create e-mandate</a></td>
                            </tr></>
                            
                </tbody>
            </table>
            </div>
            <div class="modal-footer">
            </div>
          </div>
        </div>
      )}
      </div>        
    }
        </div>
      </div>
    )
  }

    
    </>    
);
}

export default Subsciption
