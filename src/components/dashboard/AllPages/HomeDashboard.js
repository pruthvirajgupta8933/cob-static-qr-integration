import React from 'react'

function Home() {
    return (
        <section className="ant-layout">
        <div className="profileBarStatus">
          {/*
          <div class="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span
                class="btn">Upload Here</span></span></div>*/}
        </div>
        <main className="gx-layout-content ant-layout-content">
          <div className="gx-main-content-wrapper">
            <div>
              <div className="ant-col gx-order-sm-1 ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24">
                <div className="ant-row">
                  <div className="ant-col dashboard_wrapper ant-col-xs-24 ant-col-sm-24 ant-col-md-11 ant-col-lg-24 ant-col-xl-11">
                    <div className="ant-card gx-card-widget  ant-card-bordered">
                      <div className="ant-card-body">
                        <div className="ant-row">
                          <div className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-12">
                            <h2 className="h4 gx-mb-3">Your Current Balance</h2>
                            <div className="ant-row-flex gx-mb-3">
                              <h2 className="font-22 gx-mr-2 gx-mb-1 gx-fs-xxxl gx-font-weight-bold">₹0.00</h2>
                              <h4 className="hide gx-pt-2 gx-chart-up">64% <i className="icon icon-menu-up gx-fs-sm" /></h4>
                            </div>
                            <div className="ant-row-flex gx-mb-0 gx-mb-md-2"><a className="view_history" href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/transaction/list">View History</a></div>
                            <p className="gx-text-grey gx-mb-0"> </p>
                          </div>
                          <div className="ant-col revenue_wrap ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-12">
                            <div className="gx-site-dash">
                              <h5 className="font-14 gx-mb-3">Revenue Stats</h5>
                              <ul className="gx-line-indicator gx-fs-sm gx-pb-1 gx-pb-sm-0">
                                <li>
                                  <div className="ant-row-flex">
                                    <p className="gx-mr-1">December</p>
                                    <p className="gx-text-grey">| </p>
                                  </div>
                                  <div className="gx-line-indi-info">
                                    <div className="gx-line-indi gx-bg-primary" style={{width: '4px'}} /><span className="gx-line-indi-count gx-ml-2">0%</span>
                                  </div>
                                </li>
                                <li>
                                  <div className="ant-row-flex">
                                    <p className="gx-mr-1">November</p>
                                    <p className="gx-text-grey">| </p>
                                  </div>
                                  <div className="gx-line-indi-info">
                                    <div className="gx-line-indi gx-bg-primary" style={{width: '4px'}} /><span className="gx-line-indi-count gx-ml-2">0%</span>
                                  </div>
                                </li>
                                <li>
                                  <div className="ant-row-flex">
                                    <p className="gx-mr-1">October</p>
                                    <p className="gx-text-grey">| </p>
                                  </div>
                                  <div className="gx-line-indi-info">
                                    <div className="gx-line-indi gx-bg-primary" style={{width: '4px'}} /><span className="gx-line-indi-count gx-ml-2">0%</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ant-col chart_top_wrap ant-col-xs-24 ant-col-sm-24 ant-col-md-13 ant-col-lg-24 ant-col-xl-13">
                    <ul className="ippo_new_tab_list_new">
                      <li><a className="active">Today</a></li>
                      <li><a className="inactive">Yesterday</a></li>
                      <li><a className="inactive">This Week</a></li>
                      <li><a className="inactive">This Month</a></li>
                      <li><a className="inactive">Last Month</a></li>
                      <li><a className="inactive">Last Quarter</a></li>
                      <li><a className="inactive">Overall</a></li>
                      <li><a className="inactive">Custom<span className="ant-calendar-picker" tabIndex={0}><span className="ant-calendar-picker-input ant-input"><input readOnly placeholder="Start date" className="ant-calendar-range-picker-input" tabIndex={-1} defaultValue /><span className="ant-calendar-range-picker-separator"> ~ </span><input readOnly placeholder="End date" className="ant-calendar-range-picker-input" tabIndex={-1} defaultValue /><i aria-label="icon: calendar" className="anticon anticon-calendar ant-calendar-picker-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="calendar" width="1em" height="1em" fill="currentColor" >
                                  <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z">
                                  </path>
                                </svg></i></span></span></a></li>
                    </ul>
                    <div className="clearfix ant-row">
                      <div className="ant-col chart_top_wrap ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-12 ant-col-xl-12">
                        <div className="ant-card gx-card-widget gx-card-full ant-card-bordered">
                          <div className="ant-card-body">
                            <div className="gx-actchart gx-px-3 gx-pt-3">
                              <div className="ant-row-flex">
                                <h2 className="gx-mb-0 gx-fs-xxl gx-font-weight-medium">₹0.00<span className="gx-mb-0 gx-ml-2 gx-pt-xl-2 gx-fs-lg gx-chart-up">23% <i className="icon icon-menu-up gx-fs-sm" /></span></h2><i className="icon icon-diamond gx-fs-xl gx-ml-auto gx-text-primary gx-fs-xxxl" />
                              </div>
                              <p className="gx-mb-0 gx-fs-sm gx-text-grey">Today Sales</p>
                            </div>
                            <div className="recharts-responsive-container" style={{width: '100%', height: '75px'}}>
                              <div className="recharts-wrapper" style={{position: 'relative', cursor: 'default', width: '279px', height: '75px'}}><svg className="recharts-surface" width={279} height={75} viewBox="0 0 279 75" version="1.1">
                                  <defs>
                                    <clipPath id="recharts16-clip">
                                      <rect x={0} y={0} height={75} width={279} />
                                    </clipPath>
                                  </defs>
                                  <defs>
                                    <linearGradient id="color3" x1={0} y1={0} x2={1} y2={0}>
                                      <stop offset="5%" stopColor="#163469" stopOpacity="0.9" />
                                      <stop offset="95%" stopColor="#FE9E15" stopOpacity="0.9" />
                                    </linearGradient>
                                  </defs>
                                  <g className="recharts-layer recharts-area">
                                    <g className="recharts-layer">
                                      <defs>
                                        <clipPath id="animationClipPath-recharts-area-17">
                                          <rect x={0} y={0} width={279} height={76} />
                                        </clipPath>
                                      </defs>
                                      <g className="recharts-layer" clipPath="url(#animationClipPath-recharts-area-17)">
                                        <g className="recharts-layer">
                                          <path strokeWidth={0} stroke="none" fill="url(#color3)" fillOpacity={1} width={279} height={75} className="recharts-curve recharts-area-area" d="M0,68.75L46.5,37.5L93,56.25L139.5,25L186,43.75L232.5,4.375L279,50L279,75L232.5,75L186,75L139.5,75L93,75L46.5,75L0,75Z">
                                          </path>
                                          <path strokeWidth={0} stroke="#4D95F3" fill="none" fillOpacity={1} width={279} height={75} className="recharts-curve recharts-area-curve" d="M0,68.75L46.5,37.5L93,56.25L139.5,25L186,43.75L232.5,4.375L279,50">
                                          </path>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </svg></div>
                              <div style={{position: 'absolute', width: '0px', height: '0px', visibility: 'hidden', display: 'none'}}>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ant-col chart_top_wrap ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-12 ant-col-xl-12">
                        <div className="ant-card gx-card-widget gx-card-full ant-card-bordered">
                          <div className="ant-card-body">
                            <div className="gx-actchart gx-px-3 gx-pt-3">
                              <div className="ant-row-flex">
                                <h2 className="gx-mb-0 gx-fs-xxl gx-font-weight-medium">0<span className="gx-mb-0 gx-ml-2 gx-pt-xl-2 gx-fs-lg gx-chart-down">47% <i className="icon icon-menu-up gx-fs-sm" /></span></h2><i className="icon icon-files gx-fs-xl gx-ml-auto gx-text-primary gx-fs-xxxl" />
                              </div>
                              <p className="gx-mb-0 gx-fs-sm gx-text-grey">No. of Today Sales</p>
                            </div>
                            <div className="recharts-responsive-container" style={{width: '100%', height: '75px'}}>
                              <div className="recharts-wrapper" style={{position: 'relative', cursor: 'default', width: '279px', height: '75px'}}><svg className="recharts-surface" width={279} height={75} viewBox="0 0 279 75" version="1.1">
                                  <defs>
                                    <clipPath id="recharts19-clip">
                                      <rect x={5} y={5} height={65} width={269} />
                                    </clipPath>
                                  </defs>
                                  <g className="recharts-layer recharts-line">
                                    <path stroke="#011b33" strokeWidth={1} fill="none" width={269} height={65} strokeDasharray="341.47503662109375px 0px" className="recharts-curve recharts-line-curve" d="M5,62.77777777777778L49.833333333333336,30.27777777777777L94.66666666666667,41.111111111111114L139.5,8.611111111111114L184.33333333333334,48.333333333333336L229.16666666666669,5L274,48.333333333333336">
                                    </path>
                                    <g className="recharts-layer recharts-line-dots">
                                      <circle r={3} stroke="#FEA931" strokeWidth={2} fill="#fff" width={269} height={65} className="recharts-dot recharts-line-dot" cx={5} cy="62.77777777777778" />
                                      <circle r={3} stroke="#FEA931" strokeWidth={2} fill="#fff" width={269} height={65} className="recharts-dot recharts-line-dot" cx="49.833333333333336" cy="30.27777777777777" />
                                      <circle r={3} stroke="#FEA931" strokeWidth={2} fill="#fff" width={269} height={65} className="recharts-dot recharts-line-dot" cx="94.66666666666667" cy="41.111111111111114" />
                                      <circle r={3} stroke="#FEA931" strokeWidth={2} fill="#fff" width={269} height={65} className="recharts-dot recharts-line-dot" cx="139.5" cy="8.611111111111114" />
                                      <circle r={3} stroke="#FEA931" strokeWidth={2} fill="#fff" width={269} height={65} className="recharts-dot recharts-line-dot" cx="184.33333333333334" cy="48.333333333333336" />
                                      <circle r={3} stroke="#FEA931" strokeWidth={2} fill="#fff" width={269} height={65} className="recharts-dot recharts-line-dot" cx="229.16666666666669" cy={5} />
                                      <circle r={3} stroke="#FEA931" strokeWidth={2} fill="#fff" width={269} height={65} className="recharts-dot recharts-line-dot" cx={274} cy="48.333333333333336" />
                                    </g>
                                  </g>
                                </svg></div>
                              <div style={{position: 'absolute', width: '0px', height: '0px', visibility: 'hidden', display: 'none'}}>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ant-col dashboard_wrappernew no-padding-right ant-col-xs-24 ant-col-sm-24 ant-col-md-15 ant-col-lg-15 ant-col-xl-15">
                    <div className="ant-card gx-card-widget  ant-card-bordered min-height-275 recent_transactions">
                      <div className="ant-card-body">
                        <div className="ant-row">
                          <div className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24">
                            <h2 className="h4 gx-mb-3">Recent Transactions<a className="view_all_link gx-float-right gx-text-primary gx-mb-0 gx-pointer gx-d-none gx-d-sm-block" href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/transaction/list">View All</a></h2>
                            <div className="gx-table-responsive">
                              <div className="react-bs-table-container">
                                <div className="react-bs-table" style={{height: '100%'}}>
                                  <div className="react-bs-container-header table-header-wrapper">
                                    <table className="table table-hover table-condensed">
                                      <colgroup>
                                        <col style={{width: '50px', minWidth: '50px'}} />
                                        <col />
                                        <col />
                                        <col />
                                        <col style={{width: '100px', minWidth: '100px'}} />
                                      </colgroup>
                                      <thead>
                                        <tr>
                                          <th className data-is-only-head="false" title="S.No" data-field="sno" style={{textAlign: 'left'}}>S.No<div />
                                          </th>
                                          <th className data-is-only-head="false" title="Transaction ID" data-field="transaction_id" style={{textAlign: 'left'}}>Transaction ID<div>
                                            </div>
                                          </th>
                                          <th className data-is-only-head="false" title="Customer Name" data-field="name" style={{textAlign: 'left'}}>Customer Name<div />
                                          </th>
                                          <th className data-is-only-head="false" title="Payment" data-field="pay_amount" style={{textAlign: 'left'}}>Payment<div />
                                          </th>
                                          <th className data-is-only-head="false" title="Status" data-field="status" style={{textAlign: 'left'}}>Status<div />
                                          </th>
                                        </tr>
                                      </thead>
                                    </table>
                                  </div>
                                  <div className="react-bs-container-body" style={{height: '100%'}}>
                                    <table className="table table-hover table-condensed">
                                      <colgroup>
                                        <col style={{width: '50px', minWidth: '50px'}} />
                                        <col />
                                        <col />
                                        <col />
                                        <col style={{width: '100px', minWidth: '100px'}} />
                                      </colgroup>
                                      <tbody>
                                        <tr className>
                                          <td data-toggle="collapse" colSpan={5} className="react-bs-table-no-data">There is
                                            no data to display</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div className="s-alert-wrapper" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ant-col dashboard_wrappernew ant-col-xs-24 ant-col-sm-24 ant-col-md-9 ant-col-lg-9 ant-col-xl-9">
                    <div className="ant-card gx-card-widget downloadMobileApps gx-pink-purple-gradient-reverse gx-text-white gx-mb-4 ant-card-bordered">
                      <div className="ant-card-body">
                        <div className="ant-row">
                          <div className="ant-col ant-col-xs-12 ant-col-sm-12 ant-col-md-12 ant-col-lg-14 ant-col-xl-16">
                            <p>Download Mobile Apps</p>
                            <h4 className="gx-font-weight-semi-bold gx-text-white gx-mb-0">Now, your account is on your
                              fingers</h4>
                          </div>
                          <div className="ant-col gx-text-right ant-col-xs-12 ant-col-sm-12 ant-col-md-12 ant-col-lg-10 ant-col-xl-8">
                            <div className="gx-flex-column gx-justify-content-center gx-h-100"><a target="_blank" href="https://play.google.com/store/apps/details?id=com.ippopay.merchant"><span className="gx-mb-2 gx-app-thumb"><img src="./SabPaisa - Merchant_files/google-play-download-android-app.dffd25fb.svg" alt="..." /></span></a><a target="_blank" href="https://apps.apple.com/in/app/ippopay/id1502552317"><span className="gx-app-thumb"><img src="./SabPaisa - Merchant_files/apple-app-store-badge3.b18eea69.svg" alt="..." /></span></a></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ant-card gx-card-widget ant-card-bordered recent_settlements">
                      <div className="ant-card-body">
                        <h2 className="h4 gx-mb-3">Recent Settlements<a className="view_all_link gx-float-right gx-text-primary gx-mb-0 gx-pointer gx-d-none gx-d-sm-block" href="http://www.sabpaisalogin.in.s3-website.us-east-2.amazonaws.com/settlement/list">View All</a></h2>
                        <div className="gx-table-responsive min-height-164">
                          <div className="react-bs-table-container">
                            <div className="react-bs-table" style={{height: '100%'}}>
                              <div className="react-bs-container-header table-header-wrapper">
                                <table className="table table-hover table-condensed">
                                  <colgroup>
                                    <col style={{width: '45px', minWidth: '45px'}} />
                                    <col style={{width: '120px', minWidth: '120px'}} />
                                    <col style={{width: '70px', minWidth: '70px'}} />
                                    <col />
                                  </colgroup>
                                  <thead>
                                    <tr>
                                      <th className data-is-only-head="false" title="S.No" data-field="sno" style={{textAlign: 'left'}}>S.No<div />
                                      </th>
                                      <th className data-is-only-head="false" title="Settlement ID" data-field="transaction_id" style={{textAlign: 'left'}}>Settlement ID<div />
                                      </th>
                                      <th className data-is-only-head="false" title="Total Sales" data-field="totalsales" style={{textAlign: 'left'}}>Total Sales<div />
                                      </th>
                                      <th className data-is-only-head="false" title="Total Amount" data-field="total_amount" style={{textAlign: 'left'}}>Total Amount<div />
                                      </th>
                                    </tr>
                                  </thead>
                                </table>
                              </div>
                              <div className="react-bs-container-body" style={{height: '100%'}}>
                                <table className="table table-hover table-condensed">
                                  <colgroup>
                                    <col style={{width: '45px', minWidth: '45px'}} />
                                    <col style={{width: '120px', minWidth: '120px'}} />
                                    <col style={{width: '70px', minWidth: '70px'}} />
                                    <col />
                                  </colgroup>
                                  <tbody>
                                    <tr className>
                                      <td data-toggle="collapse" colSpan={4} className="react-bs-table-no-data">There is no
                                        data to display</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="s-alert-wrapper" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="ant-layout-footer">
            <div className="gx-layout-footer-content">© 2021 Ippopay. All Rights Reserved. <span className="pull-right">Ippopay's GST Number : 33AADCF9175D1ZP</span></div>
          </footer>
        </main>
      </section>
    )
}

export default Home
