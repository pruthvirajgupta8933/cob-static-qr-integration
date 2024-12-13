import { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";

const PasswordExpiry = () => {
  const { user } = useSelector((state) => state.auth);
  const pswUpdatedDuration =
    (new Date() - new Date(user.password_updated_at)) / (24 * 3600 * 1000);

  const [isModalOpen, setModalOpen] = useState(pswUpdatedDuration > 80);

  return (
    <div
      className={`modal fade mymodals ${
        isModalOpen ? "show d-block" : "d-none"
      }`}
    >
      <div className="modal-dialog modal-dialog-centered " role="document">
        <div className="modal-content py-3">
          <div className="modal-header border-0 py-0">
            <h6 className="text-primary">
              <i class="fa fa-hourglass-half px-2"></i>Important information
            </h6>
            <button
              type="button"
              onClick={() => {
                setModalOpen(!isModalOpen);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-9 text-align-end">
                Your Password will expire in{" "}
                {90 - Math.round(pswUpdatedDuration)} days. Please reset as soon
                as possible.
              </div>
              <div className="col-3 text-align-end">
                <Link to={`/reset/${window.location.search}`}>
                  <button className="btn-xs cob-btn-primary border-0 p-2">
                    Reset Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordExpiry;
