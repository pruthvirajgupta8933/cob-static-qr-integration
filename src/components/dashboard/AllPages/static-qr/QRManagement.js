import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQRList, removeDuplicates } from '../../../../slices/sabqr/sabqrSlice';
import { axiosInstanceJWT } from '../../../../utilities/axiosInstance';
import API_URL from '../../../../config';
import toastConfig from '../../../../utilities/toastTypes';
import staticQrClasses from './staticqr.module.css';
import QRCode from 'qrcode';

const QRManagement = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth) || {};
    const { qrList, loading: reduxLoading } = useSelector((state) => state.sabqr) || {};
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedQR, setSelectedQR] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showQRImage, setShowQRImage] = useState(false);
    const [currentQRImage, setCurrentQRImage] = useState(null);
    
    useEffect(() => {
        // Clean up any duplicates first
        dispatch(removeDuplicates());
        // Load QR codes from Redux store on mount
        dispatch(fetchQRList());
    }, [dispatch]);

    // Use QR codes from Redux store and remove duplicates based on qr_identifier
    const qrCodes = React.useMemo(() => {
        const uniqueQRs = [];
        const seenIdentifiers = new Set();
        
        (qrList || []).forEach(qr => {
            if (!seenIdentifiers.has(qr.qr_identifier)) {
                seenIdentifiers.add(qr.qr_identifier);
                uniqueQRs.push(qr);
            }
        });
        
        return uniqueQRs;
    }, [qrList]);

    const regenerateQR = async (qrId) => {
        try {
            const qr = qrCodes.find(q => q.id === qrId);
            if (!qr) {
                toastConfig.errorToast('QR code not found');
                return;
            }
            
            // Use the actual QR image if available, or the UPI string
            if (qr.qr_image_url) {
                // Download existing QR image
                const link = document.createElement('a');
                link.download = `QR_${qr.qr_identifier}_${Date.now()}.png`;
                link.href = qr.qr_image_url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (qr.upi_string) {
                // Generate new QR from UPI string
                const qrDataUrl = await QRCode.toDataURL(qr.upi_string, {
                    width: 400,
                    margin: 2
                });
                const link = document.createElement('a');
                link.download = `QR_${qr.qr_identifier}_${Date.now()}.png`;
                link.href = qrDataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            toastConfig.successToast('QR code downloaded successfully!');
        } catch (error) {
            console.error('Error downloading QR:', error);
            toastConfig.errorToast('Failed to download QR code');
        }
    };

    const toggleStatus = (qrId) => {
        // In production, this would update via API
        toastConfig.infoToast('Status update will be available with backend integration');
    };

    const viewDetails = (qr) => {
        setSelectedQR(qr);
        setShowModal(true);
        // Generate QR image for preview if needed
        if (qr.upi_string && !qr.qr_image_url) {
            QRCode.toDataURL(qr.upi_string, { width: 300, margin: 2 })
                .then(url => setCurrentQRImage(url))
                .catch(console.error);
        } else {
            setCurrentQRImage(qr.qr_image_url);
        }
    };

    const filteredQRCodes = qrCodes.filter(qr => {
        const searchFields = [
            qr.qr_identifier,
            qr.reference_name,
            qr.description,
            qr.category
        ].filter(Boolean).join(' ').toLowerCase();
        
        const matchesSearch = searchText === '' || searchFields.includes(searchText.toLowerCase());
        const matchesStatus = filterStatus === 'all' || qr.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className={`card ${staticQrClasses.form_card}`}>
            <div className="card-header bg-white">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h4 className="mb-0">Manage QR Codes</h4>
                    </div>
                    <div className="col-md-6 text-right">
                        <span className="badge badge-primary mr-2">
                            Total: {qrCodes.length}
                        </span>
                        <span className="badge badge-success mr-2">
                            Active: {qrCodes.filter(q => q.status === 'active').length}
                        </span>
                        <span className="badge badge-secondary">
                            Inactive: {qrCodes.filter(q => q.status === 'inactive').length}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="card-body">
                {/* Filters */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="fa fa-search"></i>
                                </span>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by ID or Name..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-control"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-primary btn-block" onClick={() => dispatch(fetchQRList())}>
                            <i className="fa fa-refresh mr-2"></i>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* QR Codes Table */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th>QR ID</th>
                                    <th>Reference Name</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>VPA</th>
                                    <th>Created</th>
                                    <th>Collections</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQRCodes.length > 0 ? (
                                    filteredQRCodes.map(qr => (
                                        <tr key={qr.id}>
                                            <td>
                                                <span className="badge badge-info">{qr.qr_identifier || qr.id}</span>
                                            </td>
                                            <td>{qr.reference_name || 'N/A'}</td>
                                            <td>
                                                <span className="badge badge-secondary">
                                                    {qr.category || 'general'}
                                                </span>
                                            </td>
                                            <td>{qr.max_amount_per_transaction ? `₹${qr.max_amount_per_transaction}` : 'Dynamic'}</td>
                                            <td>
                                                <small className="text-muted">{qr.full_vpa || 'sabpaisa@hdfcbank'}</small>
                                            </td>
                                            <td>{qr.created_at ? new Date(qr.created_at).toLocaleDateString() : 'Today'}</td>
                                            <td>₹{(qr.total_collections || 0).toLocaleString()}</td>
                                            <td>
                                                <span className={`${staticQrClasses.status_badge} ${qr.status === 'active' ? staticQrClasses.badge_success : staticQrClasses.badge_danger}`}>
                                                    {qr.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn btn-sm btn-info ${staticQrClasses.btn_action}`}
                                                    title="View Details"
                                                    onClick={() => viewDetails(qr)}
                                                >
                                                    <i className="fa fa-eye"></i>
                                                </button>
                                                <button
                                                    className={`btn btn-sm btn-primary ${staticQrClasses.btn_action}`}
                                                    title="Download QR"
                                                    onClick={() => regenerateQR(qr.id)}
                                                >
                                                    <i className="fa fa-download"></i>
                                                </button>
                                                <button
                                                    className={`btn btn-sm ${qr.status === 'active' ? 'btn-warning' : 'btn-success'} ${staticQrClasses.btn_action}`}
                                                    title={qr.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    onClick={() => toggleStatus(qr.id)}
                                                >
                                                    <i className={`fa ${qr.status === 'active' ? 'fa-pause' : 'fa-play'}`}></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4">
                                            <i className={`fa fa-qrcode ${staticQrClasses.empty_state_icon}`}></i>
                                            <p className="mt-2">No QR codes found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showModal && selectedQR && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">QR Code Details - {selectedQR.qr_identifier || selectedQR.id}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        {currentQRImage && (
                                            <div className="text-center mb-3">
                                                <img src={currentQRImage} alt="QR Code" style={{ maxWidth: '250px' }} />
                                            </div>
                                        )}
                                        <p><strong>Reference Name:</strong> {selectedQR.reference_name || 'N/A'}</p>
                                        <p><strong>Category:</strong> {selectedQR.category || 'general'}</p>
                                        <p><strong>Amount:</strong> {selectedQR.max_amount_per_transaction ? `₹${selectedQR.max_amount_per_transaction}` : 'Dynamic'}</p>
                                        <p><strong>Status:</strong> <span className={`badge ${selectedQR.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>{selectedQR.status}</span></p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>QR Identifier:</strong> <code>{selectedQR.qr_identifier}</code></p>
                                        <p><strong>VPA:</strong> <code>{selectedQR.full_vpa || 'sabpaisa@hdfcbank'}</code></p>
                                        <p><strong>Created:</strong> {selectedQR.created_at ? new Date(selectedQR.created_at).toLocaleString() : 'Recently'}</p>
                                        <p><strong>Total Collections:</strong> ₹{(selectedQR.total_collections || 0).toLocaleString()}</p>
                                        <p><strong>Transaction Count:</strong> {selectedQR.transaction_count || 0}</p>
                                        {selectedQR.description && (
                                            <p><strong>Description:</strong> {selectedQR.description}</p>
                                        )}
                                    </div>
                                </div>
                                {selectedQR.upi_string && (
                                    <div className="mt-3">
                                        <p><strong>UPI String:</strong></p>
                                        <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>{selectedQR.upi_string}</code>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                                <button className="btn btn-primary" onClick={() => regenerateQR(selectedQR.id)}>
                                    <i className="fa fa-download mr-2"></i>
                                    Download QR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRManagement;