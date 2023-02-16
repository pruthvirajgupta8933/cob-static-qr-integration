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
import UseAxiosPrivate from "../../customHooks/useAxiosPrivate";
import UserService from "../../services/test-service";
import axios from "axios";
import { CleaningServices } from "@mui/icons-material";
import toastConfig from "../../utilities/toastTypes";
import { fetchTestSlice } from "../../slices/test-slice";
// import UserService from "../../services/user.service";

const Approver = () => {
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
  const currenTab = parseInt(verifierApproverTab?.currenTab);

  const [users, setUsers] = useState();
  const axiosPrivate = UseAxiosPrivate();

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

  // dummy api call
  // useEffect(() => {
  //   let isMounted = true;
  //   const controller = new AbortController();
  //   const url = "http://localhost:2020/v1/books";
  //   console.log("books");

  useEffect(() => {
    getUsers();
  }, []);
  const getUsers = () => {
    console.log("running")
    UserService.getUserBoard().then((res) => {
      console.log(res,'books');
      setUsers(res.data.books)
    });
  };
  //   // getUsers();

  //   // return () => {
  //   //   isMounted = false;
  //   //   controller.abort();
  //   // };
  // }, []);

  // console.log(TestService, "service");

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">
              Merchant List
              {/* <button onClick={getUsers}>Press</button> */}
            </h1>
            <div className="container">
              <div className="row">
                <div className="mr-5"></div>
                {roles?.viewer === true ? (
                  <></>
                ) : (
                  <button
                    type="button"
                    className="btn"
                    style={{ background: "#012167", color: "white" }}
                    onClick={() => redirect()}
                  >
                    Onboard Merchant
                  </button>
                )}
              </div>
              <ul>
                {users &&
                  users?.map((data) => {
                    return (
                      <>
                        <li>{data?.title}</li>
                      </>
                    );
                  })}
              </ul>
            </div>
          </div>
          <section
            className="features8 cid-sg6XYTl25a flleft-"
            id="features08-3-"
          >
            <div className="container-fluid">
              <div className="row bgcolor">
                <div className="col-lg-12 mb-4 bgcolor-">
                  <ul className="nav nav-tabs approv">
                    <li className="nav-item ">
                      <a
                        href={() => false}
                        className={
                          "nav-link " +
                          (currenTab === 1 ? "activepaylink" : "inactive")
                        }
                        onClick={() => handleTabClick(1)}
                      >
                        Not Filled KYC
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href={() => false}
                        className={
                          "nav-link " +
                          (currenTab === 2 ? "activepaylink" : "inactive")
                        }
                        onClick={() => handleTabClick(2)}
                      >
                        Pending KYC
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href={() => false}
                        className={
                          "nav-link " +
                          (currenTab === 3 ? "activepaylink" : "inactive")
                        }
                        onClick={() => handleTabClick(3)}
                      >
                        Pending Verification
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href={() => false}
                        className={
                          "nav-link " +
                          (currenTab === 4 ? "activepaylink" : "inactive")
                        }
                        onClick={() => handleTabClick(4)}
                      >
                        Pending Approval
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href={() => false}
                        className={
                          "nav-link " +
                          (currenTab === 5 ? "activepaylink" : "inactive")
                        }
                        onClick={() => handleTabClick(5)}
                      >
                        Approved
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href={() => false}
                        className={
                          "nav-link " +
                          (currenTab === 6 ? "activepaylink" : "inactive")
                        }
                        onClick={() => handleTabClick(6)}
                      >
                        Rejected
                      </a>
                    </li>
                  </ul>
                </div>

                <section
                  className="features8 cid-sg6XYTl25a flleft col-lg-12"
                  id="features08-3-"
                >
                  <div className="container-fluid">
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
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
};

export default Approver;
