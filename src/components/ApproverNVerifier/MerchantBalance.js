import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllCLientCodeSlice } from "../../slices/approver-dashboard/approverDashboardSlice"
import WalletDetail from "../dashboard/AllPages/Profile/WalletDetail"
import { merchantSubscribedPlanData } from "../../slices/merchant-slice/productCatalogueSlice"

import { getSubscribedDetails } from "../../slices/merchant-slice/productCatalogueSlice"
import ReactSelect, { createFilter } from 'react-select';

const MerchantBalance = () => {
  const dispatch = useDispatch()
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientCodeListt, setClientCodeListt] = useState([]);
   const {  productCatalogueSlice } = useSelector((state) => state);
  const { SubscribedPlanData, isLoading, walletCommission } = productCatalogueSlice

 
  // Handle change in the select dropdown
  const handleSelectChange = (selectedOption) => {
    setSelectedClientId(selectedOption ? selectedOption.value : null); // Update selected client ID

if (selectedOption && selectedOption.value !== null && selectedOption.value !== "") {
         const postData = {
            clientCode: selectedOption.value
        };
        
    dispatch(merchantSubscribedPlanData(postData));
    }
};


useEffect(() => {
    dispatch(getSubscribedDetails()).then((res) => {
      const detail = res?.payload?.data
      setClientCodeListt(detail)
    })


  }, [dispatch])
  
  const options = [
    { value: '', label: 'Select Client Code' },
    ...clientCodeListt.map((data) => ({
      value: data.clientCode,
      label: `${data.clientCode} - ${data.clientName}`
    }))
  ]

 return (

    <section className="">
      <main className="">
        <div className="">
          <h5 className="ml-4">Subscription Wallet</h5>
        </div>
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <div className="form-group">
                <label className="form-label">Client Code</label>
                <ReactSelect
                  className="zindexforDropdown"
                  onChange={handleSelectChange}
                  value={selectedClientId ? { value: selectedClientId, label: selectedClientId } : null}
                  options={options}
                  placeholder="Select Client Code"
                  filterOption={createFilter({ ignoreAccents: false })}
                />
              </div>
            </div>
          </div>
          <div>
            {selectedClientId &&
              <WalletDetail walletDisplayData={SubscribedPlanData} walletCommission={walletCommission} isLoading={isLoading} />

            }
          </div>

        </div>

      </main>
    </section>

  )

}

export default MerchantBalance