import React,{useEffect, useState} from 'react'
import axios from "axios"
import _ from 'lodash';
import API_URL from '../../../config';
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../../_components/formik/FormikController';
import Regex,{RegexMsg} from '../../../_components/formik/ValidationRegex';




  

function TransactionEnqMultiParam() {

  const [txnList,SetTxnList] = useState([])
  const [searchText,SetSearchText] = useState('')
  const [show, setShow] = useState('')
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [showData,setShowData] = useState([])
  const [pageCount,setPageCount] = useState(0);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);
  const [atLeastOneFieldReq,setAtLeastOneFieldReq] = useState(false);



  const [transactionId,setTransactionID] = useState("")

  console.log(transactionId)
  const initialValues = {
    txnID : "",
    fname: "",
    lname: "",
    pemail: "",
    pmob: "",
    pyeeamount: "",
    pclientname: ""
  }

  const validationSchema =  Yup.object().shape({
    txnID: Yup.number().positive(),
    fname: Yup.string().matches(Regex.acceptAlphabet,RegexMsg.acceptAlphabet),
    lname: Yup.string().matches(Regex.acceptAlphabet,RegexMsg.acceptAlphabet),
    pemail: Yup.string().email("Invalid email"),
    pmob: Yup.string().matches(Regex.acceptNumber,RegexMsg.acceptNumber),
    pyeeamount: Yup.number(),
    pclientname: Yup.string().matches(Regex.acceptAlphaNumeric,RegexMsg.acceptAlphaNumeric)
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
 
 }, [currentPage])

 
useEffect(() => {
  // console.log("length",txnList.length);
  txnList.length > 0 ? setShow(true) : setShow(false)
//  console.log("show",show)

}, [txnList])


