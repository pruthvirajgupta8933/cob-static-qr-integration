import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL, { APP_ENV } from "../config";
import {
    axiosInstanceJWT,
    kycValidatorAuth,
} from "../utilities/axiosInstance";

// import { APP_ENV } from "../config";
import { KYC_STATUS_APPROVED, KYC_STATUS_VERIFIED } from "../utilities/enums";
import approverDashboardService from "../services/approver-dashboard/approverDashboard.service";

const initialState = {
    isLoading: false,
    isLoadingForPending: false,
    isLoadingForPendingVerification: false,
    isLoadingForPendingApproval: false,
    isLoadingForApproved: false,
    isLoadingForRejected: false,
    documentByloginId: {},
    kycApproved: {
        count: null,
        next: null,
        previous: null,
        results: null,
    },
    kycUserList: {},
    notFilledUserList: {},
    pendingVerificationKycList: {
        results: [],
        count: 0

    },

    myMerchnatUserList: {
        results: [],
        count: 0
    },
    kycApprovedList: {
        results: [],
        count: 0
    },
    pendingKycuserList: {
        results: [],
        count: 0
    },
    rejectedKycList: {
        results: [],
        count: 0
    },
    kycVerifiedList: {
        results: [],
        count: 0
    },
    rateMappingData: {},
    configurationData: {
        results: [],
        count: 0
    },
    KycDocUpload: [],
    compareDocListArray: {
        finalArray: [],
        dropDownDocList: [],
        isRequireDataUploaded: false
    },

    allKycData: {
        result: [],
        loading: false,
        error: false,
        message: ""
    },

    KycTabStatusStore: {},

    businessType: [],
    busiCategory: [],
    platformType: [],
    collectionFrequency: [],
    collectionType: [],
    saveBusinessInfo: [],
    businessOverviewState: [],
    saveMerchantInfo: [],
    documentsUpload: [],
    merchantInfo: [],
    kycBankNames: [],
    saveMerchantBankDetais: [],
    kycForPendingMerchants: [],
    kycForPending: [],
    kycForRejectedMerchants: [],
    kycForVerified: [],
    kycForApproved: [],
    kycForCompleted: [],
    // UploadLoginId: [],
    enableKycTab: false,
    kycModalClose: true,

    allTabsValidate: {
        merchantContactInfo: {
            submitStatus: {
                status: false,
            },
            aadhaar: {
                status: false,
                valid: false,
            },
        },
        BusiOverviewwStatus: {
            submitStatus: {
                status: false,
            },
        },
        BusinessDetailsStatus: {
            AuthPanValidation: {
                first_name: "",
                last_name: "",
                valid: false,
                status: false,
            },
            PanValidation: {
                first_name: "",
                last_name: "",
                valid: false,
                status: false,
            },
            GSTINValidation: {
                status: false,
                valid: false,
            },
            submitStatus: {
                status: false,
                message: "",
            },
        },
        BankDetails: {
            IfscValidation: {
                valid: false,
                status: false,
            },
            accountValidation: {
                first_name: "",
                last_name: "",
                valid: false,
                status: false,
            },

            submitStatus: {
                status: false,
                message: "",
            },
        },
        UploadDoc: {
            submitStatus: {
                status: false,
                message: "",
            },
        },
    },

    GetBankid: [],

    consentKyc: {
        message: "",
        status: false,
    },

    OtpResponse: {
        status: "",
        verification_token: "",
        tempEmail: "",
        tempPhone: "",
    },
    OtpVerificationResponseForPhone: {
        status: false,
        message: "",
    },

    OtpVerificationResponseForEmail: {
        status: false,
        message: "",
    },
    OpenModalForKycSubmit: {
        isOpen: false
    },
    approveKyc: {
        isApproved: false,
        isError: false,
        logs: {},

    },
    merchantKycData: {}


};

//--------------For Saving the Merchant Data Successfully (Contact Info) ---------------------
export const updateContactInfo = createAsyncThunk(
    "UpdateContactInfo/updateContactInfo",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .put(`${API_URL.Save_General_Info}`, requestParam, {
                headers: {
                    // Authorization: ""
                },
            })
            .catch((error) => {
                return error.response;
            });
        // console.log(response)
        return response.data;
    }
);

// KYC OTP function

