import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import API_URL from "../../config";
import { kycForApproved, UploadLoginId } from "../../slices/kycSlice"


function ApprovedMerchant() {
  const [approveMerchant, setApproveMerchant] = useState([])
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [documentId, setDocumentId] = useState("")
  const [documentIdImg, setDocumentImg] = useState("#")
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const masterid = useSelector(
    (state) =>
      state.kyc.kycApproved.results);
  //   const document=useSelector((state)=> state.kyc.documentByloginId)
  //  const {documentId}=document;
  const approvedSearch = (e) => {
    setSearchText(e.target.value);
  };


  useEffect(() => {
    kycapproved();
  }, []);
  const kycapproved=()=>{ 
    dispatch(kycForApproved()).then((resp) => {
      const data = resp.payload.results

      setApproveMerchant(data);

})

      .catch((err) => console.log(err));
  }

 


  /////////////////////////////////////Search filter
  useEffect(() => {
    if (searchText.length > 0) {
      setApproveMerchant(approveMerchant.filter((item) =>

        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    } else {
      kycapproved();
  }
  }, [searchText])

  

  const viewDocument = async (loginMaidsterId) => {
    const res = await axios.post(`https://stgcobkyc.sabpaisa.in/kyc/upload-merchant-document/document-by-login-id/`, {
      login_id: loginMaidsterId
    }).then(res => {
      if (res.status === 200) {
        const data = res.data;
        const docId = data[0].documentId;
 const ImgUrl = `${API_URL.MERCHANT_DOCUMENT}/?document_id=${docId}`;
        setDocumentImg(ImgUrl)
      }
    })
      .catch(error => {
        console.error('There was an error!', error);
      });
};

 return (
    <div className="row">
      <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Search</label>
        <input className='form-control' onChange={approvedSearch} type="text" placeholder="Search Here" />
      </div>
    <div className="col-md-12 col-md-offset-4">

      <table className="table table-bordered">
        <thead>
          <tr>
            
            <th>Serial No.</th>
            <th>Merchant Id</th>
            <th>Contact Number</th>
            <th>Name</th>
            <th> Email</th>
            <th>Bank</th>
            <th>Adhar Number</th>
            <th>Pan card</th>
            <th>State</th>
            <th>Pin code</th>
            <th>Status</th>
            <th>View document</th>
          </tr>
        </thead>
        <tbody>
          {approveMerchant.map((user, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{user.merchantId}</td>
              <td>{user.contactNumber}</td>
              <td>{user.name}</td>
              <td>{user.emailId}</td>
              <td>{user.bankName}</td>
              <td>{user.aadharNumber}</td>
              <td>{user.panCard}</td>
              <td>{user.stateId}</td>
              <td>{user.pinCode}</td>
              <td>{user.status}</td>
              {/* <td>  <button type="button" class="btn btn-primary" onClick={onClick}>View Document</button></td> */}
              <td>
                <button type="button" class="btn btn-primary" data-toggle="modal" onClick={()=>viewDocument(user.loginMasterId)} data-target="#exampleModal">
                  View Document
                </button>


                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>

                      </div>
                      <div class="modal-body">
                        <img src={`${documentIdImg}`}  alt="doc" />

                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>

                      </div>

                    </div>
                  </div>
                </div></td>
            </tr>

          ))}

        </tbody>
      </table>

    </div>
    </div>



  );
}

export default ApprovedMerchant;