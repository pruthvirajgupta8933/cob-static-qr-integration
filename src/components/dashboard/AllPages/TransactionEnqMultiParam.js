import React,{useEffect, useState} from 'react'
import axios from "axios"
import _ from 'lodash';
import API_URL from '../../../config';
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../../_components/formik/FormikController';
import {Regex ,RegexMsg} from '../../../_components/formik/ValidationRegex';
import DropDownCountPerPage from '../../../_components/reuseable_components/DropDownCountPerPage';
import PrintDocument from '../../../_components/reuseable_components/PrintDocument';
import { axiosInstance } from '../../../utilities/axiosInstance';



  

function TransactionEnqMultiParam() {

  const [txnList,SetTxnList] = useState([])
  const [searchText,SetSearchText] = useState('')
  // const [show, setShow] = useState('')
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [showData,setShowData] = useState([])
  const [pageCount,setPageCount] = useState(0);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);
  const [atLeastOneFieldReq,setAtLeastOneFieldReq] = useState(false);
  const [toggleModal,setToggleModal] = useState(false);
  const [viewTxnId,setViewTxnId] = useState(null);
  const [tempList,setTempList] = useState({})
  const [printData,setPrintData]= useState([])




  const initialValues = {
    spTxnID : "",
    clientTxnID: "",
    pemail: "",
    pmob: ""
  }

  const validationSchema =  Yup.object().shape({
    spTxnID: Yup.number().positive(),
    clientTxnID: Yup.string(),
    pemail: Yup.string().email("Invalid email"),
    pmob: Yup.string().matches(Regex.acceptNumber,RegexMsg.acceptNumber)
  })


  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  }



  useEffect(()=>{
     setPaginatedData(_(showData).slice(0).take(pageSize).value())
     setPageCount(showData.length>0 ? Math.ceil(showData.length/pageSize) : 0)

 },[pageSize,showData]);

 useEffect(() => {
  //  console.log("page chagne no")
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPost = _(showData).slice(startIndex).take(pageSize).value();
   setPaginatedData(paginatedPost);
 
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [currentPage])

 
// useEffect(() => {
//   // console.log("length",txnList.length);
//   // txnList.length > 0 ? setShow(true) : setShow(false)
// //  console.log("show",show)

// }, [txnList])


useEffect(() => {
  if(searchText !== ''){
    setShowData( txnList.filter((txnItme)=>
        Object.values(txnItme).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    }
    else{
      setShowData(txnList)
    }

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchText])


//  if ( pageCount === 1) return null;

const pages = _.range(1, pageCount + 1)
// console.log("pages",pages)


const onSubmit = (value)=>{
    let flag;
    if( value.spTxnID ===""  && 
        value.clientTxnID ===""  && 
        value.pemail ==="" && 
        value.pmob === ""  ){
          flag = 1    
            setAtLeastOneFieldReq(true)
    }else{
         flag = 0
            setAtLeastOneFieldReq(false)
    }
  
    if(flag===0){
        setLoading(true)
        //https://adminapi.sabpaisa.in/Enquiry/ViewTxnEnqMultiParam/{txnID}/{CltTxnID}/{pemail}/{pmob}
        const URL = `${API_URL.ViewTxnEnqMultiParam}/${value.spTxnID ==="" ? "ALL" : value.spTxnID}/${value.clientTxnID ==="" ? "ALL" : value.clientTxnID }/${value.pemail===""?"ALL":value.pemail}/${value.pmob ==="" ? "ALL" : value.pmob }`;
        axiosInstance.get(URL)
        .then(res=>{
            setShowData(res.data)
            SetTxnList(res.data)
            setPaginatedData(_(res.data).slice(0).take(pageSize).value())
            setLoading(false);
            if(res.data.length<=0){
                setError(true)
            }
            
        }).catch(
            err=>{console.log(err)
                setShowData([])
                SetTxnList([])
                setPaginatedData([])
                setLoading(false);
                setError(true)
            }
        )
    } 

  

}


useEffect(() => {
  if(viewTxnId!==null){
    setTempList(paginatedata[viewTxnId])
    const data = paginatedata[viewTxnId]
     const tempArr = [
      {key: 'Txn Id', value: data.txn_id},
      {key: 'Payment Mode', value: data.payment_mode},
      {key: 'Payee Name', value: data.payee_name},
      {key: 'Payee Mobile', value: data.payee_mob},
      {key: 'Payee Email', value: data.payee_email},
      {key: 'Status ', value: data.status},
      {key: 'Bank Txn Id', value: data.bank_txn_id},
      {key: 'Client Name', value: data.client_name},
      {key: 'Client Id', value: data.client_id},
      {key: 'Payee Amount', value: data.payee_amount},
      {key: 'Paid Amount', value: data.paid_amount},
      {key: 'Trans Date', value: data.trans_date},
      {key: 'Trans Complete Date', value: data.trans_complete_date},
      {key: 'Client Code ', value: data.client_code},
      {key: 'Client Txn Id', value: data.client_txn_Id},
    ]  
    setPrintData(tempArr)


  }else{
    setTempList({})
  }
  
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [viewTxnId])


const  printFn = async ()=>{
   
  var tableContents = document.getElementById("print_docuement").innerHTML;
  var a = window.open('', '', 'height=900, width=900');
  a.document.write(tableContents);
  a.document.close();
  await a.print();
} 

  return (
    <section className="ant-layout">
      
      <PrintDocument data={printData} />

      {/* Modal */}
      <div
        className="modal"
        id="exampleModalCenter"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
        style={{display: toggleModal ? "block": "none"}}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Transaction Details
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={()=>{
                  setToggleModal(false)
                  setViewTxnId(null)
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">

            <table
                cellSpacing={0}
                cellPadding={10}
                border={0}
                width="100%"
                className="tables"
                id="enquiry"
              >
              {viewTxnId!==null ? <tbody>
                  <tr>
                    <td>Sabpaisa Txn Id:</td>
                    <td className="bold">
                      <b>{tempList.txn_id}</b>
                    </td>
                    <td>Client Txn Id:</td>
                    <td className="bold">
                      <b>{tempList.client_txn_Id}</b>
                    </td>
                    <td>Payment Mode :</td>
                    <td className="bold">
                      <b>{tempList.payment_mode}</b>
                    </td>
                   
                  </tr>
                  <tr>
                  <td>Payer Name :</td>
                    <td className="bold">
                      <b>{tempList.payee_name}</b>
                    </td>
                    <td>Payer Mobile:</td>
                    <td className="bold">
                      <b>{tempList.payee_mob}</b>
                    </td>
                    <td>Payer Email :</td>
                    <td className="bold">
                      <b>{tempList.payee_email}</b>
                    </td>
                   
                  </tr>
                  <tr>
                  <td>Status :</td>
                    <td className="bold">
                      <b>{tempList.status}</b>
                    </td>
                    <td>Bank Txn Id :</td>
                    <td className="bold">
                    <b>{tempList.bank_txn_id}</b>
                    </td>
                    <td>Client Name :</td>
                    <td>
                      <b>{tempList.client_name}</b>
                    </td>
                   
                  </tr>
                  <tr>
                  <td>Client Id : </td>
                    <td className="bold">
                      <b>{tempList.client_id}</b>
                    </td>
                    <td>Payer Amount :</td>
                    <td className="bold">
                      <b>{Number.parseFloat(tempList.payee_amount).toFixed(2)}</b>
                    </td>
                    <td>Paid Amount :</td>
                    <td className="bold">
                      <b>{Number.parseFloat(tempList.paid_amount).toFixed(2)}</b>
                    </td>
                   
                  </tr>
                  <tr>
                  <td>Txn Date :</td>
                    <td className="bold">
                      <b>{tempList.trans_date}</b>
                    </td>
                    <td>Trans Complete Date :</td>
                    <td className="bold">
                  
                      <b>{tempList.trans_complete_date}</b>
                    </td>
                    <td> Client Code :</td>
                    <td className="bold">
                      <b>{tempList.client_code}</b>
                    </td>
                    
                  </tr>
                </tbody> 
                :
                <>Data Not Found</>
                 }
                
              </table>

            
            
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                onClick={()=>printFn()}
              >
                Print
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={()=>{
                  setToggleModal(false)
                  setViewTxnId(null)
                  }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    

    <div className="profileBarStatus mb-0"></div>
      <main className="gx-layout-content ant-layout-content" style={{background: "white"}}>
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">View Transactions Enquiry </h1>
          </div>
          <section className="features8 cid-sg6XYTl25a" id="features08-3-">
            <div className="container-fluid">
            <div className="row">
            <div className="col-lg-12">
                {atLeastOneFieldReq ? <h4 className="text-danger">At Least One Field Required</h4> : <></>}
            </div>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(onSubmit)}
                >
                 {formik => (
                    <Form>
                    <div className="row w-100">
                        <div className="col-lg-3 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Sabpaisa Transaction ID"
                                name="spTxnID"
                                className="ant-input"
                            />
                        </div>
                        <div className="col-lg-3 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Client Transaction ID"
                                name="clientTxnID"
                                className="ant-input"
                            />
                        </div>

                        <div className="col-lg-3 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Payer Email"
                                name="pemail"
                                className="ant-input"
                            />
                        </div>
                        <div className="col-lg-3 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Payer Mobile"
                                name="pmob"
                                className="ant-input"
                            />
                        </div>
                        </div>

                        <div className="row w-100">
                        
                        </div>

                        <div className="row">
                        <div className="col-lg-12 mrg-btm- bgcolor">
                        <button type="submit" className="view_history topmarg" disabled={loading}>
                            {loading ? <><span className="spinner-border spinner-border-sm"></span>
                                &nbsp; Loading... </> : <> Submit</>}  
                          </button> 
                        </div>
                    </div>
                    </Form>
                 )}
                </Formik>

                {txnList.length>0 ?
                <div className="row">
                <div className="col-lg-4 mrg-btm- bgcolor">
                    <label>Search Here</label>
                    <input type="text" className="ant-input" placeholder="Search here" onChange={(e)=>{SetSearchText(e.target.value)}} />
                </div>

                <div className="col-lg-4 mrg-btm- bgcolor">
                  <label>Count per page</label>
                  <select value={pageSize} rel={pageSize} className="ant-input" onChange={(e) =>setPageSize(parseInt(e.target.value))} >
                      <DropDownCountPerPage datalength={txnList.length} />
                </select>
                </div>
                </div> : <></>}
            </div>
          </section>


          <section className="" >
          <div className="container-fluid  p-3 my-3 ">

          {paginatedata.length>0 ? <h4>Total Record : {txnList.length} </h4> : <></>}
              
            <div className="scroll"  style={{"overflow": "auto"}}>
            <table className="table table-bordered">
              <thead>
              {paginatedata.length>0 ?
                      <tr>
                            <th> S.No </th>
                            <th> Trans ID </th>
                            <th> Client Trans ID </th>
                            <th> Paid Amount </th>
                            <th> Payment Status </th>
                            <th> Payer Name </th>
                            <th> Payer Email </th>
                            <th>  </th>
                           
                          </tr>:
                          <></>
                      }
              </thead>
              <tbody>
              {paginatedata.length>0 && paginatedata.map((item,i)=>{return(
                            <tr key={i}>
                            <td>{i+1}</td>
                            <td>{item.txn_id}</td>
                            <td>{item.client_txn_Id}</td>
                            <td>{Number.parseFloat(item.paid_amount).toFixed(2)}</td>
                            <td>{item.status}</td>
                            <td>{item.payee_name}</td>
                            <td>{item.payee_email}</td>
                            <td>
                              <button className="btn btn-primary" onClick={()=>{
                              setToggleModal(!toggleModal)
                              setViewTxnId(i)
                              
                              }}> View</button></td>
                          </tr>
                        );
                      })}
              </tbody>
            </table>
            </div>  
            
            <div>
               {/* {console.log("show",show)} */}
                {paginatedata.length>0  ? 
                    <nav aria-label="Page navigation example"  >
                    <ul className="pagination">
                  <a className="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1) } href={()=>false}>Previous</a>
                    { 
                      pages.slice(currentPage-1,currentPage+6).map((page,i) => (
                        <li className={
                          page === currentPage ? " page-item active" : "page-item"
                        } key={i}> 
                      {/* {console.log("currentPage",currentPage)} */}
                      {/* {console.log("page",page)} */}
                            <a href={()=>false} className={`page-link data_${i}`} >  
                              <p onClick={() => pagination(page)}>
                              {page}
                              </p>
                            </a>
                        </li>
                      
                      ))
                    }
                { pages.length!==currentPage? <a className="page-link"  onClick={(nex) => setCurrentPage((nex) => nex === (pages.length>9) ? nex : nex + 1)} href={()=>false}>
                      Next</a> : <></> }
                    </ul>
                  </nav>
                  : <></> }
                  </div>
                  <div className="container">
                    
                { error && showData?.length <= 0 ? 
                <div className='showMsg'>Data Not Found</div>
                  :
                    <div></div>}  
                </div>
          </div>
          </section>
        </div>

      </main>
    </section>
  )
}

export default TransactionEnqMultiParam