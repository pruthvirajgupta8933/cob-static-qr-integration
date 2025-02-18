import React, { useState, useRef } from "react";
import Charts from "./Charts";
import TransactionTable from "./TransactionTable";
import FilterModal from "./FilterModal";
import ActionButtons from "./ActionButtons";
import { useHistory, useRouteMatch } from 'react-router-dom';
import moment from "moment";
import { useSelector } from "react-redux";
import TransactionFilter from "./transaction-filter/TransactionFilter";



const PaylinkDashboard = () => {
    const [showFilter, setShowFilter] = useState(false);
    const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
    const [showAddPayerModal, setShowAddPayerModal] = useState(false);
    const { fromDate, toDate } = useSelector((state) => state.
        dateFilterSliceReducer);

    const filterRef = useRef(null);
    let { path } = useRouteMatch();
    const history = useHistory();

    const handleCardClick = () => {
        history.push(`${path}/total-link-generated`);
    };

    const handleTotalPayerClick = () => {
        history.push(`${path}/total-payers`);
    };

    const handleTotalTransactionClick = () => {
        history.push(`${path}/recent-transaction`);

    }

    return (
        <div className="container-fluid mt-4">
            <div className="row g-4">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <h6 className="alert alert-info" role="alert">
                        Date Range: {fromDate} to {toDate}
                    </h6>
                    {/* <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Date Range: {fromDate} to {toDate}</h6>
                        </div>
                    </div> */}


                    <div className="d-flex gap-2">
                        <ActionButtons
                            filterRef={filterRef}
                            setShowFilter={setShowFilter}
                            showFilter={showFilter}
                            setShowCreatePaymentModal={setShowCreatePaymentModal}
                            setShowAddPayerModal={setShowAddPayerModal}
                            showAddPayerModal={showAddPayerModal}
                            showCreatePaymentModal={showCreatePaymentModal}
                        />
                        <FilterModal show={showFilter} onClose={() => setShowFilter(false)} filterRef={filterRef} />
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-md-8">
                        <div className="row">

                            <div className="col-12 col-md-4" onClick={handleTotalTransactionClick}>
                                <div className="card shadow-sm p-3 rounded border-0 position-relative">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="mb-1">Total Transaction</h6>
                                    </div>
                                    <h5 className="text-success">250,000.00</h5>
                                    <div className="position-absolute bottom-0 end-0 p-3">
                                        <span className="bg-light p-2 rounded-circle shadow">
                                            <i className="fa fa-arrow-right text-primary"></i>
                                        </span>
                                    </div>

                                </div>
                            </div>


                            <div className="col-12 col-md-4" onClick={handleCardClick}>
                                <div className="card shadow-sm p-3">
                                    <h6>Total Link Generated</h6>
                                    <h5 className="text-warning">259</h5>

                                    <div className="position-absolute bottom-0 end-0 p-3">
                                        <span className="bg-light p-2 rounded-circle shadow">
                                            <i className="fa fa-arrow-right text-primary"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>


                            <div className="col-12 col-md-4" onClick={handleTotalPayerClick}>
                                <div className="card shadow-sm p-3">
                                    <h6>Total Payers</h6>
                                    <h5 className="text-primary">50,000</h5>
                                    {/* <small className="text-muted">+20% from last month</small> */}
                                    <div className="position-absolute bottom-0 end-0 p-3">
                                        <span className="bg-light p-2 rounded-circle shadow">
                                            <i className="fa fa-arrow-right text-primary"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">


                            <div className="col-12">
                                <div className="card shadow-sm p-3">
                                    <h6>Transactions Overview</h6>
                                    <TransactionFilter fromDate={fromDate} toDate={toDate} />

                                    <Charts chartType="line" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">

                        <div className="card shadow-sm p-2 h-100">
                            <h6 className="card-title text-center">Transactions Payment Mode</h6>
                            <Charts chartType="donut" />
                        </div>
                    </div>
                </div>

                <div className="row mt-3">

                    <div className="col-12">
                        <TransactionTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaylinkDashboard;



