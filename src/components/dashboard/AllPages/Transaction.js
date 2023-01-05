import React from 'react'

function Transaction() {
    return (
        <section className="ant-layout">
        <div className="profileBarStatus">
        </div>
        <main className="gx-layout-content ant-layout-content">
          <div className="gx-main-content-wrapper">
            <div className="right_layout my_account_wrapper">
              <h1 className="right_side_heading">Transactions List</h1>
              <div className="ant-tabs ant-tabs-top ant-tabs-line">
                <div className="ant-tabs-content ant-tabs-content-animated ant-tabs-top-content" style={{marginLeft: '0%'}}>
                  <div role="tabpanel" aria-hidden="false" className="ant-tabs-tabpane ant-tabs-tabpane-active">
                    <div role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}} />
                    <div className="table_panel clearfix">
                      <div className="table-wrapper">
                        <div className="pageSelect ant-col ant-col-24 no-padding">
                          <div className="ant-row">
                            <div className="ant-col ant-col-24 ant-col-sm-4 ant-col-md-4 ant-col-lg-7"><label>Search</label>
                              <div className="searchByTerm">
                                <div className="ant-select ant-select-enabled">
                                  <div className="ant-select-selection
            ant-select-selection--single" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-controls="88a7526e-b761-43b0-b6f7-d2b261285561" aria-expanded="false" tabIndex={0}>
                                    <div className="ant-select-selection__rendered">
                                      <div unselectable="on" className="ant-select-selection__placeholder" style={{display: 'none', userSelect: 'none'}}>Select</div>
                                      <div className="ant-select-selection-selected-value" title="Select" style={{display: 'block', opacity: 1}}>Select</div>
                                    </div><span className="ant-select-arrow" unselectable="on" style={{userSelect: 'none'}}><i aria-label="icon: down" className="anticon anticon-down ant-select-arrow-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                          <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
                                          </path>
                                        </svg></i></span>
                                  </div>
                                </div><input type="text" name="searchTerm" placeholder="Search By" className="ant-input" defaultValue style={{width: '170px', paddingRight: '40px'}} /><span className="search_icon_right"><i className="fa fa-search" /></span>
                              </div>
                            </div>
                            <div className="ant-col ant-col-24 ant-col-sm-4 ant-col-md-4 ant-col-lg-3"><label className="m-r-10">Status:</label>
                              <div className="ant-select ant-select-enabled" style={{width: '100%'}}>
                                <div className="ant-select-selection
            ant-select-selection--single" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-controls="17b8121b-38aa-47d3-c0f3-b91395d904e3" aria-expanded="false" tabIndex={0}>
                                  <div className="ant-select-selection__rendered">
                                    <div className="ant-select-selection-selected-value" title="All" style={{display: 'block', opacity: 1}}>All</div>
                                  </div><span className="ant-select-arrow" unselectable="on" style={{userSelect: 'none'}}><i aria-label="icon: down" className="anticon anticon-down ant-select-arrow-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
                                        </path>
                                      </svg></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="ant-col ant-col-24 ant-col-sm-8 ant-col-md-6 ant-col-lg-6"><label>From -
                                To:</label><span className="ant-calendar-picker" tabIndex={0}><span className="ant-calendar-picker-input ant-input"><input readOnly placeholder="Start date" className="ant-calendar-range-picker-input" tabIndex={-1} defaultValue /><span className="ant-calendar-range-picker-separator"> - </span><input readOnly placeholder="End date" className="ant-calendar-range-picker-input" tabIndex={-1} defaultValue /><i aria-label="icon: calendar" className="anticon anticon-calendar ant-calendar-picker-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="calendar" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                      <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z">
                                      </path>
                                    </svg></i></span></span></div>
                            <div className="ant-col ant-col-24 ant-col-sm-3 ant-col-md-3 ant-col-lg-3"><label>Show
                                records</label>
                              <div className="ant-select ant-select-enabled" style={{width: '100%'}}>
                                <div className="ant-select-selection
            ant-select-selection--single" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-controls="d01589de-538c-4e4a-d168-d0b5f7479942" aria-expanded="false" tabIndex={0}>
                                  <div className="ant-select-selection__rendered">
                                    <div className="ant-select-selection-selected-value" title={25} style={{display: 'block', opacity: 1}}>25</div>
                                  </div><span className="ant-select-arrow" unselectable="on" style={{userSelect: 'none'}}><i aria-label="icon: down" className="anticon anticon-down ant-select-arrow-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
                                        </path>
                                      </svg></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="ant-col ant-col-24 ant-col-sm-5 ant-col-md-5 ant-col-lg-5 m-t-24"><a href={()=>false}className="ant-btn ant-btn-danger">Reset</a><a href={()=>false}className="ant-btn ant-btn-primary btn_now_allow">Download</a></div>
                          </div>
                        </div>
                        <div className="react-bs-table-container">
                          <div className="react-bs-table-tool-bar ">
                            <div className="row">
                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-8">
                                <div className="btn-group btn-group-sm" role="group"><button type="button" className="btn btn-success react-bs-table-csv-btn  hidden-print"><span><i className="fa glyphicon glyphicon-export fa-download" /> Export to
                                      CSV</span></button></div>
                              </div>
                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4" />
                            </div>
                          </div>
                          <div className="react-bs-table" style={{height: '100%'}}>
                            <div className="react-bs-container-header table-header-wrapper">
                              <table className="table table-hover table-condensed">
                                <colgroup>
                                  <col style={{width: '45px', minWidth: '45px'}} />
                                  <col />
                                  <col style={{width: '140px', minWidth: '140px'}} />
                                  <col style={{width: '60px', minWidth: '60px'}} />
                                  <col />
                                  <col />
                                  <col />
                                  <col />
                                  <col style={{width: '100px', minWidth: '100px'}} />
                                  <col style={{width: '65px', minWidth: '65px'}} />
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th className data-is-only-head="false" title="S.No" data-field="sno" style={{textAlign: 'left'}}>S.No<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Date" data-field="created_date" style={{textAlign: 'left'}}>Date<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Transaction ID" data-field="transaction_id" style={{textAlign: 'left'}}>Transaction ID<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Type" data-field="transType" style={{textAlign: 'left'}}>Type<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Customer Name" data-field="name" style={{textAlign: 'left'}}>Customer Name<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Customer Email" data-field="email" style={{textAlign: 'left'}}>Customer Email<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Customer Phone" data-field="phone_no" style={{textAlign: 'left'}}>Customer Phone<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Payment" data-field="pay_amount" style={{textAlign: 'left'}}>Payment<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Status" data-field="status" style={{textAlign: 'left'}}>Status<div />
                                    </th>
                                    <th className data-is-only-head="false" title="View" data-field="view" style={{textAlign: 'left'}}>View<div />
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                            <div className="react-bs-container-body" style={{height: '100%'}}>
                              <table className="table table-hover table-condensed">
                                <colgroup>
                                  <col style={{width: '45px', minWidth: '45px'}} />
                                  <col />
                                  <col style={{width: '140px', minWidth: '140px'}} />
                                  <col style={{width: '60px', minWidth: '60px'}} />
                                  <col />
                                  <col />
                                  <col />
                                  <col />
                                  <col style={{width: '100px', minWidth: '100px'}} />
                                  <col style={{width: '65px', minWidth: '65px'}} />
                                </colgroup>
                                <tbody>
                                  <tr className>
                                    <td data-toggle="collapse" colSpan={10} className="react-bs-table-no-data">Start making
                                      money and see them come up here!</td>
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
                  <div role="tabpanel" aria-hidden="true" className="ant-tabs-tabpane ant-tabs-tabpane-inactive">
                    <div className="table_panel clearfix">
                      <div className="table-wrapper">
                        <div className="pageSelect ant-col ant-col-24 no-padding">
                          <div className="ant-row">
                            <div className="ant-col ant-col-24 ant-col-sm-4 ant-col-md-4 ant-col-lg-7"><label>Search</label>
                              <div className="searchByTerm">
                                <div className="ant-select ant-select-enabled">
                                  <div className="ant-select-selection
            ant-select-selection--single" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-controls="31b9c0df-5fa3-4ae7-9b42-dda74bf1d4d7" aria-expanded="false" tabIndex={0}>
                                    <div className="ant-select-selection__rendered">
                                      <div unselectable="on" className="ant-select-selection__placeholder" style={{display: 'none', userSelect: 'none'}}>Select</div>
                                      <div className="ant-select-selection-selected-value" title="Select" style={{display: 'block', opacity: 1}}>Select</div>
                                    </div><span className="ant-select-arrow" unselectable="on" style={{userSelect: 'none'}}><i aria-label="icon: down" className="anticon anticon-down ant-select-arrow-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                          <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
                                          </path>
                                        </svg></i></span>
                                  </div>
                                </div><input type="text" name="searchTerm" placeholder="Search By" className="ant-input" defaultValue style={{width: '170px', paddingRight: '40px'}} /><span className="search_icon_right"><i className="fa fa-search" /></span>
                              </div>
                            </div>
                            <div className="ant-col ant-col-24 ant-col-sm-4 ant-col-md-4 ant-col-lg-3"><label className="m-r-10">Status:</label>
                              <div className="ant-select ant-select-enabled" style={{width: '100%'}}>
                                <div className="ant-select-selection
            ant-select-selection--single" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-controls="bfe86042-de93-4430-98a5-214425de64f6" aria-expanded="false" tabIndex={0}>
                                  <div className="ant-select-selection__rendered">
                                    <div className="ant-select-selection-selected-value" title="All" style={{display: 'block', opacity: 1}}>All</div>
                                  </div><span className="ant-select-arrow" unselectable="on" style={{userSelect: 'none'}}><i aria-label="icon: down" className="anticon anticon-down ant-select-arrow-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
                                        </path>
                                      </svg></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="ant-col ant-col-24 ant-col-sm-8 ant-col-md-6 ant-col-lg-6"><label>From -
                                To:</label><span className="ant-calendar-picker" tabIndex={0}><span className="ant-calendar-picker-input ant-input"><input readOnly placeholder="Start date" className="ant-calendar-range-picker-input" tabIndex={-1} defaultValue /><span className="ant-calendar-range-picker-separator"> - </span><input readOnly placeholder="End date" className="ant-calendar-range-picker-input" tabIndex={-1} defaultValue /><i aria-label="icon: calendar" className="anticon anticon-calendar ant-calendar-picker-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="calendar" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                      <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z">
                                      </path>
                                    </svg></i></span></span></div>
                            <div className="ant-col ant-col-24 ant-col-sm-3 ant-col-md-3 ant-col-lg-3"><label>Show
                                records</label>
                              <div className="ant-select ant-select-enabled" style={{width: '100%'}}>
                                <div className="ant-select-selection
            ant-select-selection--single" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-controls="473e23f0-b452-428c-de74-2ed0c8001b99" aria-expanded="false" tabIndex={0}>
                                  <div className="ant-select-selection__rendered">
                                    <div className="ant-select-selection-selected-value" title={25} style={{display: 'block', opacity: 1}}>25</div>
                                  </div><span className="ant-select-arrow" unselectable="on" style={{userSelect: 'none'}}><i aria-label="icon: down" className="anticon anticon-down ant-select-arrow-icon"><svg viewBox="64 64 896 896" focusable="false" className data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
                                        </path>
                                      </svg></i></span>
                                </div>
                              </div>
                            </div>
                            <div className="ant-col ant-col-24 ant-col-sm-5 ant-col-md-5 ant-col-lg-5 m-t-24"><a href={()=>false}className="ant-btn ant-btn-danger">Reset</a><a href={()=>false}className="ant-btn ant-btn-primary btn_now_allow">Download</a></div>
                          </div>
                        </div>
                        <div className="react-bs-table-container">
                          <div className="react-bs-table-tool-bar ">
                            <div className="row">
                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-8">
                                <div className="btn-group btn-group-sm" role="group"><button type="button" className="btn btn-success react-bs-table-csv-btn  hidden-print"><span><i className="fa glyphicon glyphicon-export fa-download" /> Export to
                                      CSV</span></button></div>
                              </div>
                              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4" />
                            </div>
                          </div>
                          <div className="react-bs-table" style={{height: '100%'}}>
                            <div className="react-bs-container-header table-header-wrapper">
                              <table className="table table-hover table-condensed">
                                <colgroup>
                                  <col style={{width: '45px', minWidth: '45px'}} />
                                  <col />
                                  <col />
                                  <col />
                                  <col />
                                  <col />
                                  <col />
                                  <col style={{width: '100px', minWidth: '100px'}} />
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th className data-is-only-head="false" title="S.No" data-field="sno" style={{textAlign: 'left'}}>S.No<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Date" data-field="created_date" style={{textAlign: 'left'}}>Date<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Order ID" data-field="order_id" style={{textAlign: 'left'}}>Order ID<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Customer Name" data-field="name" style={{textAlign: 'left'}}>Customer Name<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Customer Email" data-field="email" style={{textAlign: 'left'}}>Customer Email<div />
                                    </th>
                                    <th className data-is-only-head="false" title="Customer Phone" data-field="phone_no" style={{textAlign: 'left'}}>Customer Phone<div />
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
                                  <col style={{width: '45px', minWidth: '45px'}} />
                                  <col />
                                  <col />
                                  <col />
                                  <col />
                                  <col />
                                  <col />
                                  <col style={{width: '100px', minWidth: '100px'}} />
                                </colgroup>
                                <tbody>
                                  <tr className>
                                    <td data-toggle="collapse" colSpan={8} className="react-bs-table-no-data">No Orders
                                      Found</td>
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
                <div role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}} />
              </div>
            </div>
          </div>
         
        </main>
      </section>
    )
}

export default Transaction
