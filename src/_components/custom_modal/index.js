import React from "react";

const CustomModal = ({ headerTitle, modalBody, modalFooter }) => {
  return (
    <div
      className="mymodals modal fade"
      id="web"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {headerTitle && headerTitle} <i className="fa fa-pencil"></i>{" "}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
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
