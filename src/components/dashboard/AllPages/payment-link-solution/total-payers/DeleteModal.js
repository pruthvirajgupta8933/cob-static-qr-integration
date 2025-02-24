import React from 'react';

const DeleteModal = ({ showModal, handleClose, handleDelete, payerName }) => {
    return (
        <div
            className={`mymodals modal fade ${showModal ? 'show' : ''}`}
            tabIndex="-1"
            aria-labelledby="deleteModalLabel"
            aria-hidden={!showModal}
            style={{ display: showModal ? 'block' : 'none' }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body text-center">
                        <h5 className="modal-title text-primary">
                            Delete Payer?
                        </h5>
                        <h6 className='mt-2'>
                            {payerName}, Payer will be deleted! Are you sure <br /><span className='mt-2'>you want to delete it?</span>
                        </h6>

                        <div className="d-flex justify-content-center mt-3">
                            <button
                                type="button"
                                className="btn btn-light border text-black mr-3"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn cob-btn-primary approve text-white "
                                onClick={handleClose}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
