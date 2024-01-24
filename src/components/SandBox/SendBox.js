
import React, { useEffect, useState } from "react";
// import NavBar from "../dashboard/NavBar/NavBar";
import StepProgressBar from "../../_components/reuseable_components/StepProgressBar/StepProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { kycUserList } from "../../slices/kycSlice";
import API_URL from "../../config";
import toastConfig from "../../utilities/toastTypes";
import Tooltip from 'react-tooltip';
import { axiosInstanceAuth } from "../../utilities/axiosInstance";


function Sandbox() {
  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const [data, setData] = useState([])
  const [isCopied, setIsCopied] = useState(false);
  // const [selectedPlan, setSelectedPlan] = useState([])
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
  }, [user, dispatch]);




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

  function copyToClipboard(value) {
    // Create a temporary input element
    var tempInput = document.createElement('input');

    // Set the value of the temporary input to the text you want to copy
    tempInput.value = value;

    // Append the temporary input to the document
    document.body.appendChild(tempInput);

    // Select the text in the temporary input
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    // Copy the text to the clipboard
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    // toastConfig.successToast('Copied to clipboard')
    setIsCopied(true);

    // Reset the copy status after a delay (e.g., 2 seconds)
    setTimeout(() => {
      setIsCopied(false);
    }, 650);
  }




  // const getSubscribedPlan = (clientId, id) => {
  //   axiosInstanceJWT
  //     .post(API_URL.Get_Subscribed_Plan_Detail_By_ClientId, { "clientId": clientId, "applicationId": id })
  //     .then((resp) => {

  //       // setSelectedPlan({ planId: resp?.data?.data?.planId === null ? "" : resp?.data?.data?.planId })
  //     })
  // }



  useEffect(() => {
    clientDetailRequest()
    // getSubscribedPlan(clientId, 10)

  }, [clientId, user])


  // console.log("selected plan",selectedPlan)
  return (
    <section >
      <main >
        <div className="">
          <div className="d-flex">
            <div className="p-2 w-100"> <h5 className="">Integration Kit</h5></div>
            <div className="p-2 flex-shrink-1"><a className="btn cob-btn-primary btn-sm float-right text-white" href="https://sabpaisa.in/integration-kits/" target="_blank" rel="noreferrer">Developer Guide</a></div>
          </div>

          <section className="">

            <div className="container-fluid">
              <div className="row">
                <StepProgressBar status={kycStatus} />
              </div>

              <div className="row">

                <div className="col-lg-12 border m-1 p-2">
                  <a
                    data-toggle="collapse"
                    href="#multiCollapseExample122"
                    role="button"
                    aria-expanded="true"
                    aria-controls="multiCollapseExample122"
                  >
                    <h6 className="">Test Credentials ( PHP ) </h6>
                  </a>
                  {/* <h2>Test Credentials</h2> */}
                  <form
                    className="collapse multi-collapse show"
                    id="multiCollapseExample122"
                  >
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Client Code
                        </label>
                        <div className="input-group" >
                          <input
                            type="text"
                            className="form-control"
                            id="inputEmail3"
                            disabled={true}
                            value="DCRBP"
                          
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              onClick={() => copyToClipboard("DCRBP")}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i> {/* Copy Icon */}
                            </span>
                          
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <label className="col-form-label">
                          User Name
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            disabled={true}
                            value="userph.jha_3036"

                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              onClick={() => copyToClipboard("userph.jha_3036")}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>{/* Copy Icon */}
                            </span>
                            {/* <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => copyToClipboard("userph.jha_3036")}
                            >
                              Copy
                            </button> */}
                          </div>

                        </div>
                      </div>

                      <div className="col-lg-4">
                        <label className="col-form-label">
                          Password
                        </label>

                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            disabled={true}
                            value="DBOI1_SP3036"

                          />
                          {/* <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="DBOI1_SP3036"

                          /> */}

                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              
                              onClick={() => copyToClipboard("DBOI1_SP3036")}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i> {/* Copy Icon */}
                            </span>

                          </div>

                        </div>
                      </div>


                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Authentication Key
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="0jeOYcu3UnfmWyLC"

                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              onClick={() => copyToClipboard("0jeOYcu3UnfmWyLC")}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>{/* Copy Icon */}
                            </span>

                          </div>
                          {/* <div className="input-group-append">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => copyToClipboard("0jeOYcu3UnfmWyLC")}
                            >
                              Copy
                            </button>
                          </div> */}

                        </div>
                        {/* <input
                          type="text"
                          className="form-control"

                          disabled="true"
                          value="0jeOYcu3UnfmWyLC"
                        /> */}
                      </div>
                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Authentication IV
                        </label>

                        {/* <input
                          type="text"
                          className="form-control"

                          disabled="true"
                          value="C28LAmGxXTqmK0QJ"
                        /> */}
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="C28LAmGxXTqmK0QJ"

                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              onClick={() => copyToClipboard("C28LAmGxXTqmK0QJ")}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>{/* Copy Icon */}
                            </span>

                          </div>

                        </div>
                      </div>
                      <div className="col-lg-6">
                        <label

                          className="col-form-label"
                        >
                          Environment Base URL
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard("https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1")}
                            >
                              <i className="fa fa-copy"></i> {/* Copy Icon */}
                            </span>

                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>


                <div className="col-lg-12 border m-1 p-2">
                  <a
                    data-toggle="collapse"
                    href="#multiCollapseExample1"
                    role="button"
                    aria-expanded="true"
                    aria-controls="multiCollapseExample1"
                  >
                    <h6 className="">Test Credentials (| JAVA | .NET | Android | React JS | React Native | NodeJS | Flutter | Python | IOS | Angular | Vue) </h6>
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
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            id="inputEmail3"
                            disabled="true"
                            value="LPSD1"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              onClick={() => copyToClipboard("LPSD1")}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i> {/* Copy Icon */}
                            </span>

                          </div>

                        </div>
                      </div>
                      <div className="col-lg-4">
                        <label
                          className="col-form-label"
                        >
                          User Name
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="Abh789@sp"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              onClick={() => copyToClipboard("Abh789@sp")}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                            >
                             <i className="fa fa-copy" style={{ fontSize: '12px' }}></i> {/* Copy Icon */}
                            </span>

                          </div>
                        </div>

                      </div>

                      <div className="col-lg-4">
                        <label className="col-form-label">
                          Password
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            disabled="true"
                            value="P8c3WQ7ei"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              onClick={() => copyToClipboard("P8c3WQ7ei")}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>{/* Copy Icon */}
                            </span>
                          </div>

                        </div>
                      </div>


                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Authentication Key
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="x0xzPnXsgTq0QqXx"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              onClick={() => copyToClipboard("x0xzPnXsgTq0QqXx")}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i> {/* Copy Icon */}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Authentication IV
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="oLA38cwT6IYNGqb3"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              onClick={() => copyToClipboard("oLA38cwT6IYNGqb3")}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                            >
                               <i className="fa fa-copy" style={{ fontSize: '12px' }}></i> {/* Copy Icon */}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <label

                          className="col-form-label"
                        >
                          Environment Base URL
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard("https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1")}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i> {/* Copy Icon */}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="col-lg-12 border m-1 p-2">
                  <a
                    data-toggle="collapse"
                    href="#multiCollapseExample3"
                    role="button"
                    aria-expanded="true"
                    aria-controls="multiCollapseExample3"
                  >
                    <h6 className="">Test Credentials ( OpenCart | WooCommerce) </h6>
                  </a>
                  {/* <h2>Test Credentials</h2> */}
                  <form
                    className="collapse multi-collapse"
                    id="multiCollapseExample3"
                  >
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Client Code
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            disabled="true"
                            value="NITE5"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard("NITE5")}
                            >
                               <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>{/* Copy Icon */}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          User Name
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            disabled="true"
                            value="Ish988@sp"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard("Ish988@sp")}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>{/* Copy Icon */}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Password
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            disabled="true"
                            value="wF2F0io7gdNj"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard("wF2F0io7gdNj")}
                            >
                               <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>{/* Copy Icon */}
                            </span>
                          </div>
                        </div>
                      </div>


                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Authentication Key
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            disabled="true"
                            value="zvMzY0UZLxkiE6ad"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard("zvMzY0UZLxkiE6ad")}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Authentication IV
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="iFwrtsCSw3j7HG15"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard("iFwrtsCSw3j7HG15")}
                            >
                               <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <label

                          className="col-form-label"
                        >
                          Environment Base URL
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value="https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit"
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard("https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit")}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                            </span>
                          </div>
                        </div>
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
                    <h6 className="">Live Credentials</h6>
                  </a>

                  <form
                    className="collapse multi-collapse"
                    id="multiCollapseExample2"
                  >
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Client Code
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            id="inputEmail3"
                            disabled="true"
                            value={data && data?.clientCode}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard(data && data?.clientCode)}
                              
                            >
                               <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <label

                          className=" col-form-label"
                        >
                          User Name
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value={data && data?.clientUserName}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              
                              onClick={() => copyToClipboard(data && data?.clientUserName)}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Password
                        </label>
                        <div className="input-group">
                          <input type={
                            values.showPassword
                              ? "text"
                              : "password"
                          }
                            className="form-control"

                            name="passwordd"
                            readOnly="true"
                            value={data && data?.clientPassword} />

                          <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2" onClick={handleClickShowPassword}>

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
                            </span>
                            <div className="input-group-append">
                              <span
                                className="input-group-text"
                                style={{ cursor: 'pointer' }}
                                data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                                onClick={() => copyToClipboard(`https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit${data?.apiVersion === 1 ? '?v=1' : ''}`)}
                              >
                                <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Authentication Key
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value={data && data?.authKey}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard(data && data?.authKey)}
                            >
                               <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                            </span>
                          </div>
                        </div>
                      </div>


                      <div className="col-lg-4">
                        <label

                          className="col-form-label"
                        >
                          Authentication IV{" "}
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value={data && data?.authIV}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                              onClick={() => copyToClipboard(data && data?.authIV)}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <label

                          className="col-form-label"
                        >
                          SabPaisa Domain/Environment Base URL
                        </label>
                        <div className="input-group">

                          <input
                            type="text"
                            className="form-control"

                            disabled="true"
                            value={`https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit${data?.apiVersion === 1 ? '?v=1' : ''}`}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              style={{ cursor: 'pointer' }}
                              data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                               onClick={() => copyToClipboard(`https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit${data?.apiVersion === 1 ? '?v=1' : ''}`)}
                            >
                              <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                            </span>
                          </div>
                        </div>
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
