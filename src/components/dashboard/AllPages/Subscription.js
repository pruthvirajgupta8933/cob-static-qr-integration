import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { subscriptionplan, subscriptionPlanDetail } from "../../../slices/dashboardSlice";

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
    await axios.get('http://18.216.47.58:8081/client-subscription-service/fetchAppAndPlan')  
    .then(res => {  
      setSubscriptionData(res.data);
    })  
    .catch(err => {  
      console.log(err)
    });  
  }

  const emandate = () => {
    return axios
      .post("https://spl.sabpaisa.in/clientOnBoarding/fetchMerchantListUsingLogin", {
        "authenticationMode": "Netbanking",
        "clientCode":3,
        "clientRegistrationId":"7111302244",
        "consumerReferenceNumber":"232",
        "emiamount":"",
        "frequency":"ADHO",
        "mandateCategory":"D001",
        "mandateEndDate": "",
        "mandateMaxAmount":"12.00",
        "mandatePurpose": "Destination Bank Mandate",
        "mandateStartDate":"2021-11-11T17:34:29.033Z",
        "mandateType":"ONLINE",
        "npciPaymentBankCode":"CNRB",
        "panNo": "",
        "payerAccountNumber":"123131313123",
        "payerAccountType":"SAVINGS",
        "payerBank":"CNRB",
        "payerBankIfscCode":"CNRB0002783",
        "payerEmail":"dhananjayaduttmishra@gmail.com",
        "payerMobile":"+91-9899115728",
        "payerName":"MrDhananjaya",
        "payerUtilitityCode":"NACH00000000022341",
        "requestType":"REGSTRN",
        "schemeReferenceNumber":"34234",
        "telePhone": "",
        "untilCancelled":true,
        "userType":"merchant",
  })
  .then(res => {  
    setEmandateDetails(res.data);
  })  
  .catch(err => {  
    console.log(err)
  });
  };
  

  console.log("Suscription Charges", subscriptionPlanData);

    useEffect(() => {
        getSubscriptionService();
    },[])

  const handleSubscribe = () => {
    setSubscriptionDetails(true);
  }

return (
    <>
    <h1 className="right_side_heading">Services</h1>
    {subscriptionPlanData.map((s) => 
        <div className="row">
        <div style={{ width: "200px" }}>
          <div className="card" style={{ background: "aquamarine" }}>
            <div className="card-body" style={{ height: "200px" }}>
              <h5 className="card-title" style={{ fontWeight: "700", fontSize: "large" }}>{s.applicationName}</h5>
              <p className="card-text">{s.planMaster[0].planDescription}</p>
            </div>
            <div class="container">
                <button type="button" style={{ padding: "0", top: "155px" }} className="btn btn-warning">Read More</button>
                <button type="button" style={{ top: "200px" }} className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={handleSubscribe}>subscribe</button>                
            </div>
          </div>
        </div>
      </div>
    )
    }


    {subscriptionDetails &&
        <div class="modal fade" id="exampleModal" style={{ top: "25%" }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Welcome !</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            <table className="tables" cellpadding="10" cellspacing="10" width="100%">
                <tbody>
                    {subscriptionPlanData.map((sp) =>
                    <><>
                        {sp.planMaster[0].planCode === "WEEK" ? (<th><input type="checkbox" id="vehicle2" name="vehicle2" value="Weekly" />  Weekly Plan</th> ) :
                            (<th><input type="checkbox" id="vehicle2" name="vehicle2" value="Yearly" /> {sp.planMaster[0].planCode === "YEARLY" ? "Yearly Plan" : ""}</th>)}
                            </><tr>
                                <td>Rs - {sp.planMaster[0].planPrice}</td>
                            </tr><tr>
                                <td colspan="2">
                                    <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                                    <label for="vehicle1"> I agree all terms and condition.</label>
                                </td>
                            </tr><tr>
                                <td colspan="2"><a href="successsubscription.html" className="Click-here ant-btn ant-btn-primary float-right" onClick={emandate}>Create e-mandate</a></td>
                            </tr></>
                            
                    )}
                        </tbody>
                </table>
            </div>
            <div class="modal-footer">
            </div>
          </div>
        </div>
      </div>
        
    }
    </>    
);
}

export default Subsciption
