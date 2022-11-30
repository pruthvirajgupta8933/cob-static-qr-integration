import React, { useEffect } from "react";
import NavBar from "../dashboard/NavBar/NavBar";
import StepProgressBar from "../../_components/reuseable_components/StepProgressBar/StepProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { kycUserList } from "../../slices/kycSlice";
import API_URL from "../../config";
import axios from "axios";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import { useState } from "react";
import { toast} from "react-toastify";

function Sandbox() {
  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const [data, setData] = useState([]) 
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const kycStatus = kyc?.kycUserList?.status;

  const clientCodeOfMerchant = user.clientMerchantDetailsList[0].clientCode;
//   console.log("User Details ===>", clientCodeOfMerchant);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(kycUserList({ login_id: user?.loginId }));
  }, [user]);



  
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };


  const clientDetailRequest = async () => {

    try {
        const response = await axiosInstanceAuth.post(API_URL.CLIENT_DETAIL, {
            clientCode: clientCodeOfMerchant
        })
        setData(response.data.ClientData)

    } catch (error) {

    }
  }






  useEffect(() => {
    clientDetailRequest()

  },[])

  return (
    <section className="ant-layout Satoshi-Medium">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Integration Kit</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft w-100">
            <div className="container-fluid"></div>
          </section>

          <section className="features8 cid-sg6XYTl25a flleft w-100">
            <div className="container-fluid  p-3 my-3 ">
              <StepProgressBar status={kycStatus} />
              <div></div>
              <div className="container">
                <div className="col-lg-12 border m-1 p-2-">
                  <a
                    class="btn"
                    data-toggle="collapse"
                    href="#multiCollapseExample1"
                    role="button"
                    aria-expanded="true"
                    aria-controls="multiCollapseExample1"
                  >
                    <h2>Test Credentials </h2>
                  </a>
                  {/* <h2>Test Credentials</h2> */}
                  <form
                    class="collapse multi-collapse show"
                    id="multiCollapseExample1"
                  >
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Client Code{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputEmail3"
                          disabled="true"
                          value="LPSD1"
                        />
                      </div>
                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Username{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value="Abh789@sp"
                        />
                      </div>
                      {/* <div className="col-lg-4">
                                            <label htmlFor="inputEmail3" className="col-form-label">Password </label>
                                            <input type="text" className="form-control" id="inputEmail3" disabled="true" value="HUGZT_SP4757" />
                                        </div> */}
                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Authentication Key{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value="x0xzPnXsgTq0QqXx"
                        />
                      </div>
                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Authentication IV{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value="oLA38cwT6IYNGqb3"
                        />
                      </div>
                      <div className="col-lg-6">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Environment Base URL{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value="https://sandbox.sabpaisa.in/SabPaisa/sabPaisaInit?v=1"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="col-lg-12 border m-1 p-2-">
                  <a
                    class="btn"
                    data-toggle="collapse"
                    href="#multiCollapseExample2"
                    role="button"
                    aria-expanded="true"
                    aria-controls="multiCollapseExample2"
                  >
                    <h2>Live Credentials</h2>
                  </a>

                  <form
                    class="collapse multi-collapse show"
                    id="multiCollapseExample2"
                  >
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Client Code{" "}
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          id="inputEmail3"
                          disabled="true"
                          value={data?.clientCode ? data?.clientCode : ""}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className=" col-form-label"
                        >
                          Username{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value={data?.clientName ? data?.clientName : "" }
                        />
                      </div>

                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Authentication Key{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value={data?.authKey ? data?.authKey : "" }
                        />
                      </div>
                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Client Password
                        </label>
                        <input
                          type={
                            values.showPassword
                              ? "text"
                              : "password"
                          }
                          className="form-control"
                          id="inputPassword3"
                          name="passwordd"
                          readOnly="true"
                          value={data?.clientPassword ? data?.clientPassword : "" }
                        />
                          <div class="input-group-addon eye__Icon">
                                        <a onClick={handleClickShowPassword}>
                                          {" "}
                                          {values.showPassword ? (
                                            <i
                                              class="fa fa-eye"
                                              aria-hidden="true"
                                            ></i>
                                          ) : (
                                            <i
                                              class="fa fa-eye-slash"
                                              aria-hidden="true"
                                            ></i>
                                          )}
                                        </a>
                                      </div>
                      </div>
                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Authentication IV{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value={data?.authIV ? data?.authIV : "" }
                        />
                      </div>
                      
                      <div className="col-lg-6">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Environment Base URL{" "}
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value="https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default Sandbox;
