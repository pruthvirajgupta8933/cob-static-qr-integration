import React, { useEffect,useState } from "react";
import NavBar from "../dashboard/NavBar/NavBar";
import StepProgressBar from "../../_components/reuseable_components/StepProgressBar/StepProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { kycUserList } from "../../slices/kycSlice";
import API_URL, { APP_ENV } from "../../config";

import { axiosInstanceAuth, axiosInstanceJWT } from "../../utilities/axiosInstance";


function Sandbox() {
  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const [data, setData] = useState([]) 
  const [selectedPlan, setSelectedPlan] = useState([]) 
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const kycStatus = kyc?.kycUserList?.status;

  const clientCodeOfMerchant = user.clientMerchantDetailsList && user.clientMerchantDetailsList[0]?.clientCode;
  const clientId = user?.clientMerchantDetailsList && user?.clientMerchantDetailsList[0]?.clientId
 

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(kycUserList({ login_id: user?.loginId }));
  }, [user,dispatch]);



  
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



  const getSubscribedPlan = (clientId, id)=>{
    axiosInstanceJWT
    .post(API_URL.Get_Subscribed_Plan_Detail_By_ClientId, { "clientId": clientId, "applicationId": id })
    .then((resp) => {
  
      setSelectedPlan({ planId: resp?.data?.data?.planId ===null? "": resp?.data?.data?.planId })
    })
  }



  useEffect(() => {
    clientDetailRequest()
    getSubscribedPlan(clientId,10)

  },[clientId,user])


  // console.log("selected plan",selectedPlan)
  return (
    <section >
      <main >
        <div className="gx-main-content-wrapper">
          {/* <div className="right_layout my_account_wrapper right_side_heading"> */}
            <h5 className="m-b-sm gx-float-left">Integration Kit</h5>
            <a className="btn btn-primary float-right text-white" href="https://sabpaisa.in/integration-kits/" target="_blank" rel="noreferrer">Developer Guide</a>
          {/* </div> */}
          <section className="features8 cid-sg6XYTl25a flleft w-100">
            <div className="container-fluid">
            <div className="row">
            <StepProgressBar status={kycStatus} />
              
            </div>
              
              <div className="row">
                <div className="col-lg-12 border m-1 p-2">
                  <a
                    data-toggle="collapse"
                    href="#multiCollapseExample1"
                    role="button"
                    aria-expanded="true"
                    aria-controls="multiCollapseExample1"
                  >
                    <h5 className=""><u>Test Credentials</u> </h5>
                  </a>
                  {/* <h2>Test Credentials</h2> */}
                  <form
                    className="collapse multi-collapse show"
                    id="multiCollapseExample1"
                  >
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Client Code
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
                          User Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value="Abh789@sp"
                        />
                      </div>
                    {!APP_ENV &&
                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Password
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value="P8c3WQ7ei@sp"
                        />
                      </div>}
                    

                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Authentication Key
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
                          Authentication IV
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
                          Environment Base URL
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value="https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1"
                        />
                      </div>
                    </div>
                  </form>
                </div>
                
                <div className="col-lg-12 border m-1 p-2">
                  <a
                    data-toggle="collapse"
                    href="#multiCollapseExample2"
                    role="button"
                    aria-expanded="true"
                    aria-controls="multiCollapseExample2"
                  >
                    <h5 className=""><u>Live Credentials</u></h5>
                  </a>

                  <form
                    className="collapse multi-collapse show"
                    id="multiCollapseExample2"
                  >
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Client Code
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          id="inputEmail3"
                          disabled="true"
                          value={data && data?.clientCode}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className=" col-form-label"
                        >
                          User Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value={data && data?.clientUserName }
                        />
                      </div>

                      <div className="col-lg-4">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          Authentication Key
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value={data &&  data?.authKey}
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
                          value={data && data?.clientPassword}
                        />
                          <div className="input-group-addon eye__Icon">
                                        <a onClick={handleClickShowPassword} href={()=>false}>
                                          {" "}
                                          {values.showPassword ? (
                                            <i
                                              className="fa fa-eye"
                                              aria-hidden="true"
                                            ></i>
                                          ) : (
                                            <i
                                              className="fa fa-eye-slash"
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
                          value={data && data?.authIV}
                        />
                      </div>
                      
                      <div className="col-lg-6">
                        <label
                          htmlFor="inputPassword3"
                          className="col-form-label"
                        >
                          SabPaisa Domain/Environment Base URL
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          id="inputPassword3"
                          disabled="true"
                          value={`https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit${data?.apiVersion===1 ? '?v=1' :''}`}
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
