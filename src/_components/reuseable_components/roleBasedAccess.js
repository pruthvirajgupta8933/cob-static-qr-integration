import { ALLOW_ROLE_AS_VERIFIER } from "../../utilities/permisson";

export const roleBasedAccess = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const roleId = user?.roleId;
    const loginId = user?.loginId;

    const roleBasedTab = {
        approver: false,
        verifier: false,
        bank: false,
        referral: false,
        merchant: false,
        viewer: false,
        b2b: false,
        accountManager: false,
        businessDevelopment: false,
        zonalManager: false,
    };

    let roleAccessObj = roleBasedTab;

    let permission = {
        Allow_To_Do_Verify_Kyc_details: false
    }


    if (roleId === 14) {
        // user is verifier 
        roleAccessObj = { ...roleAccessObj, verifier: true };
    } else if (roleId === 15) {
        // user is approver
        roleAccessObj = { ...roleAccessObj, approver: true };
    } else if (roleId === 3) {
        // bank
        roleAccessObj = { ...roleAccessObj, bank: true };
    } else if (roleId === 13) {
        // referral
        roleAccessObj = { ...roleAccessObj, referral: true };
    } else if (roleId === 4 || roleId === 5) {
        // client and merchant
        roleAccessObj = { ...roleAccessObj, merchant: true };
    } else if (roleId === 16) {
        // user is viewer
        roleAccessObj = { ...roleAccessObj, viewer: true };
    } else if (roleId === 100) {
        // b2b - emammi
        roleAccessObj = { ...roleAccessObj, b2b: true };
    } else if (roleId === 101) {
        // accountManager
        roleAccessObj = { ...roleAccessObj, accountManager: true };


    } else if (roleId === 102) {
        // businessDevelopment
        roleAccessObj = { ...roleAccessObj, businessDevelopment: true };
    }
    else if (roleId ===
        103) {
        // zonalManager
        roleAccessObj = { ...roleAccessObj, zonalManager: true };
    }

    else {
        // console.log("Permission not match with these roles");
    }

    const Enable_Settlement_Report_Excel = ["MSBP1", "MSB10", "MSB12"]; // client Code based 

    roleAccessObj.Enable_Settlement_Report_Excel = Enable_Settlement_Report_Excel
    permission.Allow_To_Do_Verify_Kyc_details = ALLOW_ROLE_AS_VERIFIER.includes(loginId)
    roleAccessObj.permission = permission


    return roleAccessObj;
};



