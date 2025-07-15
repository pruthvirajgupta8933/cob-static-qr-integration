import React from 'react';
import CustomModal from '../../../_components/custom_modal';

const ViewMidManagementModal = ({ userData, setOpenModal, openZoneModal }) => {
    const modalBody = () => {
        return (
            <div className="container-fluid p-0">
                <div className="modal-body px-4 py-3">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hover shadow-sm">
                            <thead className="thead-dark">
                                <tr>
                                    {/* <th style={{ width: '40%' }}>Field</th>
                                    <th style={{ width: '60%' }}>Value</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(userData || {})
                                    .filter(([key]) => key.toLowerCase() !== 'id') // filter out "id" key
                                    .map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="text-capitalize fw-bold text-secondary">
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </td>
                                            <td className="text-break">
                                                {value !== null && value !== "" ? value : <em className="text-muted">N/A</em>}
                                            </td>
                                        </tr>
                                    ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <CustomModal
                modalBody={modalBody}
                headerTitle="View Details"
                modalToggle={openZoneModal}
                fnSetModalToggle={setOpenModal}
            />
        </div>
    );
};

export default ViewMidManagementModal;
