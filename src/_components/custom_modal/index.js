import React from "react";

const CustomModal = ({ headerTitle, modalBody, modalFooter, modalToggle, fnSetModalToggle }) => {

  return (
    <div
      className={
          "modal fade mymodals" +
          (modalToggle ? " show d-block" : " d-none")
        }
      id="web"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {headerTitle && headerTitle} 
            </h5>
            <button
              type="button"
              className="close"
              onClick={()=>fnSetModalToggle(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {modalBody && <div className="modal-body">{modalBody()}</div>}
          {modalFooter && <div class="modal-footer">{modalFooter()}</div>}
        </div>
      </div>
    </div>
  );
};
export default CustomModal;