//--------------For Sending the Contact Otp ---------------------
export const otpForContactInfo = createAsyncThunk(
    "OtpForContact/otpContactInfo",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL.Send_OTP}`, requestParam)
            .catch((error) => {
                return error.response;
            });
        return response.data;
    }
);

//---------VERIFICATION OTP For Phone ------------------------
export const otpVerificationForContactForPhone = createAsyncThunk(
    "OtpVerificationForContactForPhone/otpVerificationForContactForPhone",
    async (requestParam) => {
        // console.log("requestParam",requestParam)
        const response = await axiosInstanceJWT
            .post(`${API_URL.Verify_OTP}`, requestParam)
            .catch((error) => {
                return error.response;
            });
        return response.data;
    }
);

//---------VERIFICATION OTP For Email------------------------
export const otpVerificationForContactForEmail = createAsyncThunk(
    "OtpVerificationForContactForEmail/otpVerificationForContactForEmail",
    async (requestParam) => {
        // console.log("requestParam",requestParam)
        const response = await axiosInstanceJWT
            .post(`${API_URL.Verify_OTP}`, requestParam)
            .catch((error) => {
                return error.response;
            });
        return response.data;
    }
);

// END kyc otp function

//--------------Kyc BusinessType get api (BusinessOverview Tab)---------------------
export const businessType = createAsyncThunk(
    "kyc/businessType",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .get(`${API_URL.Business_type}`)
            .catch((error) => {
                return error.response;
            });
        // console.log(response)
        return response.data;
    }
);
///////////////////////// For business category api
export const busiCategory = createAsyncThunk(
    "kyc/busiCategory",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .get(`${API_URL.Business_Category_CODE}`, {
                headers: {},
            })
            .catch((error) => {
                return error.response;
            });
        // console.log(response)
        return response.data;
    }
);


////////////////////////////////////////////////// For platform
export const platformType = createAsyncThunk(
    "kyc/platformType",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .get(`${API_URL.Platform_type}`, {
                headers: {},
            })
            .catch((error) => {
                return error.response;
            });
        // console.log(response)
        return response.data;
    }
);

/////////////////////////////////////////////// For collection frequency


export const collectionFrequency = createAsyncThunk(
    "kyc/platformType",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .get(`${API_URL.Collection_frequency}`, {
                headers: {},
            })
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

////////////////////////////////////////////////Get all collection type
export const collectionType = createAsyncThunk(
    "kyc/collectionType",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .get(`${API_URL.Get_ALL_Collection_Type}`, {
                headers: {},
            })
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);
//////////////////////////////////////////////////// Put api for save business info
export const saveBusinessInfo = createAsyncThunk(
    "kyc/saveBusinessInfo",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .put(`${API_URL.save_Business_Info}`, requestParam)
            .catch((error) => {
                return error.response;
            });
        // console.log(response,"==========RESPONSE ============>")
        return response.data;
    }
);

/////////////////////////////// Get APi for BusinessDetails Tab(For state)
export const businessOverviewState = createAsyncThunk(
    "kyc/businessOverviewState",
    async (requestParam) => {
        let response = {}
        if (APP_ENV) {
            response = await axiosInstanceJWT
                .get(`${API_URL.Business_overview_state_}`, {
                    headers: {},
                })
                .catch((error) => {
                    return error.response;
                });
        } else {

            response = await axiosInstanceJWT
                .post(`${API_URL.Business_overview_state_}`, {
                    headers: {},
                })
                .catch((error) => {
                    return error.response;
                });
        }
        return response?.data;
    }
);

///////////////////////////////////// Put APi for SAVE_MERCHANT_INFO (BusinessDetails Tab)

export const saveMerchantInfo = createAsyncThunk(
    "kyc/saveMerchantInfo",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL.SAVE_MERCHANT_INFO}`, requestParam, {
                headers: {
                    // Authorization: ""
                },
            })
            .catch((error) => {
                return error.response;
            });
        // console.log(response,"==========RESPONSE ============>")
        return response.data;
    }
);
/////////////////////////////// Get api for Documents Uploads Tab

