import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllCLientCodeSlice } from "../../slices/approver-dashboard/approverDashboardSlice"
import WalletDetail from "../dashboard/AllPages/Profile/WalletDetail"
import { merchantSubscribedPlanData } from "../../slices/merchant-slice/productCatalogueSlice"
import moment from "moment";
import { isNull } from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { getSubscribedDetails } from "../../slices/merchant-slice/productCatalogueSlice"

const MerchantBalance = () => {

  const dispatch = useDispatch()
  const { approverDashboard } = useSelector(state => state)
  const { clientCodeList } = approverDashboard
  const [walletDisplayData, setWalletDisplayData] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientCodeListt, setClientCodeListt] = useState([]);

  
  

  


  const { auth, productCatalogueSlice } = useSelector((state) => state);
  const { user } = auth
  const { SubscribedPlanData, isLoading, walletCommission} = productCatalogueSlice
 
  const balanceCalculate = (purchaseAmount, commission) => {
    let cmsin = commission ?? 0
    const total = parseFloat(purchaseAmount) - parseFloat(cmsin)
    return isNaN(total) ? 0.00 : total.toFixed(2)
  }

  

// Handle change in the select dropdown
  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedClientId(selectedOption);
    const postData = {
      clientCode: selectedOption
    };
 dispatch(merchantSubscribedPlanData(postData));
    };



  // useEffect(() => {
  //   const postData = {
  //     clientId: "2078"
  //   }
  //   dispatch(merchantSubscribedPlanData(postData))
  // }, [2078])

  // useEffect(() => {
  //   let dataWallet = []
  //   SubscribedPlanData?.map((data, i) => (

  //     dataWallet.push(<div className="col-lg-4 mx-3 my-1" key={uuidv4()}>
  //       <div className="card" style={{ width: '18rem' }}>
  //         <div className="card-body">
  //           <h5 className="card-title">{data.applicationName}</h5>
  //           <p className="card-subtitle mb-2 text-body-secondary">Plan : {data.planName}</p>
  //           <hr />

  //           {isNull(data?.mandateStatus) && data?.mandateStatus?.toLowerCase() !== "success" &&
  //             data?.plan_code === "005" && <p className="text-danger"> Payment is pending </p>}

  //           {data?.mandateStatus === "SUCCESS" && data?.plan_code === "005" && (
  //             <> <p className="card-text">Subscribed Date : {moment(data.mandateStartTime).format('DD/MM/YYYY')} </p>
  //               <p className="card-text">Purchased Amount : {data.purchaseAmount} INR</p>
  //               <p className="card-text">Commission : {data.commission ?? 0} INR</p>
  //               <p className="card-text">Wallet Balance : {balanceCalculate(data.purchaseAmount, data.commission)} INR</p></>)}
  //         </div>
  //       </div>
  //     </div>)

  //   ))
  //   setWalletDisplayData(dataWallet)
  // }, [SubscribedPlanData])

  useEffect(()=>{
    dispatch(getSubscribedDetails()).then((res)=>{
      const detail=res?.payload?.data
      setClientCodeListt(detail)
    })
    
    
  },[dispatch])


  return (

    <section className="">
      <main className="">
        <div className="">
          <h5 className="ml-4">Merchant Balance</h5>
        </div>
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <div className="form-group">
                <label className="form-label">Client Code</label>
                <select
                  className="form-select"
                  onChange={handleSelectChange}
                  value={selectedClientId}
                >
                  <option value="Select a Document">Select Client Code</option>
                  {clientCodeListt?.map((data, i) => (
                    <option value={data.clientCode} key={uuidv4()}>
                      {data.clientCode} - {data.clientName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            {selectedClientId && 


            <WalletDetail walletDisplayData={SubscribedPlanData} walletCommission={walletCommission} isLoading={isLoading}/>

            }
          </div>

        </div>

      </main>
    </section>

  )

}

export default MerchantBalance