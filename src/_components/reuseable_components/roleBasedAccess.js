import { ALLOW_ROLE_AS_VERIFIER } from "../../utilities/permisson";
// console.log(ALLOW_ROLE_AS_VERIFIER)
export const roleBasedAccess = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const roleId = user?.roleId;
    const loginId = user?.loginId;

    const roleBasedTab = {
        approver: false,
        verifier: false,
        bank: false,
        merchant: false,
        viewer:false,
    };

    let roleAccessObj = roleBasedTab;
    
    let permission = {
        Allow_To_Do_Verify_Kyc_details : false,
        EnalbeTabs: {
            MerchantList:false,
            AdditionalKyc:false,
            AssignZone:false,
            RateMapping:false,
            SignupData:false,
            OnBoardMerchant:false
        }
    }


    if (roleId === 14 ) {
        // user is verifier 
        roleAccessObj = { ...roleAccessObj, verifier: true };
        permission = {...permission.EnalbeTabs, 
            MerchantList:true,
            SignupData : true,
            OnBoardMerchant : true,
        }
    } else if (roleId === 15){
        // user is approver
        roleAccessObj = { ...roleAccessObj, approver: true };
        permission = {...permission.EnalbeTabs, 
                        MerchantList:true,
                        AdditionalKyc : true,
                        AssignZone : true,
                        RateMapping : true,
                        SignupData : true,
                        OnBoardMerchant : true,
                    }

    }else if (roleId === 3 || roleId === 13) {
        roleAccessObj = { ...roleAccessObj, bank: true };
    } else if (roleId === 4 || roleId === 5) {
        roleAccessObj = { ...roleAccessObj, merchant: true };
    } else if (roleId === 16 ) {
        // user is viewer
        roleAccessObj = { ...roleAccessObj, viewer: true };
        permission = {...permission.EnalbeTabs, 
            MerchantList:true,
            SignupData : true
        }
    } else {
        // console.log("Permission not match with these roles");
    }

    const Enable_Settlement_Report_Excel = ["MSBP1", "MSB10", "MSB12"]; // client Code based 
    
    roleAccessObj.Enable_Settlement_Report_Excel = Enable_Settlement_Report_Excel
    permission.Allow_To_Do_Verify_Kyc_details = ALLOW_ROLE_AS_VERIFIER.includes(loginId)
    roleAccessObj.permission = permission


    return roleAccessObj;
};