export const documentsUpload = createAsyncThunk(
    "kyc/documentsUpload",
    async (data) => {
        const businessType = data?.businessType;
        const is_udyam = data?.is_udyam;
        const response = await axiosInstanceJWT
            .get(`${API_URL?.DocumentsUpload}/?business_type_id=${businessType}&is_udyam=${is_udyam}`, {
                headers: {},
            })
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

////////////////////////////////// .Upload_Merchant_document//////////

export const merchantInfo = createAsyncThunk(
    "kyc/merchantInfo",
    async (requestParam) => {
        const response = await axiosInstanceJWT({
            method: "post",
            url:
                requestParam.docType === "1"
                    ? API_URL.UPLOAD_MERCHANT_AADHAAR
                    : API_URL.upload_Single_Doc,
            data: requestParam.bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        }).catch((error) => {
            return error.response;
        });

        return response.data;
    }
);

///////////////FOR KYC USER LIST (THATS COMING STRAIGHT FROM THIS API)/////////////////////)

export const kycUserList = createAsyncThunk(
    "kyc/kycUserList",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL.Kyc_User_List}`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


export const kycDetailsByMerchantLoginId = createAsyncThunk(
    "kyc/kycDetailsByMerchantLoginId",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL.Kyc_User_List}`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

//------------------------------------------------------------------------------------------

//--------------------For KYC DOCUMENT UPLOAD DATA STRAIGHT FROM THIS API -------------------

export const kycDocumentUploadList = createAsyncThunk(
    "kyc/kycDocumentUploadList",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL?.DOCUMENT_BY_LOGINID}`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);
//----------------------------------------------------------------------------

//--------------------For KYC Verification For All Tabs -----------------------

export const GetKycTabsStatus = createAsyncThunk(
    "kyc/GetKycTabsStatus",
    async (requestParam) => {
        // console.log("alert", "check 1")
        const response = await axiosInstanceJWT
            .get(`${API_URL.KYC_TAB_STATUS_URL}/${requestParam?.login_id}`)
            .catch((error) => {
                return error.response;
            });
        // console.log("alert ", response.data)
        return response.data;
    }
);
//--------------------------------------------------------------------------------

//--------------KYC BANK NAMES --------------------- //
export const kycBankNames = createAsyncThunk(
    "kyc/kycBankNames",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .get(`${API_URL.GET_ALL_BANK_NAMES}`, {
                headers: {},
            })
            .catch((error) => {
                return error.response;
            });
        // console.log(response)
        return response.data;
    }
);
/////////////////////////////////////// Payment Mode
export const kycpaymentModeType = createAsyncThunk(
    "kyc/kycpaymentModeType",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .get(`${API_URL.GET_PAYMENT_MODE}`, {
                headers: {},
            })
            .catch((error) => {
                return error.response;
            });
        // console.log(response)
        return response.data;
    }
);


//--------------------------------------------------------------

//----For Saving Merchant Bank Details-----------------//
export const saveMerchantBankDetais = createAsyncThunk(
    "kyc/saveMerchantBankDetais",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .put(
                `${API_URL.Save_Settlement_Info}`,
                requestParam,

                {
                    headers: {},
                }
            )
            .catch((error) => {
                return error.response;
            });
        // console.log(response)
        return response.data;
    }
);
/////////////////////////////////KYC APPROVED API
export const kycForNotFilled = createAsyncThunk(
    "kyc/kycForNotFilled",
    async (data) => {
        const requestParam = data?.page;
        const requestParam1 = data?.page_size;
        const isDirect = data?.isDirect
        const response = await axiosInstanceJWT
            .get(
                `${API_URL.KYC_FOR_NOT_FILLED}&search=${data.merchantStatus}&search_query=${data.searchquery}&page=${requestParam}&page_size=${requestParam1}&isDirect=${isDirect}`)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const MyMerchantListData = createAsyncThunk(
    "kyc/MyMerchantListData",
    async (data) => {
        const requestParam = data?.page;
        const requestParam1 = data?.page_size;
        const searchQuery = data?.searchquery;
        const response = await axiosInstanceJWT
            .post(
                `${API_URL.MY_MERCHANT_LIST}?page=${searchQuery ? 1 : requestParam}&page_size=${requestParam1}&kyc_status=${data?.kyc_status}&search_query=${searchQuery}&order_by=-login_id`, data)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const kycForPendingMerchants = createAsyncThunk(
    "kyc/kycForPendingMerchants",
    async (data) => {
        const requestParam = data?.page;
        const requestParam1 = data?.page_size;
        const isDirect = data?.isDirect;

        const response = await axiosInstanceJWT
            .get(
                `${API_URL.KYC_FOR_PENDING_MERCHANTS}&search=${data.merchantStatus}&search_query=${data.searchquery}&page=${requestParam}&page_size=${requestParam1}&isDirect=${isDirect}`)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const kycForRejectedMerchants = createAsyncThunk(
    "kyc/kycForRejectedMerchants",
    async (data) => {
        const requestParam = data?.page;
        const requestParam1 = data?.page_size;
        const isDirect = data?.isDirect;
        const response = await axiosInstanceJWT
            .get(
                `${API_URL.KYC_FOR_REJECTED_MERCHANTS}&search=${data.merchantStatus}&search_query=${data.searchquery}&page=${requestParam}&page_size=${requestParam1}&isDirect=${isDirect}`,
                {
                    headers: {},
                }
            )
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


export const kycForPending = createAsyncThunk(
    "kyc/kycForPending",
    async (data) => {
        const requestParam = data.page;
        const requestParam1 = data.page_size;
        const isDirect = data?.isDirect;

        const response = await axiosInstanceJWT
            .get(
                `${API_URL.KYC_FOR_PROCESSING}&search=${data.merchantStatus}&search_query=${data.searchquery}&page=${requestParam}&page_size=${requestParam1}&isDirect=${isDirect}`
            )
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


export const FetchAllByKycStatus = createAsyncThunk(
    "kyc/FetchAllByKycStatus",
    async (data) => {
        const requestParam = data.page;
        const requestParam1 = data.page_size;
        const isDirect = data?.isDirect;
        const kycStatus = data?.kycStatus;
        // const order_by =
        const response = await axiosInstanceJWT
            .get(
                `${API_URL.GET_MERCHANT_DATA}?search=${kycStatus}&search_query=${data.searchquery}&page=${requestParam}&page_size=${requestParam1}&isDirect=${isDirect}&order_by=-id`
            )
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);
//////////////////////////////////////////////////
export const kycForVerified = createAsyncThunk(
    "kyc/kycForVerified",
    async (data) => {
        const requestParam = data.page;
        const requestParam1 = data.page_size;
        const isDirect = data?.isDirect;

        const response = await axiosInstanceJWT
            .get(
                `${API_URL.KYC_FOR_VERIFIED}&search=${data.merchantStatus}&search_query=${data.searchquery}&page=${requestParam}&page_size=${requestParam1}&isDirect=${isDirect}`
            )
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


export const onboardedReport = createAsyncThunk(
    "kyc/onboardedReport",
    async (data) => {
        const requestParam = data.page;
        const requestParam1 = data.page_size;
        const from_date = data.from_date;
        const to_date = data?.to_date
        const kyc_status = data?.kyc_status;

        let order_by = kyc_status.toLowerCase() + "_date"
        if (!kyc_status === KYC_STATUS_APPROVED || !kyc_status === KYC_STATUS_VERIFIED) {
            order_by = "id"
        }


        const response = await axiosInstanceJWT
            .get(
                `${API_URL.KYC_FOR_ONBOARDED}?search=${kyc_status}&order_by=-${order_by}&search_map=${order_by}&page=${requestParam}&page_size=${requestParam1}&from_date=${from_date}&to_date=${to_date}`,
            )
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


////////////////////////////////////////////////////
export const kycForApproved = createAsyncThunk(
    "kyc/kycForApproved",
    async (data) => {
        const requestParam = data.page;
        const requestParam1 = data.page_size;

        const isDirect = data?.isDirect === undefined ? "" : data?.isDirect;
        const searchquery = data?.searchquery === undefined ? "" : data?.searchquery;

        // console.log("isDirect",isDirect)
        const response = await axiosInstanceJWT
            .get(
                `${API_URL.KYC_FOR_APPROVED}&search=${data.merchantStatus}&search_query=${searchquery}&page=${requestParam}&page_size=${requestParam1}&isDirect=${isDirect}`)
            .catch((error) => {
                return error.response;
            });
        return response.data;
    }
);
///////////////////////////////////////////

export const kycForCompleted = createAsyncThunk(
    "kyc/kycForCompleted",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .get(`${API_URL.KYC_FOR_COMPLETED}`, {
                headers: {},
            })
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

/////////////////////////////////////////
// export const UploadLoginId = createAsyncThunk(
//   "kyc/UploadLoginId",
//   async (requestParam) => {
//     const response = await axiosInstanceJWT
//       .post(`${API_URL.DOCUMENT_BY_LOGINID}`, requestParam)
//       .catch((error) => {
//         return error.response;
//       });
//     return response.data;
//   }
// );

// ================== veify kyc

export const verifyKycEachTab = createAsyncThunk(
    "kyc/verifyKycEachTab",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL.VERIFY_EACH_TAB}`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const verifyKycDocumentTab = createAsyncThunk(
    "kyc/verifyKycDocumentTab",
    async (requestParam) => {
        let URL_FOR_DOCUMENT_VERIFY = "";
        if (requestParam?.rejected_by) {
            URL_FOR_DOCUMENT_VERIFY = API_URL.DOCUMENT_REJECT;
        } else {
            URL_FOR_DOCUMENT_VERIFY = API_URL.DOCUMENT_VERIFY;
        }

        const response = await axiosInstanceJWT
            .put(URL_FOR_DOCUMENT_VERIFY, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const checkedDocumentReject = createAsyncThunk(
    "kyc/checkedDocumentReject",
    async (requestParam) => {
        let URL_FOR_DOCUMENT_VERIFY = "";
        if (requestParam?.rejected_by) {
            URL_FOR_DOCUMENT_VERIFY = API_URL.CHECKED_DOCUMENT_REJECT;
        } else {
            URL_FOR_DOCUMENT_VERIFY = API_URL.CHECKED_DOCUMENT_REJECT;
        }

        const response = await axiosInstanceJWT
            .put(URL_FOR_DOCUMENT_VERIFY, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


export const removeDocument = createAsyncThunk(
    "kyc/removeDocument",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .put(API_URL.DOCUMENT_REMOVE, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const verifyComplete = createAsyncThunk(
    "kyc/verifyKycEachTab",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL.VERIFY_FINAL_ALL}`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);
export const approveDoc = createAsyncThunk(
    "kyc/approveDoc",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .put(`${API_URL.APPROVE_DOCUMENT}`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


//----- GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//
export const panValidation = createAsyncThunk(
    "kyc/panValidation",
    async (requestParam) => {
        // console.log("check 1",requestParam)
        const response = await kycValidatorAuth
            .post(`${API_URL.VALIDATE_KYC}/validate-pan/`, requestParam)
            .catch((error) => {
                return error.response;
            });

        // console.log("check 3")
        return response.data;
    }
);

export const authPanValidationrr = createAsyncThunk(
    "kyc/authPanValidationrr",
    async (requestParam) => {
        // console.log("check 4")
        const response = await kycValidatorAuth
            .post(`${API_URL.VALIDATE_KYC}/validate-pan/`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const authPanValidation = createAsyncThunk(
    "kyc/authPanValidation",
    async (requestParam) => {
        // console.log("check 5")
        const response = await kycValidatorAuth
            .post(`${API_URL.VALIDATE_KYC}/validate-pan/`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const gstValidation = createAsyncThunk(
    "kyc/gstValidation",
    async (requestParam) => {
        const response = await kycValidatorAuth
            .post(`${API_URL.VALIDATE_KYC}/validate-gst/`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


export const udyamRegistration = createAsyncThunk(
    "kyc/gstValidation",
    async (requestParam) => {
        const response = await kycValidatorAuth
            .post(`${API_URL.UDYAM_REGISTRATION}/validate-udyam/`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

export const ifscValidation = createAsyncThunk(
    "kyc/ifscValidation",
    async (requestParam) => {
        const response = await kycValidatorAuth
            .post(`${API_URL.VALIDATE_KYC}/validate-ifsc/`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);


export const bankAccountVerification = createAsyncThunk(
    "kyc/bankAccountVerification",
    async (requestParam) => {
        const response = await kycValidatorAuth
            .post(`${API_URL.VALIDATE_KYC}/validate-account/`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);

//----- KYC ALL NUMBERS(GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//

//--Get Bank Id ------------//
export const getBankId = createAsyncThunk(
    "kyc/getBankId",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL.GET_BANK_ID}`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);
//--Get Bank Id ------------//

//--get-business-type-by-id ------------//
export const businessTypeById = createAsyncThunk(
    "kyc/getBusinessTypeById",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL.GET_BUSINESS_TYPE_ID}`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);
//-- get-business-type-by-id  ------------//

//-- get-business-category-by-id ------------//
export const businessCategoryById = createAsyncThunk(
    "kyc/businessCategoryById",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(`${API_URL.GET_BUSINESS_CATEGORY_ID}`, requestParam)
            .catch((error) => {
                return error.response;
            });

        return response.data;
    }
);
//---- get-business-category-by-id ------------//

export const approvekyc = createAsyncThunk(
    "kyc/approvekyc",
    async (requestParam, thunkAPI) => {
        try {
            const response = await approverDashboardService.approveKyc(requestParam);
            return response;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            // thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }

        // const response = await axiosInstanceJWT
        //   .post(`${API_URL.APPROVE_KYC}`, requestParam)
        //   .catch((error) => {
        //     return error.response;
        //   });

        // return response.data;
    }
);

//---------------- Registered Address TAP INTEGRATION --------------//

export const saveRegisteredAddress = createAsyncThunk(
    "kyc/saveRegisteredAddress",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(
                `${API_URL.Registered_Address}`,
                requestParam,

                {
                    headers: {},
                }
            )
            .catch((error) => {
                return error.response;
            });
        // console.log(response)
        return response.data;
    }
);
//---------------- Registered Address TAP INTEGRATION --------------//

//---------------- KYC CONSENT TAP API INTEGRATION --------------//

export const saveKycConsent = createAsyncThunk(
    "kyc/saveKycConsent",
    async (requestParam) => {
        const response = await axiosInstanceJWT
            .post(
                `${API_URL.Kyc_Consent}`,
                requestParam)
            .catch((error) => {
                return error.response;
            });
        // console.log(response)
        return response.data;
    }
);

//---------------- KYC CONSENT TAP API INTEGRATION --------------//

export const kycSlice = createSlice({
    name: "kyc",
    initialState,
    reducers: {
        getBusinessType: (state) => {
            state.businessType = [];
        },
        getBusinessCategory: (state) => {
            state.busiCategory = [];
        },
        loadKycUserList: (state) => {
            state.kycUserList = [];
        },
        loadKycVericationForAllTabs: (state) => {
            state.KycTabStatusStore = [];
        },
        enableKycTab: (state, action) => {
            state.enableKycTab = action.payload;
        },
        kycModalToggle: (state, action) => {
            state.kycModalClose = action.payload;
        },
        clearKycState: (state) => {
            state.kycUserList = {};
        },
        clearKycDetailsByMerchantLoginId: (state) => {
            state.merchantKycData = {};
        },


        saveDropDownAndFinalArray: (state, action) => {

            // state.compareDocListArray.dropDownDocList = action?.payload?.dropDownDocList;
            // state.compareDocListArray.finalArray = action?.payload?.finalArray;
            state.compareDocListArray.isRequireDataUploaded = action?.payload;
        },
        UpdateModalStatus: (state, action) => {
            state.OpenModalForKycSubmit.isOpen = action?.payload
        },
        clearFetchAllByKycStatus: (state) => {
            state.allKycData.error = false
            state.allKycData.loading = false
            state.allKycData.result = []
            state.allKycData.message = ""
        },
        clearApproveKyc: (state) => {
            state.approveKyc.isApproved = false
            state.approveKyc.isError = false
            state.approveKyc.logs = {}
        }
    },
    extraReducers: {
        [kycForNotFilled.pending]: (state, action) => {
            state.status = "pending";
            state.isLoading = true;
        },
        [kycForNotFilled.fulfilled]: (state, action) => {
            state.notFilledUserList = action.payload
            state.isLoading = false;
        },
        [kycForNotFilled.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.isLoading = false;
        },
        //--------------------------------------------
        //////////////////////////////////////////
        [MyMerchantListData.pending]: (state, action) => {
            state.status = "pending";
            state.isLoading = true;
        },
        [MyMerchantListData.fulfilled]: (state, action) => {
            state.myMerchnatUserList = action.payload
            state.isLoading = false;
        },
        [MyMerchantListData.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.isLoading = false;
        },


        /////////////////////////////////////////////////
        [kycForPendingMerchants.pending]: (state, action) => {

            state.status = "pending";
            state.isLoadingForPending = true;
            // state.pendingKycuserList={}
        },
        [kycForPendingMerchants.fulfilled]: (state, action) => {

            state.pendingKycuserList = action.payload;
            state.isLoadingForPending = false;
        },
        [kycForPendingMerchants.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.isLoadingForPending = false;
            // state.pendingKycuserList={}
        },
        //------------------------------------------------
        [kycForPending.pending]: (state, action) => {
            state.status = "pending";
            state.isLoadingForPendingVerification = true;
        },
        [kycForPending.fulfilled]: (state, action) => {
            state.pendingVerificationKycList = action.payload
            // state.kycUserList = action.payload;
            state.isLoadingForPendingVerification = false;
        },
        [kycForPending.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.isLoadingForPendingVerification = false;
        },
        //-------------------------------------------
        [kycForVerified.pending]: (state, action) => {
            state.status = "pending";
            state.isLoadingForPendingApproval = true;
        },
        [kycForVerified.fulfilled]: (state, action) => {
            state.kycVerifiedList = action.payload
            // state.kycUserList = action.payload;
            state.isLoadingForPendingApproval = false;
        },
        [kycForVerified.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.isLoadingForPendingApproval = false;
        },
        //-------------------------------------------
        [onboardedReport.pending]: (state) => {
            state.allKycData.loading = true;
            state.allKycData.error = false;
            state.allKycData.result = {};
        },
        [onboardedReport.fulfilled]: (state, action) => {
            state.allKycData.loading = false;
            state.allKycData.result = action.payload.results;
            state.allKycData.count = action.payload.count;
            state.allKycData.next = action.payload.next;
            state.allKycData.previous = action.payload.previous;
        },
        [onboardedReport.rejected]: (state, action) => {
            state.allKycData.loading = false;
            state.allKycData.error = true;
            state.allKycData.result = [];
            // console.log(action.error)
            state.allKycData.message = action.error.message;
        },
        //-------------------------------------------
        [FetchAllByKycStatus.pending]: (state) => {
            state.allKycData.loading = true;
            state.allKycData.error = false;
            state.allKycData.result = {};
        },
        [FetchAllByKycStatus.fulfilled]: (state, action) => {
            state.allKycData.loading = false;
            state.allKycData.result = action.payload.results;
            state.allKycData.count = action.payload.count;
            state.allKycData.next = action.payload.next;
            state.allKycData.previous = action.payload.previous;
        },
        [FetchAllByKycStatus.rejected]: (state, action) => {
            state.allKycData.loading = false;
            state.allKycData.error = true;
            state.allKycData.result = [];
            state.allKycData.message = action.error.message;
        },
        //-----------------------------------------------
        [kycForApproved.pending]: (state, action) => {
            state.status = "pending";
            state.isLoadingForApproved = true;
        },
        [kycForApproved.fulfilled]: (state, action) => {
            // console.log("action==================>", action)
            // state.kycUserList = action.payload;
            state.rateMappingData = action.payload

            state.isLoadingForApproved = false;
        },
        [kycForApproved.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.isLoadingForApproved = false;
        },
        //-------------------------------------------------
        [kycForRejectedMerchants.pending]: (state, action) => {

            state.status = "pending";
            state.isLoadingForRejected = true;
        },
        [kycForRejectedMerchants.fulfilled]: (state, action) => {
            state.rejectedKycList = action.payload
            // state.kycUserList = action.payload;
            state.isLoadingForRejected = false;
        },
        [kycForRejectedMerchants.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.isLoadingForRejected = false;
        },
        //-------------------------------------------------------------

        //-------------------------------------------------
        [kycUserList.pending]: (state, action) => {
            state.status = "pending";
        },
        [kycUserList.fulfilled]: (state, action) => {
            state.kycUserList = action.payload;
        },
        [kycUserList.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        },
        ///////////////////////////////////
        [kycForApproved.pending]: (state, action) => {
            state.status = "pending";
            state.isLoadingForApproved = true;
        },
        [kycForApproved.fulfilled]: (state, action) => {
            state.kycApprovedList = action.payload;
            state.isLoadingForApproved = false;
        },
        [kycForApproved.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.isLoadingForApproved = false;
        },
        ////////////////////////////////////////
        // [UploadLoginId.pending]: (state, action) => {
        //   state.status = "pending";
        // },
        // [UploadLoginId.fulfilled]: (state, action) => {
        //   // console.log("action-11 ====>",action.payload)
        //   state.documentByloginId = action.payload;
        // },
        // [UploadLoginId.rejected]: (state, action) => {
        //   state.status = "failed";
        //   state.error = action.error.message;
        // },

        //All Kyc Tabs status stored in redux as false
        //Contact Info Post Request

        [updateContactInfo.pending]: (state, action) => {
            state.status = "pending";
        },
        [updateContactInfo.fulfilled]: (state, action) => {

            state.allTabsValidate.merchantContactInfo.submitStatus = action.payload;
        },
        [updateContactInfo.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        },
        [saveBusinessInfo.pending]: (state, action) => {
            state.status = "pending";
        },
        [saveBusinessInfo.fulfilled]: (state, action) => {
            state.allTabsValidate.BusiOverviewwStatus.submitStatus = action.payload;
        },
        [saveBusinessInfo.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        },

        [saveMerchantInfo.pending]: (state, action) => {
            state.status = "pending";
        },
        [saveMerchantInfo.fulfilled]: (state, action) => {
            state.allTabsValidate.BusinessDetailsStatus.submitStatus = action.payload;
        },
        [saveMerchantInfo.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        },

        [saveMerchantBankDetais.pending]: (state, action) => {
            state.status = "pending";
        },
        [saveMerchantBankDetais.fulfilled]: (state, action) => {
            state.allTabsValidate.BankDetails.submitStatus = action.payload;
        },
        [saveMerchantBankDetais.rejected]: (state, action) => {
            state.status = "failed";
        },

        [merchantInfo.pending]: (state, action) => {
            state.status = "pending";
        },
        [merchantInfo.fulfilled]: (state, action) => {
            state.allTabsValidate.UploadDoc.submitStatus = action.payload;
            // console.log(action.payload,"Action ===> 12")
        },
        [merchantInfo.rejected]: (state, action) => {
            state.status = "failed";
        },

        // DOC UPLOAD KYC //
        [kycDocumentUploadList.pending]: (state, action) => {
            state.status = "pending";
        },
        [kycDocumentUploadList.fulfilled]: (state, action) => {
            state.KycDocUpload = action.payload;
        },
        [kycDocumentUploadList.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        },
        //Kyc Verification for All Tabs
        [GetKycTabsStatus.pending]: (state, action) => {
            // console.log("alert 1" )
            state.status = "pending";
        },
        [GetKycTabsStatus.fulfilled]: (state, action) => {
            // console.log("alert 2" )

            state.KycTabStatusStore = action.payload;

        },
        [GetKycTabsStatus.rejected]: (state, action) => {
            // console.log("alert 3" )

            state.status = "failed";
            state.error = action.error.message;
        },

        ////////////////////////////////////////////////////

        [saveKycConsent.pending]: (state, action) => {
            state.status = "pending";
        },
        [saveKycConsent.fulfilled]: (state, action) => {
            state.consentKyc = action.payload;
        },
        [saveKycConsent.rejected]: (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        },

        ////////////////////////////////////////////////////////
        [otpForContactInfo.fulfilled]: (state, action) => {
            if (action?.payload?.status) {
                state.OtpResponse = action.payload;
                if (action?.meta?.arg?.email) {
                    state.OtpResponse.tempEmail = action?.meta?.arg?.email;
                }

                if (action?.meta?.arg?.mobile_number) {
                    state.OtpResponse.tempPhone = action?.meta?.arg?.mobile_number;
                }
            }
        },

        ////////////////////////////////////////////////////////////
        // OTP state update

        [otpVerificationForContactForPhone.fulfilled]: (state, action) => {
            if (action.payload?.status === true) {
                state.OtpVerificationResponseForPhone = action.payload;
                state.kycUserList.isContactNumberVerified = 1;
                state.kycUserList.contactNumber = state.OtpResponse.tempPhone;
                state.OtpResponse.tempPhone = "";
            }
        },

        /////////////////////////////////////////////////////////////////

        [otpVerificationForContactForEmail.fulfilled]: (state, action) => {
            if (action.payload?.status === true) {
                state.OtpVerificationResponseForEmail = action.payload;
                state.kycUserList.isEmailVerified = 1;
                state.kycUserList.emailId = state.OtpResponse.tempEmail;
                state.OtpResponse.tempEmail = "";
            }
        },

        [verifyKycEachTab.fulfilled]: (state, action) => {
            state.KycTabStatusStore = action.payload;
        },

        // when kyc approve
        [approvekyc.pending]: (state) => {
            state.approveKyc.isApproved = false
            state.approveKyc.isError = false
            state.approveKyc.logs = {}

        },
        [approvekyc.fulfilled]: (state, action) => {
            state.approveKyc.isApproved = true
            state.approveKyc.logs = action.payload
        },
        [approvekyc.rejected]: (state, action) => {
            state.approveKyc.isApproved = false
            state.approveKyc.isError = true
            state.approveKyc.logs = action.payload
        },
        [kycDetailsByMerchantLoginId.fulfilled]: (state, action) => {
            state.merchantKycData = action.payload;
        },
        [kycDetailsByMerchantLoginId.pending]: (state, action) => {
            state.merchantKycData = {};
        },
        [kycDetailsByMerchantLoginId.rejected]: (state, action) => {
            state.merchantKycData = {};
        },

    },
});

export const {
    getBusinessType,
    getBusinessCategory,
    loadKycUserList,
    loadKycVericationForAllTabs,
    isPhoneVerified,
    clearKycState,
    UpdateModalStatus,
    saveDropDownAndFinalArray,
    clearFetchAllByKycStatus,
    clearApproveKyc,
    clearKycDetailsByMerchantLoginId
} = kycSlice.actions;
export const kycReducer = kycSlice.reducer;
