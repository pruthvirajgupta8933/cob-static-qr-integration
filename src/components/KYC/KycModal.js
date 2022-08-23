import React from "react"
import { Link, useRouteMatch} from "react-router-dom"

export const KycModal=()=>{
    let { url } = useRouteMatch();
    // console.log(useRouteMatch())
    return (<div><div
        className="modal fade show"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{display: true ? "block" : "none", opacity:"1", background: "rgba(0,0,0,0.8)"}}
      >
        <div className="modal-dialog mw-100 w-50" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="exampleModalLabel">
                Complete KYC
              </h2>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                // onClick={()=>onChangeHandler()}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body  max-height-signup">
              <div className="term-condintion ">
                    <h3 className=""></h3>
                    <p><strong>Do you want to complete KYC?</strong></p>
                </div>
            </div>
            <div className="modal-footer">
            
            <Link type="button" class="btn btn-success text-white" to={`/dashboard/kyc`} >Yes</Link>
            <Link type="button" class="btn btn-primary" to={`/dashboard/product-catalogue`}>Later</Link>
            </div>
          </div>
        </div>
      </div>
      </div>)
}