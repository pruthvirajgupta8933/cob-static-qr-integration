// {
//     "id": 1,
//     "approved_date": null,
//     "is_approved": false,
//     "is_verified": false,
//     "general_info_status": "Verified",
//     "merchant_info_status": "Verified",
//     "business_info_status": null,
//     "settlement_info_status": null,
//     "general_info_verified_date": "2022-08-03T12:36:11.696757",
//     "merchant_info_verified_date": "2022-08-03T18:01:16.034323",
//     "business_info_verified_date": null,
//     "settlement_info_verified_date": null,
//     "status": null,
//     "login_id": 1,
//     "approved_by": null,
//     "general_info_verified_by": 110,
//     "merchant_info_verified_by": 113,
//     "business_info_verified_by": null,
//     "settlement_info_verified_by": null
// }

const is_approved = false
const is_verified = false
const status = null

export const isKycCompleted=()=>{
    let flag = false;
    if(is_approved && is_verified && status ==="approved"){
        flag = true
    }
    return flag;
}