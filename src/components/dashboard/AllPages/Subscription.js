import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { subscriptionplan } from "../../../slices/subscription";

const Subsciption = () => {
  const dispatch = useDispatch();
    useEffect(() => {
        dispatch(subscriptionplan());
    }, [])

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
                                                <span className="Click-here ant-btn ant-btn-primary">Subscribes</span>

                                            </div>
                                        </div>
                                    </div>
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
