-- =====================================================
-- Static QR Feature - MySQL Database Schema (COB Integrated)
-- Version: 2.0
-- Date: 2025-09-02
-- Database: MySQL 8.0+ (Compatible with existing COB)
-- =====================================================

-- This schema is designed to integrate with existing COB database
-- It references existing merchant_data table (merchantId)

USE cob1;  -- Use existing COB database

-- =====================================================
-- 1. QR Codes Table - Stores generated QR information
-- Links to existing merchant_data table via merchantId
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_codes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    qr_identifier VARCHAR(10) UNIQUE NOT NULL,       -- Unique identifier (e.g., WIN25)
    merchantId INT NOT NULL,                         -- Links to existing merchant_data.merchantId
    merchant_name VARCHAR(255) NOT NULL,             -- Denormalized for performance
    merchant_prefix VARCHAR(3) NOT NULL,             -- 3-char prefix from merchant name
    reference_name VARCHAR(255) NOT NULL,            -- Display name for QR
    description TEXT,
    category VARCHAR(50),
    vpa VARCHAR(255) UNIQUE NOT NULL,               -- Generated VPA
    upi_string TEXT NOT NULL,                       -- Complete UPI string
    qr_image_data LONGTEXT,                         -- Base64 QR image
    qr_type ENUM('static', 'dynamic') DEFAULT 'static',
    max_amount DECIMAL(10, 2),
    min_amount DECIMAL(10, 2) DEFAULT 1.00,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    is_deleted TINYINT(1) DEFAULT 0,
    
    -- Design configuration
    design_config JSON,
    
    -- Statistics
    total_scans INT DEFAULT 0,
    successful_transactions INT DEFAULT 0,
    failed_transactions INT DEFAULT 0,
    total_collection DECIMAL(15, 2) DEFAULT 0.00,
    last_transaction_date DATETIME,
    
    -- Audit fields (matching COB pattern)
    created_by INT,                                 -- References login_master_id
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_by INT,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key to existing merchant table
    CONSTRAINT fk_qr_merchant FOREIGN KEY (merchantId) 
        REFERENCES merchant_data(merchantId) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_qr_identifier (qr_identifier),
    INDEX idx_merchantId (merchantId),
    INDEX idx_vpa (vpa),
    INDEX idx_status (status),
    INDEX idx_created_date (created_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 2. QR Transactions Table - Payment transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_transactions (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    qr_code_id INT NOT NULL,
    qr_identifier VARCHAR(10),
    merchantId INT NOT NULL,
    
    -- Transaction details
    merchant_txn_id VARCHAR(255),
    bank_rrn VARCHAR(255),
    hdfc_transaction_id VARCHAR(255),
    
    -- Payment information
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status ENUM('SUCCESS', 'FAILURE', 'PENDING', 'REFUNDED', 'CANCELLED') DEFAULT 'PENDING',
    status_code VARCHAR(10),
    status_description TEXT,
    
    -- Payer information
    payer_vpa VARCHAR(255),
    payer_name VARCHAR(255),
    payer_mobile VARCHAR(20),
    payer_account VARCHAR(50),
    
    -- Transaction metadata
    transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    settlement_date DATE,
    settlement_amount DECIMAL(10, 2),
    payment_mode VARCHAR(50),
    payment_app VARCHAR(50),
    
    -- HDFC specific fields
    mcc VARCHAR(10),
    tip_amount DECIMAL(10, 2) DEFAULT 0,
    convenience_fee DECIMAL(10, 2) DEFAULT 0,
    net_amount DECIMAL(10, 2),
    
    -- Security
    checksum VARCHAR(255),
    ip_address VARCHAR(45),
    device_info JSON,
    
    -- Raw data storage
    raw_request TEXT,
    raw_response TEXT,
    webhook_payload JSON,
    
    -- Timestamps
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_qr_transaction_qr FOREIGN KEY (qr_code_id) 
        REFERENCES qr_codes(id) ON DELETE CASCADE,
    CONSTRAINT fk_qr_transaction_merchant FOREIGN KEY (merchantId) 
        REFERENCES merchant_data(merchantId) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_qr_identifier_txn (qr_identifier),
    INDEX idx_merchantId_txn (merchantId),
    INDEX idx_bank_rrn (bank_rrn),
    INDEX idx_status_txn (status),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_settlement_date (settlement_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 3. QR Webhook Logs Table
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_webhook_logs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
    processing_status ENUM('received', 'processing', 'processed', 'failed', 'retry') DEFAULT 'received',
    error_message TEXT,
    retry_count INT DEFAULT 0,
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_date DATETIME,
    
    INDEX idx_webhook_id (webhook_id),
    INDEX idx_processing_status (processing_status),
    INDEX idx_created_date_webhook (created_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 4. QR Settlement Report Table
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_settlements (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    settlement_id VARCHAR(100) UNIQUE NOT NULL,
    merchantId INT NOT NULL,
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
    
    -- Bank details (links to api_client_account_details)
    account_id INT,
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    utr_number VARCHAR(50),
    
    -- Status
    status ENUM('pending', 'processing', 'settled', 'failed') DEFAULT 'pending',
    remarks TEXT,
    
    -- Timestamps
    processed_date DATETIME,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_qr_settlement_merchant FOREIGN KEY (merchantId) 
        REFERENCES merchant_data(merchantId) ON DELETE CASCADE,
    
    INDEX idx_settlement_id (settlement_id),
    INDEX idx_merchantId_settlement (merchantId),
    INDEX idx_settlement_date (settlement_date),
    INDEX idx_status_settlement (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 5. QR Refunds Table
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_refunds (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    refund_id VARCHAR(100) UNIQUE NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    merchantId INT NOT NULL,
    
    -- Refund details
    original_amount DECIMAL(10, 2),
    refund_amount DECIMAL(10, 2),
    refund_reason TEXT,
    refund_type ENUM('full', 'partial') DEFAULT 'full',
    
    -- Status tracking
    status ENUM('initiated', 'processing', 'completed', 'failed') DEFAULT 'initiated',
    status_message TEXT,
    
    -- Bank details
    bank_reference VARCHAR(100),
    refund_rrn VARCHAR(100),
    
    -- Timestamps
    initiated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_date DATETIME,
    completed_date DATETIME,
    
    -- Metadata
    initiated_by INT,  -- References login_master_id
    approved_by INT,   -- References login_master_id
    remarks TEXT,
    
    -- Foreign keys
    CONSTRAINT fk_qr_refund_transaction FOREIGN KEY (transaction_id) 
        REFERENCES qr_transactions(transaction_id) ON DELETE CASCADE,
    CONSTRAINT fk_qr_refund_merchant FOREIGN KEY (merchantId) 
        REFERENCES merchant_data(merchantId) ON DELETE CASCADE,
    
    INDEX idx_refund_id (refund_id),
    INDEX idx_transaction_id_refund (transaction_id),
    INDEX idx_merchantId_refund (merchantId),
    INDEX idx_status_refund (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 6. QR Merchant Configuration (extends existing merchant_data)
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_merchant_config (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    merchantId INT UNIQUE NOT NULL,
    
    -- HDFC Configuration
    hdfc_merchant_id VARCHAR(50),
    hdfc_merchant_key VARCHAR(255),  -- Encrypted
    hdfc_terminal_id VARCHAR(50),
    
    -- VPA Configuration
    vpa_prefix VARCHAR(3),  -- Merchant-specific prefix
    vpa_handle VARCHAR(50) DEFAULT '@hdfcbank',
    
    -- QR Settings
    qr_auto_generate TINYINT(1) DEFAULT 0,
    qr_default_template VARCHAR(50),
    qr_max_per_day INT DEFAULT 100,
    qr_require_approval TINYINT(1) DEFAULT 0,
    
    -- Limits
    daily_transaction_limit DECIMAL(15, 2),
    monthly_transaction_limit DECIMAL(15, 2),
    per_transaction_limit DECIMAL(10, 2),
    
    -- Webhook Configuration
    webhook_url VARCHAR(500),
    callback_url VARCHAR(500),
    webhook_secret VARCHAR(255),  -- For webhook verification
    
    -- Features (JSON flags)
    features JSON,
    
    -- Status
    is_active TINYINT(1) DEFAULT 1,
    is_verified TINYINT(1) DEFAULT 0,
    verification_date DATETIME,
    verified_by INT,  -- References login_master_id
    
    -- Timestamps
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key to existing merchant table
    CONSTRAINT fk_qr_config_merchant FOREIGN KEY (merchantId) 
        REFERENCES merchant_data(merchantId) ON DELETE CASCADE,
    
    INDEX idx_merchantId_config (merchantId),
    INDEX idx_hdfc_merchant_id (hdfc_merchant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Views for Reporting (matching COB patterns)
-- =====================================================

-- Daily transaction summary view
CREATE OR REPLACE VIEW qr_daily_summary AS
SELECT 
    DATE(qt.transaction_date) as transaction_date,
    qt.merchantId,
    md.name as merchant_name,
    qc.qr_identifier,
    qc.reference_name,
    COUNT(qt.id) as total_transactions,
    SUM(CASE WHEN qt.status = 'SUCCESS' THEN 1 ELSE 0 END) as successful_count,
    SUM(CASE WHEN qt.status = 'FAILURE' THEN 1 ELSE 0 END) as failed_count,
    SUM(CASE WHEN qt.status = 'SUCCESS' THEN qt.amount ELSE 0 END) as total_amount,
    AVG(CASE WHEN qt.status = 'SUCCESS' THEN qt.amount ELSE NULL END) as avg_amount
FROM qr_transactions qt
JOIN qr_codes qc ON qt.qr_code_id = qc.id
JOIN merchant_data md ON qt.merchantId = md.merchantId
GROUP BY DATE(qt.transaction_date), qt.merchantId, md.name, qc.qr_identifier, qc.reference_name;

-- Merchant QR performance view
CREATE OR REPLACE VIEW qr_merchant_performance AS
SELECT 
    md.merchantId,
    md.name as merchant_name,
    COUNT(DISTINCT qc.id) as total_qr_codes,
    COUNT(DISTINCT CASE WHEN qc.status = 'active' THEN qc.id END) as active_qr_codes,
    COUNT(qt.id) as total_transactions,
    SUM(CASE WHEN qt.status = 'SUCCESS' THEN qt.amount ELSE 0 END) as total_collection,
    AVG(CASE WHEN qt.status = 'SUCCESS' THEN qt.amount ELSE NULL END) as avg_transaction_value,
    MAX(qt.transaction_date) as last_transaction_date
FROM merchant_data md
LEFT JOIN qr_codes qc ON md.merchantId = qc.merchantId
LEFT JOIN qr_transactions qt ON qc.id = qt.qr_code_id
GROUP BY md.merchantId, md.name;

-- =====================================================
-- Stored Procedures
-- =====================================================

DELIMITER $$

-- Procedure to update QR statistics after transaction
CREATE PROCEDURE sp_update_qr_statistics(
    IN p_qr_code_id INT,
    IN p_status VARCHAR(20),
    IN p_amount DECIMAL(10, 2),
    IN p_transaction_date DATETIME
)
BEGIN
    IF p_status = 'SUCCESS' THEN
        UPDATE qr_codes 
        SET 
            successful_transactions = successful_transactions + 1,
            total_collection = total_collection + p_amount,
            last_transaction_date = p_transaction_date
        WHERE id = p_qr_code_id;
    ELSEIF p_status = 'FAILURE' THEN
        UPDATE qr_codes 
        SET 
            failed_transactions = failed_transactions + 1,
            last_transaction_date = p_transaction_date
        WHERE id = p_qr_code_id;
    END IF;
END$$

-- Procedure to get merchant QR summary
CREATE PROCEDURE sp_get_merchant_qr_summary(
    IN p_merchantId INT,
    IN p_from_date DATE,
    IN p_to_date DATE
)
BEGIN
    SELECT 
        COUNT(DISTINCT qc.id) as total_qr_codes,
        COUNT(DISTINCT CASE WHEN qc.status = 'active' THEN qc.id END) as active_qr_codes,
        COUNT(qt.id) as total_transactions,
        SUM(CASE WHEN qt.status = 'SUCCESS' THEN 1 ELSE 0 END) as successful_transactions,
        SUM(CASE WHEN qt.status = 'SUCCESS' THEN qt.amount ELSE 0 END) as total_collection,
        AVG(CASE WHEN qt.status = 'SUCCESS' THEN qt.amount ELSE NULL END) as avg_transaction_value
    FROM qr_codes qc
    LEFT JOIN qr_transactions qt ON qc.id = qt.qr_code_id
        AND DATE(qt.transaction_date) BETWEEN p_from_date AND p_to_date
    WHERE qc.merchantId = p_merchantId;
END$$

DELIMITER ;

-- =====================================================
-- Triggers
-- =====================================================

DELIMITER $$

-- Trigger to update QR statistics after transaction insert
CREATE TRIGGER trg_after_qr_transaction_insert
AFTER INSERT ON qr_transactions
FOR EACH ROW
BEGIN
    CALL sp_update_qr_statistics(NEW.qr_code_id, NEW.status, NEW.amount, NEW.transaction_date);
END$$

-- Trigger to generate merchant prefix when config is created
CREATE TRIGGER trg_before_qr_config_insert
BEFORE INSERT ON qr_merchant_config
FOR EACH ROW
BEGIN
    DECLARE merchant_name VARCHAR(255);
    DECLARE prefix VARCHAR(3);
    
    IF NEW.vpa_prefix IS NULL THEN
        SELECT name INTO merchant_name FROM merchant_data WHERE merchantId = NEW.merchantId;
        
        -- Generate prefix from merchant name (first letter of first 3 words)
        -- This is simplified - in production, use a function
        SET prefix = LOWER(LEFT(REPLACE(merchant_name, ' ', ''), 3));
        SET NEW.vpa_prefix = prefix;
    END IF;
END$$

DELIMITER ;

-- =====================================================
-- Initial Data / Migration Support
-- =====================================================

-- Migrate existing merchants to QR config (if needed)
INSERT INTO qr_merchant_config (merchantId, hdfc_merchant_id, vpa_prefix, is_active)
SELECT 
    merchantId,
    CONCAT('HDFC', LPAD(merchantId, 12, '0')) as hdfc_merchant_id,
    LOWER(LEFT(REPLACE(name, ' ', ''), 3)) as vpa_prefix,
    1 as is_active
FROM merchant_data
WHERE merchantId NOT IN (SELECT merchantId FROM qr_merchant_config)
LIMIT 10;  -- Remove LIMIT for production

-- =====================================================
-- Permissions (adjust based on your users)
-- =====================================================

-- Grant permissions to application user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON cob1.qr_* TO 'sabpaisa_app'@'%';
-- GRANT EXECUTE ON PROCEDURE cob1.sp_* TO 'sabpaisa_app'@'%';
-- FLUSH PRIVILEGES;

-- =====================================================
-- End of COB-Integrated MySQL Schema
-- =====================================================