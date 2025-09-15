import React, { useState } from 'react';
import Modal from 'react-modal';
import staticQrClasses from '../staticqr.module.css';

const QRDesignCustomizer = ({ show, onClose, designConfig, onSave }) => {
    const [config, setConfig] = useState(designConfig);
    const [activeTab, setActiveTab] = useState('template');

    const templates = [
        {
            id: 'professional',
            name: 'Professional',
            description: 'Clean and modern design for businesses',
            preview: '🎯',
            config: {
                template: 'professional',
                brand_color: '#007bff',
                secondary_color: '#6c757d',
                logo_position: 'center',
                show_merchant_name: true,
                show_amount: true,
                include_instructions: true
            }
        },
        {
            id: 'minimal',
            name: 'Minimal',
            description: 'Simple and focused design',
            preview: '⚪',
            config: {
                template: 'minimal',
                brand_color: '#000000',
                secondary_color: '#ffffff',
                logo_position: 'none',
                show_merchant_name: false,
                show_amount: true,
                include_instructions: false
            }
        },
        {
            id: 'branded',
            name: 'Branded',
            description: 'Full branding with your colors',
            preview: '🎨',
            config: {
                template: 'branded',
                brand_color: '#007bff',
                secondary_color: '#28a745',
                logo_position: 'top',
                show_merchant_name: true,
                show_amount: true,
                include_instructions: true
            }
        },
        {
            id: 'classic',
            name: 'Classic',
            description: 'Traditional QR code design',
            preview: '📱',
            config: {
                template: 'classic',
                brand_color: '#212529',
                secondary_color: '#f8f9fa',
                logo_position: 'center',
                show_merchant_name: true,
                show_amount: false,
                include_instructions: true
            }
        }
    ];

    const handleTemplateSelect = (template) => {
        setConfig({
            ...config,
            ...template.config
        });
    };

    const handleColorChange = (colorType, value) => {
        setConfig({
            ...config,
            [colorType]: value
        });
    };

    const handleSave = () => {
        onSave(config);
        onClose();
    };

    return (
        <Modal
            isOpen={show}
            onRequestClose={onClose}
            className="modal-dialog modal-xl"
            overlayClassName="modal-backdrop show"
            ariaHideApp={false}
        >
            <div className="modal-content">
                <div className={`modal-header ${staticQrClasses.modal_header}`}>
                    <h5 className="modal-title">
                        <i className="fa fa-palette mr-2"></i>
                        Customize QR Design
                    </h5>
                    <button type="button" className="close text-white" onClick={onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="row">
                        <div className="col-md-3">
                            <ul className="nav nav-pills flex-column">
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'template' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('template')}
                                    >
                                        <i className="fa fa-th-large mr-2"></i>
                                        Templates
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'colors' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('colors')}
                                    >
                                        <i className="fa fa-paint-brush mr-2"></i>
                                        Colors
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'layout' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('layout')}
                                    >
                                        <i className="fa fa-object-group mr-2"></i>
                                        Layout
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'options' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('options')}
                                    >
                                        <i className="fa fa-cog mr-2"></i>
                                        Options
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="col-md-6">
                            {activeTab === 'template' && (
                                <div>
                                    <h5 className="mb-4">Choose a Template</h5>
                                    <div className="row">
                                        {templates.map(template => (
                                            <div key={template.id} className="col-md-6 mb-3">
                                                <div 
                                                    className={`card cursor-pointer ${config.template === template.id ? 'border-primary' : ''}`}
                                                    onClick={() => handleTemplateSelect(template)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <span className="h1 mr-3">{template.preview}</span>
                                                            <div>
                                                                <h6 className="mb-1">{template.name}</h6>
                                                                <small className="text-muted">{template.description}</small>
                                                            </div>
                                                        </div>
                                                        {config.template === template.id && (
                                                            <div className="text-primary text-center">
                                                                <i className="fa fa-check-circle"></i> Selected
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'colors' && (
                                <div>
                                    <h5 className="mb-4">Color Scheme</h5>
                                    
                                    <div className="form-group">
                                        <label className="font-weight-bold">Primary Color</label>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="color"
                                                className={staticQrClasses.color_picker}
                                                value={config.brand_color}
                                                onChange={(e) => handleColorChange('brand_color', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="form-control ml-2"
                                                value={config.brand_color}
                                                onChange={(e) => handleColorChange('brand_color', e.target.value)}
                                                placeholder="#007bff"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="font-weight-bold">Secondary Color</label>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="color"
                                                className={staticQrClasses.color_picker}
                                                value={config.secondary_color}
                                                onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="form-control ml-2"
                                                value={config.secondary_color}
                                                onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                                                placeholder="#6c757d"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h6>Preset Color Schemes</h6>
                                        <div className="d-flex flex-wrap">
                                            <button 
                                                className="btn btn-sm btn-outline-primary m-1"
                                                onClick={() => setConfig({...config, brand_color: '#007bff', secondary_color: '#6c757d'})}
                                            >
                                                Default Blue
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-success m-1"
                                                onClick={() => setConfig({...config, brand_color: '#28a745', secondary_color: '#20c997'})}
                                            >
                                                Green
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger m-1"
                                                onClick={() => setConfig({...config, brand_color: '#dc3545', secondary_color: '#e83e8c'})}
                                            >
                                                Red
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-warning m-1"
                                                onClick={() => setConfig({...config, brand_color: '#ffc107', secondary_color: '#fd7e14'})}
                                            >
                                                Gold
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-dark m-1"
                                                onClick={() => setConfig({...config, brand_color: '#343a40', secondary_color: '#6c757d'})}
                                            >
                                                Dark
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'layout' && (
                                <div>
                                    <h5 className="mb-4">Layout Options</h5>
                                    
                                    <div className="form-group">
                                        <label className="font-weight-bold">Logo Position</label>
                                        <div className="btn-group btn-group-toggle w-100" data-toggle="buttons">
                                            <label className={`btn btn-outline-primary ${config.logo_position === 'none' ? 'active' : ''}`}>
                                                <input
                                                    type="radio"
                                                    checked={config.logo_position === 'none'}
                                                    onChange={() => setConfig({...config, logo_position: 'none'})}
                                                /> None
                                            </label>
                                            <label className={`btn btn-outline-primary ${config.logo_position === 'top' ? 'active' : ''}`}>
                                                <input
                                                    type="radio"
                                                    checked={config.logo_position === 'top'}
                                                    onChange={() => setConfig({...config, logo_position: 'top'})}
                                                /> Top
                                            </label>
                                            <label className={`btn btn-outline-primary ${config.logo_position === 'center' ? 'active' : ''}`}>
                                                <input
                                                    type="radio"
                                                    checked={config.logo_position === 'center'}
                                                    onChange={() => setConfig({...config, logo_position: 'center'})}
                                                /> Center
                                            </label>
                                            <label className={`btn btn-outline-primary ${config.logo_position === 'bottom' ? 'active' : ''}`}>
                                                <input
                                                    type="radio"
                                                    checked={config.logo_position === 'bottom'}
                                                    onChange={() => setConfig({...config, logo_position: 'bottom'})}
                                                /> Bottom
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="font-weight-bold">QR Code Size</label>
                                        <select 
                                            className="form-control"
                                            value={config.qr_size || 'medium'}
                                            onChange={(e) => setConfig({...config, qr_size: e.target.value})}
                                        >
                                            <option value="small">Small (200x200)</option>
                                            <option value="medium">Medium (300x300)</option>
                                            <option value="large">Large (400x400)</option>
                                            <option value="xlarge">Extra Large (500x500)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'options' && (
                                <div>
                                    <h5 className="mb-4">Display Options</h5>
                                    
                                    <div className="custom-control custom-switch mb-3">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="showMerchantName"
                                            checked={config.show_merchant_name}
                                            onChange={(e) => setConfig({...config, show_merchant_name: e.target.checked})}
                                        />
                                        <label className="custom-control-label" htmlFor="showMerchantName">
                                            Show Merchant Name
                                        </label>
                                    </div>
                                    
                                    <div className="custom-control custom-switch mb-3">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="showAmount"
                                            checked={config.show_amount}
                                            onChange={(e) => setConfig({...config, show_amount: e.target.checked})}
                                        />
                                        <label className="custom-control-label" htmlFor="showAmount">
                                            Show Amount (for fixed QR)
                                        </label>
                                    </div>
                                    
                                    <div className="custom-control custom-switch mb-3">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="includeInstructions"
                                            checked={config.include_instructions}
                                            onChange={(e) => setConfig({...config, include_instructions: e.target.checked})}
                                        />
                                        <label className="custom-control-label" htmlFor="includeInstructions">
                                            Include Payment Instructions
                                        </label>
                                    </div>
                                    
                                    <div className="custom-control custom-switch mb-3">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="showVPA"
                                            checked={config.show_vpa !== false}
                                            onChange={(e) => setConfig({...config, show_vpa: e.target.checked})}
                                        />
                                        <label className="custom-control-label" htmlFor="showVPA">
                                            Display VPA
                                        </label>
                                    </div>
                                    
                                    <div className="custom-control custom-switch mb-3">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="showUPILogos"
                                            checked={config.show_upi_logos !== false}
                                            onChange={(e) => setConfig({...config, show_upi_logos: e.target.checked})}
                                        />
                                        <label className="custom-control-label" htmlFor="showUPILogos">
                                            Show UPI App Logos
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="col-md-3">
                            <h5 className="mb-3">Preview</h5>
                            <div className={staticQrClasses.design_preview}>
                                <div 
                                    className="text-center p-3"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${config.brand_color} 0%, ${config.secondary_color} 100%)`,
                                        borderRadius: '8px 8px 0 0',
                                        color: 'white'
                                    }}
                                >
                                    {config.logo_position === 'top' && (
                                        <div className="mb-2">
                                            <i className="fa fa-building fa-2x"></i>
                                        </div>
                                    )}
                                    {config.show_merchant_name && (
                                        <h6>Your Business Name</h6>
                                    )}
                                </div>
                                
                                <div className="p-3 bg-white text-center">
                                    {config.logo_position === 'center' && (
                                        <div className="mb-2">
                                            <i className="fa fa-building fa-2x text-muted"></i>
                                        </div>
                                    )}
                                    
                                    <div className="mb-3">
                                        <i className="fa fa-qrcode fa-5x text-muted"></i>
                                    </div>
                                    
                                    {config.show_vpa !== false && (
                                        <div className="small text-monospace text-muted mb-2">
                                            sabpaisa.XXXXX@okhdfcbank
                                        </div>
                                    )}
                                    
                                    {config.show_amount && (
                                        <div className="h5 mb-2" style={{ color: config.brand_color }}>
                                            ₹ 500
                                        </div>
                                    )}
                                    
                                    {config.logo_position === 'bottom' && (
                                        <div className="mt-2">
                                            <i className="fa fa-building fa-2x text-muted"></i>
                                        </div>
                                    )}
                                </div>
                                
                                {config.include_instructions && (
                                    <div className="p-2 bg-light text-center small">
                                        <small>Scan & Pay with any UPI app</small>
                                    </div>
                                )}
                                
                                {config.show_upi_logos !== false && (
                                    <div className="p-2 text-center">
                                        <small className="text-muted">
                                            <i className="fa fa-mobile mr-2"></i>
                                            All UPI Apps Supported
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={handleSave}
                    >
                        <i className="fa fa-save mr-2"></i>
                        Save Design
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default QRDesignCustomizer;