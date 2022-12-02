import React, { useState, useEffect } from "react";
import {
  kycUserList,
  kycDocumentUploadList,
} from "../../../../slices/kycSlice";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";

const KycDetailsModal = (props) => {
  let merchantKycId = props.kycId;
  const [userList, setUserList] = useState([]);
  const [docList, setDocList] = useState([]);

  console.log(merchantKycId, "Props =======>");

  const dispatch = useDispatch();
  const roles = roleBasedAccess();

  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;

  //------------------------------------------------------------------

  //------------- Kyc  User List ------------//
  useEffect(() => {
    dispatch(kycUserList({ login_id: merchantKycId })).then((resp) => {
      console.log("Response User List======> ", resp);
      setUserList(resp.payload);
    });
  }, [merchantKycId]);

  //-----------------------------------------//

  //-----------Kyc Document Upload List ------//

  useEffect(() => {
    dispatch(kycDocumentUploadList({ login_id: merchantKycId })).then(
      (resp) => {
        console.log("Response Doc List  ======> ", resp);
        setDocList(resp.payload);
      }
    );
  }, [merchantKycId]);

  //--------------------------------------//

  return (
    <div
      class="modal fade"
      id="kycmodaldetail"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title font-weight-bold" id="kycmodaldetail">
              Merchant KYC Details
            </h3>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <div class="col-sm">
                  <h3 className="font-weight-bold">Merchant Contact Info</h3>
                </div>
              </div>
              <form class="form-inline">
              <label for="inputPassword2" className="col-form-label font-weight-bold">
                <h4 className="font-weight-bold"> Merchant Name</h4>
              
                  </label>
                
                <div class="form-group mx-sm-3 mb-2">
                 
                  <input
                    type="password"
                    class="form-control"
                    id="inputPassword2"
                    disabled="true"
                    value={""}
                   
                  />
                </div>
              
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycDetailsModal;
