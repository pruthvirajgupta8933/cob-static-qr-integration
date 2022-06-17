import { useState, useEffect } from "react";
import {useLocation} from "react-router-dom"
import axios from 'axios';
import API_URL from "../../config";


const EmandatePage = () => {

  const search = useLocation().search;
  const mendateRegIdParam = new URLSearchParams(search).get('mendateRegId');
  const [details,setDetails] = useState([]);
  const baseUrl = API_URL.MANDATE_REGISTRATION_STATUS;
  const mandateRegId = mendateRegIdParam;
    const getManteDetails = (mandateRegId)=>{
      axios.get(baseUrl+mandateRegId).then((response)=>{
            setDetails(response.data);
    }).catch(error => console.log(error,"error"));
  }

  useEffect(()=>{
    getManteDetails(mandateRegId);
},[]);

const detailsVal =Object.values(details);
const detailsKey =Object.keys(details);


const detailList = detailsKey.map((item,i)=>{
  return (
      <p className="p1"> {item} : {detailsVal[i]}</p>
      );
});

  const initialState = {
    payee_first_name: "",
    txn_id: "",
    client_txn_id: "",
    client_name: "",
    paid_amount: "",
    payment_mode: "",
    trans_date: "",
    status: "",
    udf19: "",

  }
  const [transactionId, setTransactionId] = useState();
  const[studentId, setStudentId]=useState();
  const [show, setIsShow] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [data, setData] = useState(initialState)

  const onSubmit = async (transactionId,studentId) => {
    if(transactionId === null){
      setTransactionId(0);
    }
    else {
      setStudentId(0);
    }
    

    const response = await axios.get(`${API_URL.RECEIPT_MB}${transactionId}/${studentId}`)
      .then((response) => {
        // console.warn(response);
        setData(response.data);
        setIsShow(true);
        setErrMessage('');
      })

      .catch((e) => {
        console.log(e);
        setIsShow(false);
        setErrMessage('No Data Found');

      })

  }
  
 
  return (
      <div className='container'>
        <div className='row'>
          <div className='col-12 mb-4'>
            <div className="card">
              <div className="card-header" style={{ textAlign: 'center' }}>
                SABPAISA TRANSACTION RECEIPT
              </div>
              <div className="card-body" >
                <div className="col-lg-6 mrg-btm- bgcolor">
                <div>
                  <p>MandateDetails Here {mandateRegId}</p> 
                  <div className="main">
                      {detailList}
                  </div>
              </div>
               


                <div className="col-lg-6 mrg-btm- bgcolor">
                </div>

                <button className="btn btn-success" onClick={() => onSubmit(transactionId,studentId)} style={{ marginTop: '70px', marginLeft: -130,width:200 }} >View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

  
  )
}

export default EmandatePage;