useEffect(() => {
  if(searchText !== ''){
    setShowData( txnList.filter((txnItme)=>
        Object.values(txnItme).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    }
    else{
      setShowData(txnList)
    }

}, [searchText])


//  if ( pageCount === 1) return null;

const pages = _.range(1, pageCount + 1)
// console.log("pages",pages)


const onSubmit = (value)=>{
    console.log("value",value);
    let flag;
    if( value.txnID ===""  &&  
        value.fname ===""  && 
        value.lname ===""  && 
        value.pemail ==="" && 
        value.pmob === ""  &&
        value.pyeeamount ==="" && 
        value.pclientname ==="" ){
          flag = 1    
            setAtLeastOneFieldReq(true)
    }else{
         flag = 0
            setAtLeastOneFieldReq(false)
    }
  
    if(flag===0){
        setLoading(true)
        const URL = `${API_URL.ViewTxnEnqMultiParam}/${value.txnID ==="" ? "ALL" : value.txnID}/${value.fname ==="" ? "ALL" : value.fname }/${value.lname ==="" ? "ALL" : value.lname }/${value.pemail===""?"ALL":value.pemail}/${value.pmob ==="" ? "ALL" : value.pmob }/${value.pyeeamount ==="" ? "ALL" : value.pyeeamount }/${value.pclientname ==="" ? "ALL" : value.pclientname }`;
        axios.get(URL)
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
    
console.log("atLeastOneFieldReq",atLeastOneFieldReq)
//   return () => {
//     second
//   }
}, [atLeastOneFieldReq])




  return (
    
    <section className="ant-layout">
    <div class="profileBarStatus mb-0"></div>
      <main className="gx-layout-content ant-layout-content" style={{background: "white"}}>
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">View Transactions Enquiry </h1>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft" id="features08-3-">
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
                    <div className="row">
                        <div className="col-lg-4 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Transaction ID"
                                name="txnID"
                                className="ant-input"
                            />
                        </div>
                        <div className="col-lg-4 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="First Name"
                                name="fname"
                                className="ant-input"
                            />
                        </div>
                        <div className="col-lg-4 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Last Name"
                                name="lname"
                                className="ant-input"
                            />
                        </div>
                        <div className="col-lg-4 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Payer Email"
                                name="pemail"
                                className="ant-input"
                            />
                        </div>
                        <div className="col-lg-4 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Payer Mobile"
                                name="pmob"
                                className="ant-input"
                            />
                        </div>
                        <div className="col-lg-4 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Payer Amount"
                                name="pyeeamount"
                                className="ant-input"
                            />
                        </div>
                        <div className="col-lg-4 mrg-btm- bgcolor">
                            <FormikController
                                control="input"
                                type="text"
                                label="Payer Client Name"
                                name="pclientname"
                                className="ant-input"
                            />
                        </div>

                        <div className="col-lg-4 mrg-btm- bgcolor">
                        <button type="submit" className="view_history topmarg" disabled={loading}>
                            {loading ? <><span class="spinner-border spinner-border-sm"></span>
                                &nbsp; Loading... </> : <> Submit</>}  
                          </button> 
                        </div>
                    </div>
                    </Form>
                 )}
                </Formik>

                {paginatedata.length>0 ?
                <div className="row">
                <div className="col-lg-4 mrg-btm- bgcolor">
                    <label>Search Here</label>
                    <input type="text" className="ant-input" placeholder="Search here" onChange={(e)=>{SetSearchText(e.target.value)}} />
                </div>

                <div className="col-lg-4 mrg-btm- bgcolor">
                  <label>Count per page</label>
                  <select value={pageSize} rel={pageSize} className="ant-input" onChange={(e) =>setPageSize(parseInt(e.target.value))} >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="500">500</option>
                </select>
                </div>
                </div> : <></>}
            </div>
          </section>


          <section className="" >
          <div class="container-fluid  p-3 my-3 ">

          {paginatedata.length>0 ? <h4>Total Record : {txnList.length} </h4> : <></>}
              
            <div class="scroll"  style={{"overflow": "auto"}}>
            <table class="table table-bordered">
              <thead>
              {paginatedata.length>0 ?
                      <tr>
                            <th> S.No </th>
                            <th> Trans ID </th>
                            <th> Client Trans ID </th>
                            <th> Payer Amount </th>
                            <th> Paid Amount </th>
                            <th> Trans Initiation Date </th>
                            <th> Trans Complete Date </th>
                            <th> Payment Status </th>
                            <th> Payer Name </th>
                            <th> Payer Mob number </th>
                            <th> Payer Email </th>
                            <th> Client Code </th>
                            <th> Payment Mode </th>
                            <th> Bank Txn Id </th>
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
                            <td>{Number.parseFloat(item.payee_amount).toFixed(2)}</td>
                            <td>{Number.parseFloat(item.paid_amount).toFixed(2)}</td>
                            <td>{item.trans_date}</td>
                            <td>{item.trans_complete_date}</td>
                            <td>{item.status}</td>
                            <td>{item.payee_name}</td>
                            <td>{item.payee_mob}</td>
                            <td>{item.payee_email}</td>
                            <td>{item.client_code}</td>
                            <td>{item.payment_mode}</td>
                            <td>{item.bank_txn_id}</td>
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
      
                   <a className="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1) } href={void(0)}>Previous</a>
                    { 
                      pages.slice(currentPage-1,currentPage+6).map((page,i) => (
                        <li className={
                          page === currentPage ? " page-item active" : "page-item"
                        }> 
                      {/* {console.log("currentPage",currentPage)} */}
                      {/* {console.log("page",page)} */}
                            <a className={`page-link data_${i}`} >  
                              <p onClick={() => pagination(page)}>
                              {page}
                              </p>
                            </a>
                        </li>
                      
                      ))
                    }
                { pages.length!==currentPage? <a className="page-link"  onClick={(nex) => setCurrentPage((nex) => nex === pages.length>9 ? nex : nex + 1)} href={void(0)}>
                      Next</a> : <></> }
                    </ul>
                  </nav>
                  : <></> }
                  </div>
                  <div className="container">
                    
                { error && showData?.length <= 0 ? 
                <div className='showMsg'>No Data Found</div>
                  :
                    <div></div>}  
                </div>
          </div>
          </section>
        </div>

        <footer className="ant-layout-footer">
          <div className="gx-layout-footer-content">
            © 2021 Ippopay. All Rights Reserved.{" "}
            <span className="pull-right">
              Ippopay's GST Number : 33AADCF9175D1ZP
            </span>
          </div>
        </footer>
      </main>
    </section>
  )
}

export default TransactionEnqMultiParam