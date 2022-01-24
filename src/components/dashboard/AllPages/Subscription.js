import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { subscriptionplan, subscriptionPlanDetail } from "../../../slices/dashboardSlice";

const Subsciption = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(false);
  const { message } = useSelector((state) => state.message);
  const subscriptionData = useSelector(state => state.subscribe);
  const [subscriptionPlanData,setSubscriptionData] = useState(subscriptionData);
  const {dashboard,auth} = useSelector((state)=>state);
  const { isLoading , subscribe } = dashboard;
 console.log("subsciption.js", subscriptionplan);  
 const dispatch = useDispatch();
//     useEffect(() => {
//         dispatch(subscriptionplan());
//     }, [])

    useEffect(()=>{
        dispatch(subscriptionplan());
        console.log('subscriptionData',subscriptionData);
    },[])

  const handleSubscribe = () => {
    setSubscriptionDetails(true);
  }

  

return (
    <section className="ant-layout">
                <div className="profileBarStatus">
                </div>
                <main className="gx-layout-content ant-layout-content">
                    <div className="gx-main-content-wrapper">
                        <div className="right_layout my_account_wrapper">
                            <h1 className="right_side_heading m-b-sm">Services
                            </h1>
                        </div>
                        <section className="features8 cid-sg6XYTl25a" id="features08-3">
                            <div className="container-fluid">

                                <div className="row">
                                    <div className="card- col-12 col-md-6 col-lg-4">
                                        <div className="card-wrapper card1">
                                            <div className="card-box align-left">
                                                <div className="iconfont-wrapper">
                                                    <span className="mbr-iconfont mobi-mbri-cash mobi-mbri"></span>
                                                </div>
                                                <h5 className="card-title mbr-fonts-style display-5">Gateway</h5>
                                                <p className="card-text mbr-fonts-style display-7">Lorem ipsum dolor sit
                                                    amet, consectetur
                                                    adipiscing
                                                    elit.</p>
                                                <span className="Click-here- ant-btn ant-btn-default">Read more</span>
                                                <button className="Click-here ant-btn ant-btn-primary" onClick={handleSubscribe}>Subscribes</button>

                                            </div>
                                        </div>
                                    </div>
                                {subscriptionDetails &&    
                                <div className="custom-model-main model-open">
                                    <div className="custom-model-inner">
                                            <div className="close-btn">×</div>
                                            <div className="custom-model-wrap">
                                                <div className="pop-up-content-wrap">
                                                    <h3>Welcome !</h3>
                                                    <h4 style={{ paddingBottom:5 }}>Subscription details are mention below.</h4>
                                                    <table className="tables" cellpadding="10" cellspacing="10" width="100%">
                                                        <tbody><tr>
                                                            <th><input type="checkbox" id="vehicle2" name="vehicle2" value="Monthly"/> Monthly Plan</th>
                                                            <th><input type="checkbox" id="vehicle2" name="vehicle2" value="Yearly"/> Yearly Plan</th>
                                                        </tr>
                                                        <tr>
                                                            <td>Rs - 5000</td>
                                                            <td>Rs - 55000</td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2">
                                                                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                                                                <label for="vehicle1"> I agree all terms and condition.</label>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2"><a href="successsubscription.html" className="Click-here ant-btn ant-btn-primary float-right">Confirm Your Subscription</a></td>
                                                        </tr>
                                                    </tbody></table>
                                                    
                                                </div>
                                            </div>
                                    </div>
                                    <div className="bg-overlay"></div>
                                </div>
                                }
                                    <div className="card- col-12 col-md-6 col-lg-4">
                                        <div className="card-wrapper card2">
                                            <div className="card-box align-left">
                                                <div className="iconfont-wrapper">
                                                    <span className="mbr-iconfont mobi-mbri-change-style mobi-mbri"></span>
                                                </div>
                                                <h5 className="card-title mbr-fonts-style display-5">Offline Challan</h5>
                                                <p className="card-text mbr-fonts-style display-7">Lorem ipsum dolor sit
                                                    amet, consectetur
                                                    adipiscing elit.</p>
                                                <span className="Click-here- ant-btn ant-btn-default">Read more</span>
                                                <span className="Click-here ant-btn ant-btn-primary">Subscribes</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card- col-12 col-md-6 col-lg-4">
                                        <div className="card-wrapper card3">
                                            <div className="card-box align-left">
                                                <div className="iconfont-wrapper">
                                                    <span className="mbr-iconfont mobi-mbri-photo mobi-mbri"></span>
                                                </div>
                                                <h5 className="card-title mbr-fonts-style display-5">QwikForm</h5>
                                                <p className="card-text mbr-fonts-style display-7">Lorem ipsum dolor sit
                                                    amet, consectetur
                                                    adipiscing elit.</p>
                                                <span className="Click-here- ant-btn ant-btn-default">Read more</span>
                                                <span className="Click-here ant-btn ant-btn-primary">Subscribes</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card- col-12 col-md-6 col-lg-4">
                                        <div className="card-wrapper card4">
                                            <div className="card-box align-left">
                                                <div className="iconfont-wrapper">
                                                    <span className="mbr-iconfont mobi-mbri-rocket mobi-mbri"></span>
                                                </div>
                                                <h5 className="card-title mbr-fonts-style display-5">QwikCollect</h5>
                                                <p className="card-text mbr-fonts-style display-7">Lorem ipsum dolor sit
                                                    amet, consectetur
                                                    adipiscing elit.</p>
                                                <h6 className="link mbr-fonts-style display-4"><a href="#" className="text-info">Read more</a></h6>


                                                <span className="Click-here- ant-btn ant-btn-default">Read more</span>
                                                <span className="Click-here ant-btn ant-btn-primary">Subscribes</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card- col-12 col-md-6 col-lg-4">
                                        <div className="card-wrapper card5">
                                            <div className="card-box align-left">
                                                <div className="iconfont-wrapper">
                                                    <span className="mbr-iconfont mobi-mbri-sites mobi-mbri"></span>
                                                </div>
                                                <h5 className="card-title mbr-fonts-style display-5">Payout</h5>
                                                <p className="card-text mbr-fonts-style display-7">Lorem ipsum dolor sit
                                                    amet, consectetur
                                                    adipiscing elit.</p>

                                                <span className="Click-here- ant-btn ant-btn-default">Read more</span>
                                                <span className="Click-here ant-btn ant-btn-primary">Subscribes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>


                    </div>
                    <footer className="ant-layout-footer">
                        <div className="gx-layout-footer-content">© 2021 Ippopay. All Rights Reserved. <span className="pull-right">Ippopay's GST Number : 33AADCF9175D1ZP</span></div>
                    </footer>
                </main>
            </section>
)


}

export default Subsciption
