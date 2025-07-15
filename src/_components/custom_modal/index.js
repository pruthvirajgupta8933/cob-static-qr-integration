import React, { useEffect } from "react";
import "../../components/dashboard/css/Home.css"

const CustomModal = ({ headerTitle, modalBody, modalFooter, modalToggle, fnSetModalToggle, modalSize, setRequestPayload, resetPayload, Setshow }) => {


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

  const handleClick = () => {
    fnSetModalToggle(false);
    if (resetPayload) {
      setRequestPayload(null);
      Setshow(false)
    }
  };

  return (
    <div
      className={
        "modal fade mymodals" +
        ((modalToggle) ? " show d-block" : " d-none")
      }
      id="web"

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
              onClick={() => handleClick()}
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
