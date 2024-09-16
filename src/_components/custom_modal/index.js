import React, { useEffect } from "react";
import "../../components/dashboard/css/Home.css"

const CustomModal = ({ headerTitle, modalBody, modalFooter, modalToggle, fnSetModalToggle, modalSize }) => {


  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      fnSetModalToggle(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div
      className={
        "modal fade mymodals" +
        ((modalToggle) ? " show d-block" : " d-none")
      }
      id="web"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      ariaHidden="true"
    >
      <div className={`modal-dialog ${modalSize ? modalSize : 'modal-lg'}`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {headerTitle}
            </h5>
            <button
              type="button"
              className="close"
              onClick={() => fnSetModalToggle(false)}
            >
              <span ariaHidden="true">&times;</span>
            </button>
          </div>

          {modalBody && <div className="modal-body">{modalBody()}</div>}
          {modalFooter && <div className="modal-footer">{modalFooter()}</div>}
        </div>
      </div>
    </div>
  );
};
export default CustomModal;
