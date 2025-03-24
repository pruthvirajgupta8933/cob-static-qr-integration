import React from "react";
import CreatePaymentLinkModal from "./total-link-generated/CreatePaymentLinkModal";
import AddPayerModal from "./total-payers/AddPayerModal";
import customStyle from "./paymentLinkSolution.module.css";
import moment from "moment";
import { useSelector } from "react-redux";

const ActionButtons = ({
    filterRef,
    setShowFilter,
    showFilter,
    setShowCreatePaymentModal,
    setShowAddPayerModal,
    showAddPayerModal,
    showCreatePaymentModal,
    componentState,
    loadDataFn,
    showBackLink,
    onBackClick
}) => {

    const { fromDate, toDate } = useSelector(
        (state) => state.dateFilterSliceReducer
    );


    return (
        <div className="col-12 d-flex justify-content-between align-items-center p-0">
            <div className="d-flex align-items-center gap-2">
                {showBackLink && (
                    <div>
                        <button type="button" onClick={onBackClick} className={`cursor_pointer ${customStyle.card_link_icon_arrow} ${customStyle.shadow_icon} bg-light btn`}  >
                            <i className="fa fa-arrow-left text-primary"></i>
                        </button>
                    </div>

                )}
                <div>
                    <p className="border border-default bg-white rounded p-2 shadow m-0" >
                        Date Range: {moment(fromDate).format("ll")} to {moment(toDate).format("ll")}
                    </p>

                </div>
            </div>

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
                    loadDataFn={loadDataFn}
                    componentState={componentState}
                />
            )}
        </div>
    );
};

export default ActionButtons;
