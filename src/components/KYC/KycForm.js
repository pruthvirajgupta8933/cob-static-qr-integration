import React, { useState , useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import BankDetails from './BankDetails';
import BusinessDetails from './BusinessDetails';
import BusinessOverview from './BusinessOverview';
import ContactInfo from './ContactInfo';
import DocumentsUpload from './DocumentsUpload';
import SubmitKyc from './SubmitKyc';
import FormikController from '../../_components/formik/FormikController'
import { kycUserList, kycDocumentUploadList, kycVerificationForTabs } from "../../slices/kycSlice"
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson"


function KycForm() {
  const dispatch = useDispatch();
    const [tab,SetTab] = useState(1);
    const [visibility, setVisibility] = useState(false);
  const [selectedMerchant,setSelectedMerchant] = useState('');
    const { auth} = useSelector((state)=>state);
    const {user} = auth;

    const { loginId } = user;
    let history = useHistory();

   const merchantList =  user.clientMerchantDetailsList
   console.log(merchantList, "<=====Merchant List =======>")

    const MerchantClietCode = merchantList.map(merchants => { return merchants.clientCode} )

    console.log(MerchantClietCode, "============>")

     
  if(user.roleId!==3 && user.roleId!==13){
    if(user.clientMerchantDetailsList===null){
      history.push('/dashboard/profile');
    }
  } 






//------------------------------------------------------------------


  //------------- Kyc  User List ------------//
  useEffect(() => {
    dispatch(kycUserList({
      login_id:loginId

    })).then((res) => {
      // console.log(res)
    });
  },[kycUserList])

  //-----------------------------------------//

  //-----------Kyc Document Upload List ------//

  useEffect(() => {
    dispatch(kycDocumentUploadList({
      login_id:loginId

    })).then((res) => {
      // console.log(res)
    });
  },[kycDocumentUploadList])

  //--------------------------------------//


  //API Integrated For Verification Of All Tabs ------------//


  useEffect(() => {
    dispatch(kycVerificationForTabs({
      login_id:loginId

    })).then((res) => {
      // console.log(res)
    });
  },[kycDocumentUploadList])

  //--------------------------------------------------------

  const onChangeMerchant = () => {
    
  }




    
   

  return (
    <section className="ant-layout">
    <div className="profileBarStatus">
    </div>
    <main className="gx-layout-content ant-layout-content">
      <div className="gx-main-content-wrapper">
        <div className="right_layout my_account_wrapper right_side_heading">
          <h1 className="m-b-sm gx-float-left">KYC Form</h1>
        </div>
        <section className="features8 cid-sg6XYTl25a flleft" id="features08-3-">
          <div className="container-fluid">
            <div className="row bgcolor">
              <div className="col-lg-12 mb-4 bgcolor-">
                {/* --------First Phase of Selecting the Merchants---------- */}
              {<>
                <div className="form-row">
                <div className="form-group col-md-4">
                <select
                    value={selectedMerchant}
                    onChange={(e) => e.target.value}
                    className="ant-input"
                    label="Select The Merchant"
                    
                  >
                    <option value="">Select Merchants</option>
                    {merchantList?.map((item,i) => {
                      return (
                        <option value={item.clientCode} key={i}>
                          {item.clientCode + " - " + item.clientName}
                        </option>
                      );
                    })}
                  
                  </select>
              </div>
              <div class="position-sticky col-lg-4">
              <button className="btn btn-primary pull-left" type="submit" >Proceed with KYC</button>
              </div>
              </div>
                {/* --------First Phase of Selecting the Merchants---------- */}
              
              </>}
              <ul className="nav nav-tabs">
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===1? "activepaylink":"inactive") } onClick={()=>SetTab(1)} >Merchant Contact Info</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===2? "activepaylink":"inactive") } onClick={()=>SetTab(2)} >Business Overview</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===3? "activepaylink":"inactive") }  onClick={()=>SetTab(3)}>Business Details</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===4? "activepaylink":"inactive") } onClick={()=>SetTab(4)}>Bank Details</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===5? "activepaylink":"inactive") } onClick={()=>SetTab(5)}>Documents Upload</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===6? "activepaylink":"inactive") } onClick={()=>SetTab(6)}>Submit KYC</a>
                          </li>
                      </ul>
              </div>

              <section className="features8 cid-sg6XYTl25a flleft col-lg-12" id="features08-3-">
          <div className="container-fluid">
            <div className="row">
              {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                lazy dog.The quick brown fox jumps over the lazy dog.</p> */}

                  {(tab === 1 &&
                      <ContactInfo />)
                  || (tab === 2 &&
                      <BusinessOverview />)                        
                  ||  (tab === 3 &&
                      <BusinessDetails/>)
                  ||  (tab === 4 &&
                      <BankDetails/>)
                  ||  (tab === 5 &&
                      <DocumentsUpload/>)
                  ||  (tab === 6 &&
                      <SubmitKyc/>)
                  ||
                      <ContactInfo />
                  }
            </div>
          </div></section>
            </div>
          </div>
        </section>
      </div>
    </main>
  </section>
  )
}

export default KycForm