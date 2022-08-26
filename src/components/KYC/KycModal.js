import React, { useEffect } from "react"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch} from "react-router-dom"
import { Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { enableKycTab, kycModalToggle } from "../../slices/kycSlice";

export const KycModal=()=>{
  const dispatch = useDispatch();
  const history = useHistory()
  
  const {kyc } = useSelector(state=>state)

    // let { url } = useRouteMatch();
    // console.log(useRouteMatch())
    console.log("kyc.kycModalClose",kyc.kycModalClose)
  const [closeModal, setCloseModal] = useState(kyc.kycModalClose)

  const enableKycButton = (val)=>{
   
    dispatch(kycModalToggle(false));
    // setCloseModal(false)

    if(val==='yes'){
      dispatch(enableKycTab(true));
    history.push("/dashboard/kyc") 
    }else{
      history.push("/dashboard/product-catalogue") 
    }
  }


  useEffect(() => {
    setCloseModal(kyc.kycModalClose)
  }, [kyc])

  console.log("closeModal",closeModal)
  
    return (<div><div
        className="modal fade show"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{display: closeModal ? "block" : "none", opacity:"1", background: "rgba(0,0,0,0.8)"}}
      >
        <div className="modal-dialog mw-100 w-50" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="exampleModalLabel">
              Welcome to SabPaisa!
              </h2>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={()=>setCloseModal(!closeModal)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body  max-height-signup">
              <div className="term-condintion ">
                    <p>Activate your account to start receiving payments</p>
                    <p><strong>Do you want to complete KYC?</strong></p>
                </div>
            </div>
            <div className="modal-footer">
            
            <Link type="button" class="btn btn-success text-white" onClick={()=>enableKycButton("yes")}  >Yes</Link>

            <Link type="button" class="btn btn-primary"  onClick={()=>enableKycButton("later")} >Later</Link>
            </div>
          </div>
        </div>
      </div>
      </div>)
}