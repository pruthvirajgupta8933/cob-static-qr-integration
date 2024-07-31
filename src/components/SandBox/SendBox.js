
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycUserList } from "../../slices/kycSlice";
import API_URL from "../../config";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import SandboxCollapse from "./SandboxCollapse"
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";


function Sandbox() {
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const [openCollapse, setOpenCollapse] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const roles = roleBasedAccess();
  // console.log(roles)


  // Function to toggle the visibility of the password field
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleToggle = (index) => {
    setOpenCollapse(index === openCollapse ? 0 : index);
  };



  const [data, setData] = useState([])
  const [isCopied, setIsCopied] = useState(false);
  const formDetails = [
    {
      id: 1,
      title: "Test Credentials ( PHP )",
      initialValues: [
        { label: "Client Code", value: "DCRBP" },
        { label: "User Name", value: "userph.jha_3036" },
        { label: "Password", value: "DBOI1_SP3036" },
        { label: "Authentication Key", value: "0jeOYcu3UnfmWyLC" },
        { label: "Authentication IV", value: "C28LAmGxXTqmK0QJ" },
        { label: "Environment Base URL", value: "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1" }

      ]
    },
    {
      id: 2,
      title: "Test Credentials (JAVA | .NET | Android | React JS | React Native | NodeJS | Flutter | Python | IOS | Angular | Vue)",
      initialValues: [
        { label: "Client Code", value: "TM001" },
        { label: "User Name", value: "spuser_2013" },
        { label: "Password", value: "RIADA_SP336" },
        { label: "Authentication Key", value: "kaY9AIhuJZNvKGp2" },
        { label: "Authentication IV", value: "YN2v8qQcU3rGfA1y" },
        { label: "Environment Base URL", value: "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1" }
      ]
    },
    {
      id: 3,
      title: "Test Credentials ( OpenCart | WooCommerce)",
      initialValues: [
        { label: "Client Code", value: "NITE5" },
        { label: "User Name", value: "Ish988@sp" },
        { label: "Password", value: "wF2F0io7gdNj" },
        { label: "Authentication Key", value: "zvMzY0UZLxkiE6ad" },
        { label: "Authentication IV", value: "iFwrtsCSw3j7HG15" },
        { label: "Environment Base URL", value: "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit" }
      ]
    },

    {
      id: 4,
      title: "Live Credentials",
      initialValues: [
        {
          label: "Client Code",
          value: data?.clientCode
        },
        {
          label: "User Name",
          value: data && data.clientUserName
        },
        {
          label: "Password",
          value: data && data.clientPassword,

        },
        {
          label: "Authentication Key",
          value: data && data.authKey
        },
        {
          label: "Authentication IV",
          value: data && data.authIV
        },
        {
          label: "SabPaisa Domain/Environment Base URL",
          value: `https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit${data?.apiVersion === 1 ? '?v=1' : ''}`
        }
      ]
    }
  ];




  const clientCodeOfMerchant = user.clientMerchantDetailsList && user.clientMerchantDetailsList[0]?.clientCode;
  const clientId = user?.clientMerchantDetailsList && user?.clientMerchantDetailsList[0]?.clientId


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(kycUserList({ login_id: user?.loginId }));
  }, [user, dispatch]);


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




  useEffect(() => {
    roles.merchant && clientDetailRequest()
  }, [clientId, user])


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
                {formDetails.map((form, index) => (
                  <>
                    {/* {console.log(form.id)}
                    {console.log(roles.referral)} */}
                    {(form.id === 4 && roles.referral) ? <></> : <SandboxCollapse
                      key={index}
                      isOpen={openCollapse === index + 1}
                      onToggle={() => handleToggle(index + 1)}
                      title={form.title}
                      formContent={(
                        <form>
                          <div className="form-group row">
                            {form.initialValues.map((item, i) => (
                              <div className="col-lg-4" key={i}>
                                <label className="col-form-label">{item.label}</label>
                                <div className="input-group">
                                  <input
                                    type={item.label === 'Password' && !showPassword ? "password" : "text"}
                                    className="form-control"
                                    disabled={true}
                                    value={item.value}
                                  />
                                  {item.label === 'Password' && (
                                    <>
                                      <div className="input-group-append">
                                        <span
                                          className="input-group-text"
                                          style={{ cursor: 'pointer' }}
                                          onClick={togglePasswordVisibility}
                                        >
                                          {showPassword ? (
                                            <i className="fa fa-eye" style={{ fontSize: '12px' }}></i>
                                          ) : (
                                            <i className="fa fa-eye-slash" style={{ fontSize: '12px' }}></i>
                                          )}
                                        </span>
                                      </div>
                                      <div className="input-group-append">
                                        <span
                                          className="input-group-text"
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => copyToClipboard(item.value)}
                                          data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                                        >
                                          <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  {item.label !== 'Password' && (
                                    <div className="input-group-append">
                                      <span
                                        className="input-group-text"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => copyToClipboard(item.value)}
                                        data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                                      >
                                        <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </form>

                      )}
                    />}

                  </>
                ))}


              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default Sandbox;
