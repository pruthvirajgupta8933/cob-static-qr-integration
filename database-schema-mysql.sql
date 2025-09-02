-- =====================================================
-- Static QR Feature - MySQL Database Schema
-- Version: 1.0
-- Date: 2025-09-02
-- Database: MySQL 5.7+ / MariaDB 10.2+
-- =====================================================

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS sabpaisa_qr;
USE sabpaisa_qr;

-- =====================================================
-- 1. QR Codes Table - Stores generated QR information
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    qr_identifier VARCHAR(10) UNIQUE NOT NULL,  -- Unique 5-char identifier (e.g., WIN25)
    merchant_id VARCHAR(50) NOT NULL,           -- HDFC Merchant ID
    merchant_name VARCHAR(255) NOT NULL,        -- Company name
    merchant_prefix VARCHAR(3) NOT NULL,        -- 3-char prefix (e.g., 'srs')
    reference_name VARCHAR(255) NOT NULL,       -- Display name for QR
    description TEXT,                            -- QR description
    category VARCHAR(50),                       -- Category (retail, restaurant, etc.)
    vpa VARCHAR(255) UNIQUE NOT NULL,          -- Generated VPA (sabpaisa.srswin25@hdfcbank)
    upi_string TEXT NOT NULL,                   -- Complete UPI string for QR
    qr_image_data LONGTEXT,                     -- Base64 QR image
    qr_type VARCHAR(20) DEFAULT 'static',      -- static/dynamic
    max_amount DECIMAL(10, 2),                 -- Max amount (for fixed QR)
    min_amount DECIMAL(10, 2) DEFAULT 1.00,    -- Min amount
    status VARCHAR(20) DEFAULT 'active',       -- active/inactive/suspended
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Design configuration
    design_config JSON,                         -- Stores logo, colors, template info
    
    -- Statistics
    total_scans INT DEFAULT 0,
    successful_transactions INT DEFAULT 0,
    total_collection DECIMAL(15, 2) DEFAULT 0.00,
    last_transaction_date TIMESTAMP NULL,
    
    -- Metadata
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_status CHECK (status IN ('active', 'inactive', 'suspended')),
    CONSTRAINT check_qr_type CHECK (qr_type IN ('static', 'dynamic')),
    
    -- Indexes
    INDEX idx_qr_identifier (qr_identifier),
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_merchant_name (merchant_name),
    INDEX idx_vpa (vpa),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. Transactions Table - Payment transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,  -- Unique transaction ID
    qr_id VARCHAR(10),                           -- Links to qr_codes.qr_identifier
    qr_code_id INT,                              -- Foreign key to qr_codes
    
    -- Transaction details
    merchant_id VARCHAR(50) NOT NULL,
    merchant_name VARCHAR(255),
    merchant_txn_id VARCHAR(255),                -- Merchant's transaction ID
    bank_rrn VARCHAR(255),                       -- Bank Reference Number
    
    -- Payment information
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL,                 -- SUCCESS/FAILURE/PENDING
    status_code VARCHAR(10),
    status_description TEXT,
    
    -- Payer information
    payer_vpa VARCHAR(255),                      -- Customer's VPA
    payer_name VARCHAR(255),
    payer_mobile VARCHAR(20),
    payer_account VARCHAR(50),
    
    -- Transaction metadata
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    settlement_date DATE,
    settlement_amount DECIMAL(10, 2),
    payment_mode VARCHAR(50),                    -- UPI/CARD/NETBANKING
    payment_app VARCHAR(50),                     -- GooglePay/PhonePe/Paytm etc
    
    -- Additional fields from HDFC
    mcc VARCHAR(10),                             -- Merchant Category Code
    tip_amount DECIMAL(10, 2) DEFAULT 0,
    convenience_fee DECIMAL(10, 2) DEFAULT 0,
    net_amount DECIMAL(10, 2),
    
    -- Security
    checksum VARCHAR(255),
    ip_address VARCHAR(45),
    device_info JSON,
    
    -- Raw response storage
    raw_request TEXT,
    raw_response TEXT,
    webhook_payload JSON,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    CONSTRAINT fk_qr_code FOREIGN KEY (qr_code_id) REFERENCES qr_codes(id),
    
    -- Constraints
    CONSTRAINT check_txn_status CHECK (status IN ('SUCCESS', 'FAILURE', 'PENDING', 'REFUNDED', 'CANCELLED')),
    
    -- Indexes
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_qr_id (qr_id),
    INDEX idx_merchant_txn_id (merchant_txn_id),
    INDEX idx_bank_rrn (bank_rrn),
    INDEX idx_status_txn (status),
    INDEX idx_payer_vpa (payer_vpa),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_created_at_txn (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. Webhook Logs Table - Track all webhook calls
-- =====================================================
CREATE TABLE IF NOT EXISTS webhook_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    webhook_id VARCHAR(36) DEFAULT (UUID()),
    
    -- Request information
    endpoint VARCHAR(255),
    method VARCHAR(10),
    headers JSON,
    request_body TEXT,
    encrypted_data TEXT,
    
    -- Response information
    response_status INT,
    response_body TEXT,
    
    -- Processing details
    processing_status VARCHAR(50),               -- received/processing/processed/failed
    error_message TEXT,
    retry_count INT DEFAULT 0,
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    CONSTRAINT check_processing_status CHECK (processing_status IN ('received', 'processing', 'processed', 'failed', 'retry')),
    
    INDEX idx_webhook_id (webhook_id),
    INDEX idx_processing_status (processing_status),
    INDEX idx_created_at_webhook (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. Settlement Report Table
-- =====================================================
CREATE TABLE IF NOT EXISTS settlements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    settlement_id VARCHAR(100) UNIQUE NOT NULL,
    merchant_id VARCHAR(50) NOT NULL,
    merchant_name VARCHAR(255),
    
    -- Settlement details
    settlement_date DATE NOT NULL,
    settlement_amount DECIMAL(15, 2) NOT NULL,
    transaction_count INT,
    
    -- Breakdown
    gross_amount DECIMAL(15, 2),
    mdr_charges DECIMAL(10, 2),
    gst_amount DECIMAL(10, 2),
    net_amount DECIMAL(15, 2),
    
    -- Bank details
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    utr_number VARCHAR(50),                      -- Unique Transaction Reference
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',        -- pending/processed/settled/failed
    remarks TEXT,
    
    -- Timestamps
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_settlement_id (settlement_id),
    INDEX idx_merchant_id_settlement (merchant_id),
    INDEX idx_settlement_date (settlement_date),
    INDEX idx_status_settlement (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. QR Scan Analytics Table
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_scan_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    qr_code_id INT,
    qr_identifier VARCHAR(10),
    
    -- Scan details
    scan_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scan_location JSON,                         -- GPS coordinates if available
    scan_device_type VARCHAR(50),               -- mobile/tablet/desktop
    scan_app VARCHAR(50),                       -- GooglePay/PhonePe/Paytm/Others
    
    -- User details (if available)
    user_ip VARCHAR(45),
    user_agent TEXT,
    
    -- Outcome
    scan_result VARCHAR(50),                    -- viewed/initiated/completed/abandoned
    transaction_initiated BOOLEAN DEFAULT FALSE,
    transaction_completed BOOLEAN DEFAULT FALSE,
    transaction_id VARCHAR(255),                -- If payment was made
    
    -- Session tracking
    session_id VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_qr_code_analytics FOREIGN KEY (qr_code_id) REFERENCES qr_codes(id),
    
    INDEX idx_qr_code_id_analytics (qr_code_id),
    INDEX idx_scan_timestamp (scan_timestamp),
    INDEX idx_scan_result (scan_result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. Refunds Table
-- =====================================================
CREATE TABLE IF NOT EXISTS refunds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    refund_id VARCHAR(100) UNIQUE NOT NULL,
    transaction_id VARCHAR(255),
    
    -- Refund details
    original_amount DECIMAL(10, 2),
    refund_amount DECIMAL(10, 2),
    refund_reason TEXT,
    refund_type VARCHAR(50),                    -- full/partial
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'initiated',     -- initiated/processing/completed/failed
    status_message TEXT,
    
    -- Bank details
    bank_reference VARCHAR(100),
    refund_rrn VARCHAR(100),
    
    -- Timestamps
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    -- Metadata
    initiated_by VARCHAR(100),
    approved_by VARCHAR(100),
    remarks TEXT,
    
    CONSTRAINT fk_transaction_refund FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id),
    
    INDEX idx_refund_id (refund_id),
    INDEX idx_transaction_id_refund (transaction_id),
    INDEX idx_status_refund (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. Merchant Configuration Table
-- =====================================================
CREATE TABLE IF NOT EXISTS merchant_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    merchant_id VARCHAR(50) UNIQUE NOT NULL,
    merchant_name VARCHAR(255) NOT NULL,
    
    -- HDFC Configuration
    hdfc_merchant_id VARCHAR(50),
    hdfc_merchant_key VARCHAR(255),            -- Encrypted
    hdfc_terminal_id VARCHAR(50),
    
    -- VPA Configuration
    vpa_prefix VARCHAR(3),                     -- Merchant-specific prefix
    vpa_handle VARCHAR(50) DEFAULT '@hdfcbank',
    
    -- Settings
    webhook_url VARCHAR(500),
    callback_url VARCHAR(500),
    notification_email VARCHAR(255),
    notification_mobile VARCHAR(20),
    
    -- Limits
    daily_transaction_limit DECIMAL(15, 2),
    monthly_transaction_limit DECIMAL(15, 2),
    per_transaction_limit DECIMAL(10, 2),
    
    -- Features
    features JSON,                              -- Feature flags
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_merchant_id_config (merchant_id),
    INDEX idx_hdfc_merchant_id (hdfc_merchant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. Audit Log Table
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Action details
    action_type VARCHAR(50) NOT NULL,          -- create/update/delete/view
    entity_type VARCHAR(50) NOT NULL,          -- qr_code/transaction/settlement
    entity_id VARCHAR(100),
    
    -- User details
    user_id VARCHAR(100),
    user_name VARCHAR(255),
    user_role VARCHAR(50),
    
    -- Change details
    old_values JSON,
    new_values JSON,
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_action_type (action_type),
    INDEX idx_entity_type (entity_type),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at_audit (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Views for Reporting
-- =====================================================

-- Daily transaction summary view
CREATE OR REPLACE VIEW daily_transaction_summary AS
SELECT 
    DATE(transaction_date) as date,
    qr_id,
    merchant_name,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as successful_count,
    SUM(CASE WHEN status = 'FAILURE' THEN 1 ELSE 0 END) as failed_count,
    SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END) as total_amount,
    AVG(CASE WHEN status = 'SUCCESS' THEN amount ELSE NULL END) as avg_amount
FROM transactions
GROUP BY DATE(transaction_date), qr_id, merchant_name;

-- QR performance view
CREATE OR REPLACE VIEW qr_performance AS
SELECT 
    q.qr_identifier,
    q.merchant_name,
    q.reference_name,
    q.status,
    COUNT(t.id) as total_transactions,
    SUM(CASE WHEN t.status = 'SUCCESS' THEN 1 ELSE 0 END) as successful_transactions,
    SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END) as total_collection,
    AVG(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE NULL END) as avg_transaction_value,
    MAX(t.transaction_date) as last_transaction_date
FROM qr_codes q
LEFT JOIN transactions t ON q.qr_identifier = t.qr_id
GROUP BY q.qr_identifier, q.merchant_name, q.reference_name, q.status;

-- =====================================================
-- Stored Procedures
-- =====================================================

-- Procedure to update QR statistics after successful transaction
DELIMITER $$
CREATE PROCEDURE update_qr_statistics(
    IN p_qr_id VARCHAR(10),
    IN p_amount DECIMAL(10, 2),
    IN p_transaction_date TIMESTAMP
)
BEGIN
    UPDATE qr_codes 
    SET 
        successful_transactions = successful_transactions + 1,
        total_collection = total_collection + p_amount,
        last_transaction_date = p_transaction_date
    WHERE qr_identifier = p_qr_id;
END$$
DELIMITER ;

-- =====================================================
-- Triggers
-- =====================================================

-- Trigger to update QR statistics after successful transaction
DELIMITER $$
CREATE TRIGGER update_qr_stats_after_transaction
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    IF NEW.status = 'SUCCESS' THEN
        CALL update_qr_statistics(NEW.qr_id, NEW.amount, NEW.transaction_date);
    END IF;
END$$
DELIMITER ;

-- =====================================================
-- Sample Data (for testing)
-- =====================================================

-- Insert sample merchant config
INSERT INTO merchant_config (merchant_id, merchant_name, hdfc_merchant_id, vpa_prefix) 
VALUES 
    ('HDFC000010380443', 'SRS Live Technologies', 'HDFC000010380443', 'srs'),
    ('HDFC000010380444', 'ABC Store', 'HDFC000010380444', 'abc')
ON DUPLICATE KEY UPDATE merchant_name = VALUES(merchant_name);

-- Insert sample QR codes
INSERT INTO qr_codes (qr_identifier, merchant_id, merchant_name, merchant_prefix, reference_name, vpa, upi_string, status) 
VALUES 
    ('WIN25', 'HDFC000010380443', 'SRS Live Technologies', 'srs', 'Window Counter', 'sabpaisa.srswin25@hdfcbank', 'upi://pay?pa=sabpaisa.srswin25@hdfcbank&pn=SRS%20Live%20Technologies&mc=6012', 'active'),
    ('STR01', 'HDFC000010380444', 'ABC Store', 'abc', 'Store Front', 'sabpaisa.abcstr01@hdfcbank', 'upi://pay?pa=sabpaisa.abcstr01@hdfcbank&pn=ABC%20Store&mc=6012', 'active')
ON DUPLICATE KEY UPDATE reference_name = VALUES(reference_name);

-- =====================================================
-- Permissions (adjust based on your users)
-- =====================================================

-- Example for creating a user with appropriate permissions
-- CREATE USER IF NOT EXISTS 'sabpaisa_app'@'%' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON sabpaisa_qr.* TO 'sabpaisa_app'@'%';
-- FLUSH PRIVILEGES;

-- =====================================================
-- End of MySQL Schema
-- =====================================================