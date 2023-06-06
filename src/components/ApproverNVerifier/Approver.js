import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import PendingVerification from "./PendingVerification";
import VerifiedMerchant from "./VerifiedMerchant";
import ApprovedMerchant from "./ApprovedMerchant";
import NavBar from "../../components/dashboard/NavBar/NavBar";
import PendindKyc from "./PendindKyc";
import NotFilledKYC from "./NotFilledKYC";
import RejectedKYC from "./RejectedKYC";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import { logout } from "../../slices/auth";
import { merchantTab } from "../../slices/approverVerifierTabSlice";
import classes from "./approver.module.css"

const Approver = () => {
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
  // console.log(verifierApproverTab?.currenTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab);

  const [users, setUsers] = useState();
  // console.log("currenTab",currenTab)
  const dispatch = useDispatch();

  let history = useHistory();

  let roles = roleBasedAccess();

  const loggedUser = roleBasedAccess();

  useEffect(() => {
    if (loggedUser?.approver || loggedUser?.verifier || loggedUser?.viewer) {
      // console.log(" valid")
    } else {
      // console.log("not valid")
      dispatch(logout());
    }
  }, [loggedUser]);

  const redirect = () => {
    history.push("/dashboard/onboard-merchant");
  };

  const handleTabClick = (currenTab) => {
    dispatch(merchantTab(currenTab));
  };


  return (
    <section>
      <main >
        <div className="container-fluid">
          <div className="row">
            <div className="col-6">
              <h5>
                Merchant List
              </h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              {roles?.viewer === true ? (
                <></>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm cob-btn-primary "
                  onClick={() => redirect()}
                >
                  Onboard Merchant
                </button>
              )}
            </div>
          </div>

          <section>
            <div className="row mt-5">
              <div className="col-lg-12 mb-4">
                <ul className="nav nav-tabs approv">
                  <li className="nav-item ">
                    <a
                      href={() => false}
                      className={`nav-link  ${currenTab === 1 ? "activepaylink" : "inactive"} ${classes.cursor_pointer}`}
                      onClick={() => handleTabClick(1)}
                    >
                      Not Filled KYC
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href={() => false}
                      className={`nav-link  ${currenTab === 2 ? "activepaylink" : "inactive"} ${classes.cursor_pointer}`}

                      onClick={() => handleTabClick(2)}
                    >
                      Pending KYC
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href={() => false}
                      className={`nav-link  ${currenTab === 3 ? "activepaylink" : "inactive"} ${classes.cursor_pointer}`}

                      onClick={() => handleTabClick(3)}
                    >
                      Pending Verification
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href={() => false}
                      className={`nav-link  ${currenTab === 4 ? "activepaylink" : "inactive"} ${classes.cursor_pointer}`}

                      onClick={() => handleTabClick(4)}
                    >
                      Pending Approval
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href={() => false}
                      className={`nav-link  ${currenTab === 5 ? "activepaylink" : "inactive"} ${classes.cursor_pointer}`}

                      onClick={() => handleTabClick(5)}
                    >
                      Approved
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href={() => false}
                      className={`nav-link  ${currenTab === 6 ? "activepaylink" : "inactive"} ${classes.cursor_pointer}`}

                      onClick={() => handleTabClick(6)}
                    >
                      Rejected
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </section>

          <section>

            <div className="row">
              {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                lazy dog.The quick brown fox jumps over the lazy dog.</p> */}

              {(currenTab === 1 && <NotFilledKYC />) ||
                (currenTab === 2 && <PendindKyc />) ||
                (currenTab === 3 && <PendingVerification />) ||
                (currenTab === 4 && <VerifiedMerchant />) ||
                (currenTab === 5 && <ApprovedMerchant />) ||
                (currenTab === 6 && <RejectedKYC />) || (
                  <NotFilledKYC />
                )}
            </div>
          </section>
        </div>
      </main>
    </section>
  );
};

export default Approver;
