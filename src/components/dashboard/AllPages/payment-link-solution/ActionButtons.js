import React from "react";

const ActionButtons = ({ filterRef, setShowFilter, showFilter }) => {
    return (
        <div className="col-12 d-flex justify-content-end align-items-center"> {/* Align to the right */}
            <div className="d-flex gap-2">
                <button className="btn btn-sm btn cob-btn-primary approve text-white d-flex align-items-center">
                    <i className="fa fa-user-plus me-2"></i> Add Payer
                </button>
                <button className="btn btn-sm btn cob-btn-primary approve text-white d-flex align-items-center">
                    <i className="fa fa-plus me-2"></i> Create Payment Link
                </button>

                <div className="position-relative">
                    <button
                        ref={filterRef}
                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <i className="fa fa-filter me-2"></i> Filter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionButtons;
