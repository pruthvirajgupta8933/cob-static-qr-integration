// import React,{useEffect,useState} from 'react'
// import {  useLocation,Link } from "react-router-dom"
// import subAPIURL from "../../config"
// import { axiosInstance } from '../../utilities/axiosInstance'

// const CreateMandateApiResponse = () => {
// const location = useLocation();
// const [responseData,setResponseData]=useState({})
// const { search } = location;
//    const mendateRegId = search.split("?mendateRegId=")[1];
   
//      const handleResponseApi = () => {
//       if (mendateRegId) {
//         axiosInstance
//           .post(subAPIURL.CREATE_MANDATE_API_RESPONSE + `?mandateId=${mendateRegId}`)
//           .then((response) => {
         
//            setResponseData(response?.data)
//             // console.log(response.data,"this is response");
//           }).catch((err)=>{
//             console.log(err)
//           })
//       }
  
  
//     };
    
//     useEffect(()=>{
//       handleResponseApi()
//     },[mendateRegId])
  
//   return (
   


// <section className="">
// <main className="">
//   <div className="">
//     <div >
//       <h5 className="">Create Mandate API Response</h5>
//     </div>
//     <Link to="/dashboard/subscription/create-mandate-api" className="btn cob-btn-primary  approve  text-white mt-3">Create Mandate</Link>
//     <div className="row mt-5">
    
//     <div className="scroll overflow-auto">
//     <table className="table table-bordered">
//         <thead>
          
//         </thead>
//         <tbody>
//           <tr>
//             <th>Status</th>
//             <td>{responseData.regestrationStatus}</td>
//           </tr>

//           <tr>
//             <th>Reason</th>
//             <td>{responseData.reasonDesc}</td>
//           </tr>
//           <tr>
//             <th>Ref No</th>
//             <td>{responseData.accptRefNo}</td>
//           </tr>
         
//           <tr>
//             <th>Authentication Mode</th>
//             <td>{responseData.authenticationMode}</td>
//           </tr>
//           <tr>
//             <th>Bank Name</th>
//             <td>{responseData.bankName}</td>
//           </tr>
//           <tr>
//             <th>Client Code</th>
//             <td>{responseData.clientCode}</td>
//           </tr>
//           <tr>
//             <th>Client Registration Id</th>
//             <td>{responseData.clientRegistrationId}</td>
//           </tr>
//           <tr>
//             <th>Consumer Reference Number</th>
//             <td>{responseData.consumerReferenceNumber}</td>
//           </tr>
//         </tbody>
//       </table>
        

     
        
//     </div>

    
// </div>

   

   
//   </div>
// </main>
// </section>
//   )
// }

// export default CreateMandateApiResponse
