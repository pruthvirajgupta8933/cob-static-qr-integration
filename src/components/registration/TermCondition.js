import React, { useState } from 'react'

function TermCondition({acceptTnC,callbackHandler, setFieldValues}) {


  const [checked, setChecked] = useState(false);

  const onChangeHandler=()=>{
    callbackHandler(!acceptTnC,checked)
    setFieldValues("terms_and_condition", checked)
  }



  return (
    <div><div
    className="modal fade show"
    id="exampleModal"
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    style={{display: acceptTnC ? "block" : "none"}}
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title" id="exampleModalLabel">
            Terms and Conditions
          </h2>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={()=>onChangeHandler()}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body overflow-auto max-height-signup">
          <div className="term-condintion ">
                <h3 className="text-center">Terms & Conditions</h3>
                <p><strong>Last Updated Date: 30/11/2021</strong></p>
                <p>
                This agreement (“user agreement”) incorporates the Terms and Conditions for SRS Live Technologies Pvt. Ltd. and its affiliate Companies (“SRS”) to provide services to the person (s) (“the User”) intending to purchase or inquiring for any products and/ or services of SRS by using SRS’s websites or using any other customer interface channels of SRS which includes its sales persons, offices, call centers, advertisements, information campaigns etc.
                Both User and SRS are individually referred as ‘party’ to the agreement and collectively referred to as ‘parties’.
                </p>

                <h2>Terms and Conditions: User’s responsibility of cognizance of this agreement</h2>
                <p>The Users availing services from SRS shall be deemed to have read, understood and expressly accepted the terms and conditions of this agreement, which shall govern the desired transaction or provision of such services by SRS for all purposes, and shall be binding on the User. All rights and liabilities of the User and/or SRS with respect to any services to be provided by SRS shall be restricted to the scope of this agreement. SRS reserves the right, in its sole discretion, to terminate the access to any or all SRS websites or its other sales channels and the related services or any portion thereof at any time, without notice, for general maintenance or any reason what so ever. In addition to this Agreement, there are certain terms of service (TOS) specific to the services rendered/ products provided by SRS like the fee collection, new admissions, registration for seminars, workshops, trade fairs, campus placements etc. Such TOS will be provided/ updated by SRS which shall be deemed to be a part of this Agreement and in the event of a conflict between such TOS and this Agreement, the terms of this Agreement shall prevail. The User shall be required to read and accept the relevant TOS for the service/ product availed by the User. Additionally, the Institution (SRS’s client) itself may provide terms and guidelines that govern particular fee structures, admission registration rules and prerequisites, offers or the operating rules and policies applicable to each Service (for example, Institution Fee, last date of registration, venue for seminar etc.). The User shall be responsible for ensuring compliance with the terms and guidelines or operating rules and policies of the Institution with whom the User elects to deal, including terms and conditions set forth in an Institution’s rules and regulations. SRS’s Services are offered to the User conditioned on acceptance without modification of all the terms, conditions and notices contained in this Agreement and the TOS, as may be applicable from time to time. For the removal of doubts, it is clarified that availing of the Services by the User constitutes an acknowledgement and acceptance by the User of this Agreement and the TOS. If the User does not agree with any part of such terms, conditions and notices, the User must not avail SRS’s Services. In the event that any of the terms, conditions, and notices contained herein conflict with the Additional Terms or other terms and guidelines contained within any other SRS document, then these terms shall control.</p>

                <p>In addition to this Agreement, there are certain terms of service (TOS) specific to the services rendered/ products provided by SRS like the fee collection, new admissions, registration for seminars, workshops, trade fairs, campus placements etc. Such TOS will be provided/ updated by SRS which shall be deemed to be a part of this Agreement and in the event of a conflict between such TOS and this Agreement, the terms of this Agreement shall prevail. The User shall be required to read and accept the relevant TOS for the service/ product availed by the User.</p>

                <p>Additionally, the Institution (SRS’s client) itself may provide terms and guidelines that govern particular fee structures, admission registration rules and prerequisites, offers or the operating rules and policies applicable to each Service (for example, Institution Fee, last date of registration, venue for seminar etc.). The User shall be responsible for ensuring compliance with the terms and guidelines or operating rules and policies of the Institution with whom the User 
                elects to deal, including terms and conditions set forth in an Institution’s rules and regulations.</p>

                <p>SRS’s Services are offered to the User conditioned on acceptance without modification of all the terms, conditions and notices contained in this Agreement and the TOS, as may be applicable from time to time. For the removal of doubts, it is clarified that availing of the Services by the User constitutes an acknowledgement and acceptance by the User of this Agreement and the TOS. If the User does not agree with any part of such terms, conditions and notices, the User must not avail SRS’s Services.</p>
                
                <p>In the event that any of the terms, conditions, and notices contained herein conflict with the Additional Terms or other terms and guidelines contained within any other SRS document, then these terms shall control.</p>

                <h2>Terms and Conditions: Third Party Account Information</h2>


                <p>By using the Account Access service in SRS’s websites, the User authorizes SRS and its agents to access third party sites, including that of Banks and other payment gateways, designated by them or on their behalf for retrieving requested information. While registering, the User will choose a password and is responsible for maintaining the confidentiality of the password and the account. The User is fully responsible for all activities that occur while using their password or account. It is the duty of the User to notify SRS immediately in writing of any unauthorized use of their password or account or any other breach of security. SRS will not be liable for any loss that may be incurred by the User as a result of unauthorized use of his password or account, either with or without his knowledge. The User shall not use anyone else’s password at any time.</p>

                <h2>Fees Payment</h2>
                <p>SRS reserves the right to charge listing fees for certain listings, as well as transaction fees based on certain completed transactions using the services. SRS further reserves the right to alter any and all fees from time to time, without notice.</p>

                <p>The User shall be completely responsible for all charges, fees, duties, taxes, and assessments arising out of the use of the services.</p>

                <p>In case, there is a short charging by SRS for listing, services or transaction fee or any other fee or service because of any technical or other reason, it reserves the right to deduct/charge/claim the balance subsequent to the transaction at its own discretion.</p>

                <p>In the rare possibilities of the fee payment not getting confirmed for any reason whatsoever, we will process the refund and intimate you of the same. SRS is not under any obligation to make repayment in lieu of or to compensate/repay the unconfirmed one. All subsequent further fee payments will be treated as new transactions with no reference to the earlier unconfirmed payment.</p>

                <h2>Confidentiality</h2>

                <p>Any information which is specifically mentioned by SRS as Confidential shall be maintained confidentially by the user and shall not be disclosed unless as required by law or to serve the purpose of this agreement and the obligations of both the parties therein.</p>

                <h2>Usage Of The Mobile Number Of The User By SRS</h2>

                <p>SRS may send payment confirmation, fee receipt information, payment failure, refund status, due date information, delayed fee payment or any such other information relevant for the transaction, via SMS or by voice call on the contact number given by the User at the time of fee payment; SRS may also contact the User by voice call, SMS or email in case the User couldn’t or hasn’t paid the fees, for any reason what so ever, to know the preference of the User for fee payment within due date or delayed payment and also to help the User for the same. The User hereby unconditionally consents that such communications via SMS and/ or voice call by SRS is (a) upon the request and authorization of the User, (b) “transactional” and not an “unsolicited commercial communication” as per the guidelines of Telecom Regulation Authority of India (TRAI) and (c) in compliance with the relevant guidelines of TRAI or such other authority in India and abroad. The User will indemnify SRS against all types of losses and damages incurred by SRS due to any action taken by TRAI, Access Providers (as per TRAI regulations) or any other authority due to any erroneous compliant raised by the User on SRS with respect to the intimations mentioned above or due to a wrong number or email id being provided by the User for any reason whatsoever.</p>

                <h2>Onus Of The User</h2>

                <p>SRS is responsible only for the transactions that are done by the User through SRS. SRS will not be responsible for screening, censoring or otherwise controlling transactions, including whether the transaction is legal and valid as per the laws of the land of the User.</p>

                <p>The User warrants that they will abide by all such additional procedures and guidelines, as modified from time to time, in connection with the use of the services. The User further warrants that they will comply with all applicable laws and regulations regarding use of the services with respect to the jurisdiction concerned for each transaction.</p>

                <p>The User represent and confirm that the User is of legal age to enter into a binding contract and is not a person barred from availing the Services under the laws of India or other applicable law.</p>

                <h2>Advertisers on SRS or linked websites</h2>

                <p>SRS is not responsible for any errors, omissions or representations on any of its pages or on any links or on any of the linked website pages. SRS does not endorse any advertiser on its web pages in any manner. The Users are requested to verify the accuracy of all information on their own before undertaking any reliance on such information.</p>

                <p>The linked sites are not under the control of SRS and SRS is not responsible for the contents of any linked site or any link contained in a linked site, or any changes or updates to such sites. SRS is providing these links to the Users only as a convenience and the inclusion of any link does not imply endorsement of the site by SRS.</p>

                <h2>Force Majure Circumstances</h2>

                <p>The user agrees that there can be exceptional circumstances where the Institutions like the schools, colleges, universities or concerns may be unable to honor the fee payment due to various reasons like climatic conditions, labor unrest, insolvency, business exigencies, government decisions, operational and technical issues etc. If SRS is informed in advance of such situations where dishonor of fee payments may happen, it will make its best efforts to provide similar alternative to its customers or refund the fee amount after reasonable service charges, if supported and refunded by that respective institutions. The user agrees that SRS being an agent for facilitating the booking services shall not be responsible for any such circumstances and the customers have to contact that institution directly for any further resolutions and refunds.</p>
                
                
                <p>The User agrees that in situations due to any technical or other failure in SRS, services committed earlier may not be provided or may involve substantial modification. In such cases, SRS shall refund the entire amount received from the customer for availing such services minus the applicable cancellation, refund or other charges, which shall completely discharge any and all liabilities of SRS against such non-provision of services or deficiencies. Additional liabilities, if any, shall be borne by the User.</p>

                <p>SRS shall not be liable for delays or inabilities in performance or non-performance in whole or in part of its obligations due to any causes that are not due to its acts or omissions and are beyond its reasonable control, such as acts of God, fire, strikes, embargo, acts of government, acts of terrorism or other similar causes, problems at schools, colleges, coaching institutes, universities or clubs end. In such event, the user affected will be promptly given notice as the situation permits.</p>

                <p>Without prejudice to whatever is stated above, the maximum liability on part of SRS arising under any circumstances, in respect of any services offered on the site, shall be limited to the refund of total amount received from the customer for availing the services less any cancellation, refund or others charges, as may be applicable. In no case the liability shall include any loss, damage or additional expense whatsoever beyond the amount charged by SRS for its services.</p>

                <p>In no event shall SRS and/or its service providers be liable for any direct, indirect, punitive, incidental, special, consequential damages or any damages whatsoever including, without limitation, damages for loss of use, data or profits, arising out of or in any way connected with the use or performance of the SRS website(s) or any other channel . Neither shall SRS be responsible for the delay or inability to use the SRS websites or related services, the provision of or failure to provide services, or for any information, software, products, services and related graphics obtained through the SRS website(s), or otherwise arising out of the use of the SRS website(s), whether based on contract, tort, negligence, strict liability or otherwise.</p>


                <p>SRS is not responsible for any errors, omissions or representations on any of its pages or on any links or on any of the linked website pages. However, in the scenario where the user ends up being charged duplicate (double or more) for one transaction, the additional amount erroneously charged will be refunded via the same source within 07 to 10 working days.</p>

                <h2>Safety Of Data Downloaded</h2>

                <p>The User understands and agrees that any material and/or data downloaded or otherwise obtained through the use of the Service is done entirely at their own discretion and risk and they will be solely responsible for any damage to their computer systems or loss of data that results from the download of such material and/or data.</p>

                <p>Nevertheless, SRS will always make its best endeavors to ensure that the content on its websites or other information channels are free of any virus or such other malwares.</p>

                <h2>Feedback From Customer And Solicitation</h2>
                <p>The User is aware that SRS provides various services like fee collection, online registration for several purposes, report card management, library management, etc and would like to learn about them, to enhance his / her experience. The User hereby specifically authorizes SRS to contact the User with offers on various services offered by it through direct mailers, e-mailers, telephone calls, short messaging services (SMS) or any other medium, from time to time. In case that the customer chooses not to be contacted, he /she shall write to SRS for specific exclusion at service@srslive.in or provide his / her preferences to the respective Institution. The customers are advised to read and understand the privacy policy of SRS on its website in accordance of which SRS contacts, solicits the user or shares the user’s information.</p>
                
                <h2>Terms and Conditions: Proprietary Rights</h2>


                <p>SRS may provide the User with contents such as sound, photographs, graphics, video or other material contained in sponsor advertisements or information. This material may be protected by copyrights, trademarks, or other intellectual property rights and laws.</p>

                <p>The User may use this material only as expressly authorized by SRS and shall not copy, transmit or create derivative works of such material without express authorization.</p>
                
                <p>The User acknowledges and agrees that he/she shall not upload post, reproduce, or distribute any content on or through the Services that is protected by copyright or other proprietary right of a third party, without obtaining the written permission of the owner of such right.</p>

                <p>Any copyrighted or other proprietary content distributed with the consent of the owner must contain the appropriate copyright or other proprietary rights notice. The unauthorized submission or distribution of copyrighted or other proprietary content is illegal and could subject the User to personal liability or criminal prosecution</p>

                <h2>Personal And Non-Commercial Use Limitation</h2>

                <p>Unless otherwise specified, the SRS services are for the User’s personal and non – commercial use. The User may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products or services obtained from the SRS website(s) without the express written approval from SRS.</p>

                <h2>Indemnification</h2>

                <p>The User agrees to indemnify, defend and hold harmless SRS and/or its affiliates, their websites and their respective lawful successors and assigns from and against any and all losses, liabilities, claims, damages, costs and expenses (including reasonable legal fees and disbursements in connection therewith and interest chargeable thereon) asserted against or incurred by SRS and/or its affiliates, partner websites and their respective lawful successors and assigns that arise out of, result from, or may be payable by virtue of, any breach or non-performance of any representation, warranty, covenant or agreement made or obligation to be performed by the User pursuant to this agreement.</p>
                
                
                <p>The user shall be solely and exclusively liable for any breach of any country specific rules and regulations or general code of conduct and SRS cannot be held responsible for the same.</p>

                <h2>Right To Refuse</h2>

                <p>SRS at its sole discretion reserves the right to not to accept any fees without assigning any reason thereof. Any contract to provide any service by SRS is not complete until full money towards the service is received from the client and accepted by SRS.Without prejudice to the other remedies available to SRS under this agreement, the TOS or under applicable law, SRS may limit the user’s activity, or end the user’s listing, warn other users of the user’s actions, immediately temporarily/indefinitely suspend or terminate the user’s registration, and/or refuse to provide the user with access to the website if:</p>

                <p>The user is in breach of this agreement, the TOS and/or the documents it incorporates by reference;
                SRS is unable to verify or authenticate any information provided by the user; or
                SRS believes that the user’s actions may infringe on any third party rights or breach any applicable law or otherwise result in any liability for the user, other users of the website and/or SRS.</p>
                <p>SRS may at any time in its sole discretion reinstate suspended users. Once the user have been indefinitely suspended the user shall not register or attempt to register with SRS or use the website in any manner whatsoever until such time that the user is reinstated by SRS.</p>

                <p>Notwithstanding the foregoing, if the user breaches this agreement, the TOS or the documents it incorporates by reference, SRS reserves the right to recover any amounts due and owing by the user to SRS and/or the service provider and to take strict legal action as SRS deems necessary.</p>

                <h2>Right to Cancellation By SRS In Case Of Invalid Information From User</h2>

                <p>The User expressly undertakes to provide to SRS only correct and valid information while requesting for any services under this agreement, and not to make any misrepresentation of facts at all. Any default on part of the User would vitiate this agreement and shall disentitle the User from availing the services from SRS.</p>
                <p>In case SRS discovers or has reasons to believe at any time during or after receiving a request for services from the User that the request for services is either unauthorized or the information provided by the User or any of them is not correct or that any fact has been misrepresented by him/her, SRS in its sole discretion shall have the unrestricted right to take any steps against the User(s), including cancellation of the fees paid, etc. without any prior intimation to the User. In such an event, SRS shall not be responsible or liable for any loss or damage that may be caused to the User or any of them as a consequence of such cancellation of the fees paid or services.</p>
                <p>The User unequivocally indemnifies SRS of any such claim or liability and shall not hold SRS responsible for any loss or damage arising out of measures taken by SRS for safeguarding its own interest and that of its genuine Clients. This would also include SRS denying/cancelling any fees, registration, etc on account of suspected fraud transactions. Fees once paid are nonrefundable for any reason or any cancellation as per the clause of NIT Jalandhar.</p>

                <h2>Interpretation Number and Gender</h2>

                <p>The terms and conditions herein shall apply equally to both the singular and plural form of the terms defined. Whenever the context may require, any pronoun shall include the corresponding masculine, feminine and neuter form. The words “include”, “includes” and “including” shall be deemed to be followed by the phrase “without limitation”. Unless the context otherwise requires, the terms “herein”, “hereof”, “hereto”, ‘hereunder” and words of similar import refer to this agreement as a whole.</p>

                <h2>Severability</h2>
                <p>If any provision of this agreement is determined to be invalid or unenforceable in whole or in part, such invalidity or unenforceability shall attach only to such provision or part of such provision and the remaining part of such provision and all other provisions of this Agreement shall continue to be in full force and effect.</p>

                
                <h2>Headings</h2>
                <p>The headings and subheadings herein are included for convenience and identification only and are not intended to describe, interpret, define or limit the scope, extent or intent of this agreement, terms and conditions, notices, or the right to use this website by the User contained herein or any other section or pages of SRS Websites or its partner websites or any provision hereof in any manner whatsoever.
                
                In the event that any of the terms, conditions, and notices contained herein conflict with the Additional Terms or other terms and guidelines contained within any particular SRS website, then these terms shall control.</p>
                
                <h2>Relationship</h2>
                <p>None of the provisions of any agreement, terms and conditions, notices, or the right to use this website by the User contained herein or any other section or pages of SRS Websites or its partner websites, shall be deemed to constitute a partnership between the User and SRS and no party shall have any authority to bind or shall be deemed to be the agent of the other in any way.</p>

                <h2>Updation Of The Information By SRS</h2>
                <p>User acknowledges that SRS provides services with reasonable diligence and care. It endeavours its best to ensure that User does not face any inconvenience. However, at some times, the information, software, products, and services included in or available through the SRS websites or other service channels and ad materials may include inaccuracies or typographical errors which will be immediately corrected as soon as SRS notices them. Changes are/may be periodically made/added to the information provided such. SRS may make improvements and/or changes in the SRS websites at any time without any notice to the User. Any advice received except through an authorized representative of SRS via the SRS websites should not be relied upon for any decisions.</p>

                <h2>Modification Of These Terms Of Use</h2>
                <p>SRS reserves the right to change the terms, conditions, and notices under which the SRS websites are offered, including but not limited to the charges. The User is responsible for regularly reviewing these terms and conditions.</p>

                <h2>Jurisdiction</h2>
                <p>SRS hereby expressly disclaims any implied warranties imputed by the laws of any jurisdiction or country other than those where it is operating its offices. SRS considers itself and intends to be subject to the jurisdiction only of the courts of NCR of Delhi, India.</p>
                
                <h2>Responsibilities Of User Vis-a-Vis The Agreement</h2>
                <p>The User expressly agrees that use of the services is at their sole risk. To the extent SRS acts only as an agent on behalf of Institutions, it shall not have any liability whatsoever for any aspect of the standards of services provided by the Institutions. In no circumstances shall SRS be liable for the services provided by the Institutions. The services are provided on an “as is” and “as available” basis. SRS may change the features or functionality of the services at any time, in their sole discretion, without notice. SRS expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement. No advice or information, whether oral or written, which the User obtains from SRS or through the services shall create any warranty not expressly made herein or in the terms and conditions of the services. If the User does not agree with any of the terms above, they are advised not to read the material on any of the SRS pages or otherwise use any of the contents, pages, information or any other material provided by SRS. The sole and exclusive remedy of the User in case of disagreement, in whole or in part, of the user agreement, is to discontinue using the services after notifying SRS in writing.</p>

                {/* <div className="form-check-inline" style={{alignItems:"baseline"}}>
                  <span><input className="form-check-input" type="checkbox"  id="defaultCheck1" checked={checked}  onChange={e => setChecked(!checked)} /></span>
                  <span><label className="form-check-label text-bold text-danger" htmlFor="defaultCheck1" >  I agree to the Terms and Conditions</label></span>
                </div> */}
                </div>
                </div>
              
                <div className="w-25 m-3" >
                <button  type="button" className="closebtn text-white" onClick={()=>onChangeHandler()}>Close</button></div>
                
                <div className="dropdown-divider"></div>
        <div className="modal-footer">
        </div>
      </div>
    </div>
  </div>
  </div>
  )
}

export default TermCondition