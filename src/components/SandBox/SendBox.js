import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycUserList, kycUserListForMerchant } from "../../slices/kycSlice";
import SandboxCollapse from "./SandboxCollapse";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import { sandBoxService } from "../../services/sandbox/sandbox.service";

function Sandbox() {
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const [openCollapse, setOpenCollapse] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState([]);

  const [isCopied, setIsCopied] = useState(false);

  const roles = roleBasedAccess();
  const dispatch = useDispatch();


  useEffect(() => {
    if (roles?.merchant) {
      dispatch(kycUserListForMerchant());
    }
  }, [user, dispatch]);

  const clientCodeOfMerchant = user?.clientMerchantDetailsList?.[0]?.clientCode;
  const clientId = user?.clientMerchantDetailsList?.[0]?.clientId;

  const clientDetailRequest = async () => {
    try {
      sandBoxService.clientDetailsListApi({ clientCode: clientCodeOfMerchant }).then((res) => {
        setData(res?.ClientData);
      })

    } catch (error) {
      console.error("Error fetching client details", error);
    }
  };

  useEffect(() => {
    if (roles.merchant) {
      clientDetailRequest();
    }
  }, [clientId, user]);

  const togglePasswordVisibility = () => setShowPassword((prevState) => !prevState);

  const handleToggle = (index) => setOpenCollapse(index === openCollapse ? 0 : index);

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 650);
  };

  const formDetails = [
    {
      id: 1,
      title: "Test Credentials (PHP)",
      initialValues: [
        { label: "Client Code", value: "DCRBP" },
        { label: "User Name", value: "userph.jha_3036" },
        { label: "Password", value: "DBOI1_SP3036" },
        { label: "Authentication Key", value: "0jeOYcu3UnfmWyLC" },
        { label: "Authentication IV", value: "C28LAmGxXTqmK0QJ" },
        { label: "Environment Base URL", value: "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1" },
      ],
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
        { label: "Environment Base URL", value: "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1" },
      ],
    },
    {
      id: 3,
      title: "Test Credentials (OpenCart | WooCommerce)",
      initialValues: [
        { label: "Client Code", value: "NITE5" },
        { label: "User Name", value: "Ish988@sp" },
        { label: "Password", value: "wF2F0io7gdNj" },
        { label: "Authentication Key", value: "zvMzY0UZLxkiE6ad" },
        { label: "Authentication IV", value: "iFwrtsCSw3j7HG15" },
        { label: "Environment Base URL", value: "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit" },
      ],
    },
    {
      id: 100,
      title: "Test Credentials (WIX)",
      initialValues: [
        { label: "Client Code", value: "DEMO1" },
        { label: "User Name", value: "spuser_2211" },
        { label: "Password", value: "DEMO1_SP2211" },
        { label: "Authentication Key", value: "QL0EARobZPabc8s7" },
        { label: "Authentication IV", value: "EtjZsnCjXDwUIicC" },
        { label: "Environment Base URL", value: "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit" },
      ],
    },
    {
      id: 4,
      title: "Live Credentials",
      initialValues: [
        { label: "Client Code", value: data?.clientCode },
        { label: "User Name", value: data?.clientUserName },
        { label: "Password", value: data?.clientPassword },
        { label: "Authentication Key", value: data?.authKey },
        { label: "Authentication IV", value: data?.authIV },
        { label: "SabPaisa Domain/Environment Base URL", value: `https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit${data?.apiVersion === 1 ? '?v=1' : ''}` },
      ],
    },


  ];

  return (
    <section>
      <main>
        <div>
          <div className="d-flex">
            <div className="p-2 w-100">
              <h5>Integration Kit</h5>
            </div>
            <div className="p-2 flex-shrink-1">
              <a
                className="btn cob-btn-primary btn-sm float-right text-white"
                href="https://sabpaisa.in/integration-kits/"
                target="_blank"
                rel="noreferrer"
              >
                Developer Guide
              </a>
            </div>
          </div>
          <section>
            <div className="container-fluid">
              <div className="row">
                {formDetails.map((form, index) => (
                  (form.id === 4 && roles.referral) ? null : (
                    <SandboxCollapse
                      key={index}
                      isOpen={openCollapse === index + 1}
                      onToggle={() => handleToggle(index + 1)}
                      title={form.title}
                      formContent={
                        <div className="form-group row px-3">
                          {form.initialValues.map((item, i) => (
                            <div className="col-lg-4" key={i}>
                              <label className="col-form-label">{item.label}</label>
                              <div className="input-group">
                                <input
                                  type={item.label === "Password" && !showPassword ? "password" : "text"}
                                  className="form-control"
                                  disabled
                                  value={item.value}
                                />
                                {item.label === "Password" && (
                                  <>
                                    <div className="input-group-append">
                                      <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={togglePasswordVisibility}
                                      >
                                        <i className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`} style={{ fontSize: "12px" }}></i>
                                      </span>
                                    </div>
                                    <div className="input-group-append">
                                      <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => copyToClipboard(item.value)}
                                        data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                                      >
                                        <i className="fa fa-copy" style={{ fontSize: "12px" }}></i>
                                      </span>
                                    </div>
                                  </>
                                )}
                                {item.label !== "Password" && (
                                  <div className="input-group-append">
                                    <span
                                      className="input-group-text"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => copyToClipboard(item.value)}
                                      data-tip={isCopied ? "Copied!" : "Copy to clipboard"}
                                    >
                                      <i className="fa fa-copy" style={{ fontSize: "12px" }}></i>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      }
                    />
                  )
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
