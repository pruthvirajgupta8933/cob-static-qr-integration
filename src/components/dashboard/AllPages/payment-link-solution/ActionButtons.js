import React from "react";
import CreatePaymentLinkModal from "./total-link-generated/CreatePaymentLinkModal";
import AddPayerModal from "./total-payers/AddPayerModal";

const ActionButtons = ({
    filterRef,
    setShowFilter,
    showFilter,
    setShowCreatePaymentModal,
    setShowAddPayerModal,
    showAddPayerModal,
    showCreatePaymentModal,
    componentState,
    loadUserFn,
    showBackLink,
    onBackClick
}) => {
    return (
        <div className="col-12 d-flex justify-content-between align-items-center">

            {showBackLink && (
                <i
                    className="fa fa-arrow-left text-primary fs-6 cursor-pointer"
                    onClick={onBackClick}
                    style={{ cursor: "pointer" }}
                ></i>
            )}


            <div className="d-flex gap-2">
                <button className="btn btn-sm btn cob-btn-primary approve text-white d-flex align-items-center"
                    onClick={() => setShowAddPayerModal(true)}>
                    <i className="fa fa-user-plus me-2"></i> Add Payer
                </button>

                <button className="btn btn-sm btn cob-btn-primary approve text-white d-flex align-items-center"
                    onClick={() => setShowCreatePaymentModal(true)}>
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

            {showCreatePaymentModal && (
                <CreatePaymentLinkModal
                    onClose={() => setShowCreatePaymentModal(false)}
                    componentState={componentState?.paylinkData}
                />
            )}

            {showAddPayerModal && (
                <AddPayerModal
                    onClose={() => setShowAddPayerModal(false)}
                    loadUserFn={loadUserFn}
                    componentState={componentState}
                />
            )}
        </div>
    );
};

export default ActionButtons;
