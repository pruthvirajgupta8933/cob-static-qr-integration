import React, { useState, useRef } from "react";
import Charts from "./Charts";
import TransactionTable from "./TransactionTable";
import FilterModal from "./FilterModal";
import ActionButtons from "./ActionButtons";
import { Link } from 'react-router-dom';
import { useHistory, useRouteMatch, } from 'react-router-dom';

const PaylinkDashboard = () => {
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);
    let { path } = useRouteMatch();
    const history = useHistory();
    const handleCardClick = () => {
        history.push(`${path}/total-link-generated`);
    };
    return (
        <div className="container-fluid mt-4">
            <div className="row g-4">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <h6></h6>
                    <div className="d-flex gap-2">
                        <ActionButtons filterRef={filterRef} setShowFilter={setShowFilter} showFilter={showFilter} />
                        <FilterModal show={showFilter} onClose={() => setShowFilter(false)} filterRef={filterRef} />
                    </div>
                </div>


                <div className="row mt-3">
                    <div className="col-md-8">
                        <div className="row">

                            <div className="col-md-4">
                                <div className="card shadow-sm p-3">
                                    <h6>Total Transaction</h6>
                                    <h5 className="text-success">₹250,000.00</h5>
                                    <small className="text-muted">+20% from last month</small>
                                </div>
                            </div>
                            <div className="col-md-4" onClick={handleCardClick}>
                                <div className="card shadow-sm p-3">
                                    <h6>Total Link Generated</h6>
                                    <h5 className="text-warning">259</h5>
                                    <small className="text-muted">+20% from last month</small>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card shadow-sm p-3">
                                    <h6>Total Payers</h6>
                                    <h5 className="text-primary">50,000</h5>
                                    <small className="text-muted">+20% from last month</small>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">

                            <div className="col-md-12">
                                <div className="card shadow-sm p-3">
                                    <h6>Transactions Overview</h6>
                                    <Charts chartType="line" />
                                </div>
                            </div>


                        </div>

                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm p-3 h-100">
                            <h6 className="card-title text-center">Transactions Payment Mode</h6>
                            <Charts chartType="donut" />
                        </div>


                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <TransactionTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaylinkDashboard;
