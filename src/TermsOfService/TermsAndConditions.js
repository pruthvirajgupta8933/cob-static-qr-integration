import React from "react";
import "./termsOfService.css";
import HeaderPage from "../components/login/HeaderPage";

const TermsAndConditions = () => {
  return (
    <>
      <HeaderPage />
      <div className="tcContainer" data-bs-spy="scroll" data-bs-offset="50">
        <div className="tcheading">Terms and Conditions</div>
        <div class="container">
          <div class="row">
            <div class="col-sm tcsubheading">Last Updated Date: 30/11/2021</div>
            <div className="tcinfo1">
              <p>
                This agreement (“user agreement”) incorporates the Terms and
                Conditions for SRS Live Technologies Pvt. Ltd. and its affiliate
                Companies (“SRS”) to provide services to the person (s) (“the
                User”) intending to purchase or inquiring for any products and/
                or services of SRS by using SRS’s websites or using any other
                customer interface channels of SRS which includes its sales
                persons, offices, call centers, advertisements, information
                campaigns etc.
              </p>
              <p>
                Both User and SRS are individually referred as ‘party’ to the
                agreement and collectively referred to as ‘parties’.
              </p>
            </div>
          </div>
        </div>
        <h2 className="tcheading1">
          Terms and Conditions: User’s responsibility of cognizance of this
          agreement
        </h2>
        <div>
          <p className="tcinfo1">
            The Users availing services from SRS shall be deemed to have read,
            understood and expressly accepted the terms and conditions of this
            agreement, which shall govern the desired transaction or provision
            of such services by SRS for all purposes, and shall be binding on
            the User. All rights and liabilities of the User and/or SRS with
            respect to any services to be provided by SRS shall be restricted to
            the scope of this agreement. SRS reserves the right, in its sole
            discretion, to terminate the access to any or all SRS websites or
            its other sales channels and the related services or any portion
            thereof at any time, without notice, for general maintenance or any
            reason what so ever. In addition to this Agreement, there are
            certain terms of service (TOS) specific to the services rendered/
            products provided by SRS like the fee collection, new admissions,
            registration for seminars, workshops, trade fairs, campus placements
            etc. Such TOS will be provided/ updated by SRS which shall be deemed
            to be a part of this Agreement and in the event of a conflict
            between such TOS and this Agreement, the terms of this Agreement
            shall prevail. The User shall be required to read and accept the
            relevant TOS for the service/ product availed by the User.
            Additionally, the Institution (SRS’s client) itself may provide
            terms and guidelines that govern particular fee structures,
            admission registration rules and prerequisites, offers or the
            operating rules and policies applicable to each Service (for
            example, Institution Fee, last date of registration, venue for
            seminar etc.). The User shall be responsible for ensuring compliance
            with the terms and guidelines or operating rules and policies of the
            Institution with whom the User elects to deal, including terms and
            conditions set forth in an Institution’s rules and regulations.
            SRS’s Services are offered to the User conditioned on acceptance
            without modification of all the terms, conditions and notices
            contained in this Agreement and the TOS, as may be applicable from
            time to time. For the removal of doubts, it is clarified that
            availing of the Services by the User constitutes an acknowledgement
            and acceptance by the User of this Agreement and the TOS. If the
            User does not agree with any part of such terms, conditions and
            notices, the User must not avail SRS’s Services. In the event that
            any of the terms, conditions, and notices contained herein conflict
            with the Additional Terms or other terms and guidelines contained
            within any other SRS document, then these terms shall control.
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
