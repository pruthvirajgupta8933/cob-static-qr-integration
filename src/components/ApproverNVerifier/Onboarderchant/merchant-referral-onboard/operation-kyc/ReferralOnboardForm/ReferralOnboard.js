import React from 'react';
import ReferralOnboardForm from "./ReferralOnboardForm";
import {roleBasedAccess} from "../../../../../../_components/reuseable_components/roleBasedAccess";
import {fetchChiledDataList} from "../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice";

function ReferralOnboard(props) {
    return (
       <ReferralOnboardForm  />
    );
}

export default ReferralOnboard;