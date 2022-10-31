import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import API_URL ,{ AUTH_TOKEN }from "../../config";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import { kycForApproved } from "../../slices/kycSlice"
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import {axiosInstanceAuth} from "../../utilities/axiosInstance"


function ApprovedMerchant() {
  const [approveMerchant, setApproveMerchant] = useState([])
  const[approvedMerchantData,setApprovedMerchantData]=useState([])
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // const [documentId, setDocumentId] = useState("")
  // const [documentIdImg, setDocumentImg] = useState("#")
  const [docImageData,setDocImageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10);
  const [spinner, setSpinner] = useState(true);
  let page_size = pageSize;
  let page = currentPage;
 
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

  const allApprovedMerchants = async () => {
    await axiosInstanceAuth.get(`${API_URL.KYC_FOR_APPROVED}`)
      .then(res => {
        const data = res.data.results;
        // console.log(data)
        setApprovedMerchantData(data)

      })
  }
 
useEffect(() => {
    allApprovedMerchants();
    dispatch(kycForApproved({page: currentPage, page_size: pageSize})).then((resp) => {
      toastConfig.successToast("Approved Data Loaded")
      setSpinner(false)
      const data = resp.payload.results
   setApproveMerchant(data);
})
 .catch((err) => toastConfig.errorToast("Data not loaded"));
  
  }, [currentPage, pageSize]);
  
   



  /////////////////////////////////////Search filter
  useEffect(() => {
    if (searchText.length > 0) {
      setApproveMerchant(approveMerchant.filter((item) =>

        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    } else {
      dispatch(kycForApproved()).then((resp) => {
       
        const data = resp?.payload?.results
  
        setApproveMerchant(data.slice(indexOfFirstRecord, indexOfLastRecord));
  
  })
   }
  }, [searchText])
  const indexOfLastRecord = page * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const nPages = Math.ceil(approvedMerchantData.length / pageSize)
  const pageNumbers = [...Array(nPages + approvedMerchantData.length).keys()].slice(1)

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1)
    }
  }
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }



 

  // console.log("Document Id Data", docImageData)

  

  const viewDocument = async (loginMaidsterId) => {
    const res = await axiosInstanceAuth.post(API_URL.DOCUMENT_BY_LOGINID, {
      login_id: loginMaidsterId
    }).then(res => {
      if (res.status === 200) {
        const data = res.data;
        // console.log("Data ========> ", data)
        setDocImageData(data)
        const docId = data[0].documentId;
        console.log(docId,"<===== Document Id =====>")
        const file = data[0].filePath
        // console.log("file ====> ",file)
        // const ImgUrl = `${API_URL.MERCHANT_DOCUMENT}/?document_id=${docId}`;
        
        // axiosInstanceAuth.get(ImgUrl).then(res=>console.log(res))
      }
    })
      .catch(error => {
        console.error('There was an error!', error);
      });
};




 return (
    <div className="container-fluid flleft">
      <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Search</label>
        <input className='form-control' onChange={approvedSearch} type="text" placeholder="Search Here" />
      </div>
      <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Count Per Page</label>
        <select value={pageSize} rel={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))} className="ant-input" >
          <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
        </select>
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
            <th>PAN No.</th>
            <th>Status</th>
            <th>View document</th>
          </tr>
        </thead>
        <tbody>
        {spinner && (
       <Spinner/>
        )}
          {approveMerchant.length == 0 ?<tr> <td colSpan={'8'}><h1 className="nodatafound" >No data found</h1></td></tr> :
          (approveMerchant.map((user, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{user.merchantId}</td>
              <td>{user.contactNumber}</td>
              <td>{user.name}</td>
              <td>{user.emailId}</td>
              <td>{user.bankName}</td>
              <td>{user.panCard}</td>

              <td>{user.status}</td>
              {/* <td>  <button type="button" class="btn btn-primary" onClick={onClick}>View Document</button></td> */}
              <td>
                <button type="button" class="btn approve text-white btn-xs" data-toggle="modal" onClick={()=>viewDocument(user.loginMasterId)} data-target="#exampleModal">
                  View Document
                </button>


                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content" style={{width:750}}>
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>

                      </div>
                      <div class="modal-body">
                        {/* <img src={`${documentIdImg}`}  alt="doc" /> */}
    
                          {docImageData.map((merchantData) => {
        return (
          <div>
               <table id="dtDynamicVerticalScrollExample" class="table table-striped table-bordered table-sm">
                        
                        <thead>
                          <tr>      
                            <th>Document Id</th>
                            <th>Image</th> 
                            <th>Status</th> 
                          </tr>
                        </thead>
                       
                        <td>{merchantData.documentId}</td>
                        <td><img src={merchantData.filePath} alt="Document"/></td>
                        <td>{merchantData.status}</td>
                          </table>
                          </div>
                            )})}
                          
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn approve text-white btn-xs" data-dismiss="modal">Close</button>

                      </div>

                    </div>
                  </div>
                </div></td>
            </tr>

          )))}

        </tbody>
      </table>
      <nav aria-label="Page navigation example" >

<ul class="pagination w-25">
  {pageNumbers.length > 0 && <li class="page-item"><button class="page-link" onClick={handlePrevPage} >Previous</button></li>}
  {pageNumbers.slice(currentPage - 1, currentPage + 6).map((pgNumber, i) => (
    <li key={pgNumber}
      className={
        pgNumber === currentPage ? " page-item active" : "page-item"
      }>
        {/* {console.log(pageNumbers)} */}
      <a href={() => false} className={`page-link data_${i}`} >
        <span onClick={() => {
          setCurrentPage(pgNumber)
        }
        }
        >
          {pgNumber}
        </span>
      </a>
    </li>
  ))}
  {pageNumbers.length > 0 && <li class="page-item"><button class="page-link" onClick={handleNextPage} >Next</button></li>}
</ul>
</nav>

    </div>
    </div>



  );
}

export default ApprovedMerchant;