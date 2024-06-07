import React, { useState } from "react";
import toastConfig from "../../../utilities/toastTypes";
import _ from "lodash";
import CustomModal from "../../../_components/custom_modal";
import { frmPushMerchantData } from "../../../services/approver-dashboard/frm/frm.service";
import { useDispatch } from "react-redux";
import { checkFrmPushData } from "../../../slices/approver-dashboard/frmSlice";


const FrmStatusModal = (props) => {
  const { commentData } = props
  const login_id = commentData?.loginMasterId
  
  const [frmCheckData, setFrmCheckData] = useState({})
  const [disable, setDisable] = useState(false)
  const [show, setShow] = useState(false)
  const dispatch = useDispatch();

  const handleClick = () => {
    setDisable(true)
    const postData = {
      login_id: parseInt(login_id)
    }
    dispatch(checkFrmPushData(postData)).then((res) => {
      if ( res.meta.requestStatus === 'fulfilled') {
        const data = res?.payload?.result
        setFrmCheckData(data)
        toastConfig.successToast(res?.payload?.message)
        setDisable(false)
        setShow(true)
      } else {
        toastConfig.errorToast(res?.payload)
        setDisable(false)
      }
    }).catch(() => {
      setDisable(false)
      setShow(false)
    })
  }



  const modalbody = () => {
    return (
      <div className="container-fluid">
        <div>
          <h6>
            Merchant Name: {props?.commentData?.name}
          </h6>
          <h6>
            Client Code: {props?.commentData?.clientCode}
          </h6>

        </div>

        <div className="mt-3">
          <button disabled={disable} type="button"
            onClick={handleClick}
            className="btn cob-btn-primary approve text-white">
            {disable && (
              <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
            )}
            Check FRM</button>
        </div>


        {disable ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          show &&
          <table class="table mt-3">
            <thead>
              <tr>
                <th scope="col">Account Holder Name</th>
                <th>Client Name</th>
                <th>Account Number</th>
                <th scope="col">Bank Name</th>
                <th>FRM Message</th>
                <th>Factum range</th>
                <th>FRM Valid</th>
                <th>FRM Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td >{frmCheckData?.accountHolderName}</td>
                <td>{frmCheckData?.clientName}</td>
                <td>{frmCheckData?.accountNumber}</td>
                <td>{frmCheckData?.bankName}</td>
                <td>{frmCheckData?.frm_message}</td>
                <td>{frmCheckData?.factum_range}</td>
                <td>{frmCheckData?.is_frm_valid === true ? "Yes" : "NO"}</td>
                <td>{frmCheckData?.frm_status}</td>
              </tr>

            </tbody>
          </table>
        )}
      </div>)
  };

  const modalFooter = () => {
    return (
      <button
        type="button"
        className="btn btn-secondary text-white btn-sm"
        data-dismiss="modal"
        onClick={() => {

          props?.setModalState(false);
        }}
      >
        Close
      </button>

    );
  };

  return (
    <>
      <CustomModal modalBody={modalbody} headerTitle={"Merchant FRM Score"} modalFooter={modalFooter} modalToggle={props?.isModalOpen} fnSetModalToggle={props?.setModalState} />
    </>

  );
};

export default FrmStatusModal;
