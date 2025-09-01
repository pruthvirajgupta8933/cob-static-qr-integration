-- =====================================================
-- Static QR Feature - Database Schema
-- Version: 1.0
-- Date: 2025-09-01
-- Database: PostgreSQL 14+
-- =====================================================

-- Create database (if not exists)
-- CREATE DATABASE sabpaisa_qr;

-- Use the database
-- \c sabpaisa_qr;

-- =====================================================
-- 1. QR Codes Table - Stores generated QR information
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_codes (
    id SERIAL PRIMARY KEY,
    qr_identifier VARCHAR(10) UNIQUE NOT NULL,  -- Unique 5-char identifier (e.g., WIN25)
    merchant_id VARCHAR(50) NOT NULL,           -- HDFC Merchant ID
    merchant_name VARCHAR(255) NOT NULL,        -- Company name
    merchant_prefix VARCHAR(3) NOT NULL,        -- 3-char prefix (e.g., 'srs')
    reference_name VARCHAR(255) NOT NULL,       -- Display name for QR
    description TEXT,                            -- QR description
    category VARCHAR(50),                       -- Category (retail, restaurant, etc.)
    vpa VARCHAR(255) UNIQUE NOT NULL,          -- Generated VPA (sabpaisa.srswin25@hdfcbank)
    upi_string TEXT NOT NULL,                   -- Complete UPI string for QR
    qr_image_data TEXT,                         -- Base64 QR image
    qr_type VARCHAR(20) DEFAULT 'static',      -- static/dynamic
    max_amount DECIMAL(10, 2),                 -- Max amount (for fixed QR)
    min_amount DECIMAL(10, 2) DEFAULT 1.00,    -- Min amount
    status VARCHAR(20) DEFAULT 'active',       -- active/inactive/suspended
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Design configuration
    design_config JSONB DEFAULT '{}',          -- Stores logo, colors, template info
    
    -- Statistics
    total_scans INTEGER DEFAULT 0,
    successful_transactions INTEGER DEFAULT 0,
    total_collection DECIMAL(15, 2) DEFAULT 0.00,
    last_transaction_date TIMESTAMP,
    
    -- Metadata
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    CONSTRAINT check_status CHECK (status IN ('active', 'inactive', 'suspended')),
    CONSTRAINT check_qr_type CHECK (qr_type IN ('static', 'dynamic'))
);

-- Create indexes for faster queries
CREATE INDEX idx_qr_identifier ON qr_codes(qr_identifier);
CREATE INDEX idx_merchant_id ON qr_codes(merchant_id);
CREATE INDEX idx_merchant_name ON qr_codes(merchant_name);
CREATE INDEX idx_vpa ON qr_codes(vpa);
CREATE INDEX idx_status ON qr_codes(status);
CREATE INDEX idx_created_at ON qr_codes(created_at);

-- =====================================================
-- 2. Transactions Table - Payment transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,  -- Unique transaction ID
    qr_id VARCHAR(10),                           -- Links to qr_codes.qr_identifier
    qr_code_id INTEGER REFERENCES qr_codes(id),  -- Foreign key to qr_codes
    
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
    transaction_date TIMESTAMP NOT NULL,
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
    device_info JSONB,
    
    -- Raw response storage
    raw_request TEXT,
    raw_response TEXT,
    webhook_payload JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_txn_status CHECK (status IN ('SUCCESS', 'FAILURE', 'PENDING', 'REFUNDED', 'CANCELLED'))
);

-- Create indexes
CREATE INDEX idx_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_qr_id ON transactions(qr_id);
CREATE INDEX idx_merchant_txn_id ON transactions(merchant_txn_id);
CREATE INDEX idx_bank_rrn ON transactions(bank_rrn);
CREATE INDEX idx_status_txn ON transactions(status);
CREATE INDEX idx_payer_vpa ON transactions(payer_vpa);
CREATE INDEX idx_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_created_at_txn ON transactions(created_at);

-- =====================================================
-- 3. Webhook Logs Table - Track all webhook calls
-- =====================================================
CREATE TABLE IF NOT EXISTS webhook_logs (
    id SERIAL PRIMARY KEY,
    webhook_id UUID DEFAULT gen_random_uuid(),
    
    -- Request information
    endpoint VARCHAR(255),
    method VARCHAR(10),
    headers JSONB,
    request_body TEXT,
    encrypted_data TEXT,
    
    -- Response information
    response_status INTEGER,
    response_body TEXT,
    
    -- Processing details
    processing_status VARCHAR(50),               -- received/processing/processed/failed
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    
    CONSTRAINT check_processing_status CHECK (processing_status IN ('received', 'processing', 'processed', 'failed', 'retry'))
);

CREATE INDEX idx_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX idx_processing_status ON webhook_logs(processing_status);
CREATE INDEX idx_created_at_webhook ON webhook_logs(created_at);

-- =====================================================
-- 4. Settlement Report Table
-- =====================================================
CREATE TABLE IF NOT EXISTS settlements (
    id SERIAL PRIMARY KEY,
    settlement_id VARCHAR(100) UNIQUE NOT NULL,
    merchant_id VARCHAR(50) NOT NULL,
    merchant_name VARCHAR(255),
    
    -- Settlement details
    settlement_date DATE NOT NULL,
    settlement_amount DECIMAL(15, 2) NOT NULL,
    transaction_count INTEGER,
    
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
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settlement_id ON settlements(settlement_id);
CREATE INDEX idx_merchant_id_settlement ON settlements(merchant_id);
CREATE INDEX idx_settlement_date ON settlements(settlement_date);
CREATE INDEX idx_status_settlement ON settlements(status);

-- =====================================================
-- 5. QR Scan Analytics Table
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_scan_analytics (
    id SERIAL PRIMARY KEY,
    qr_code_id INTEGER REFERENCES qr_codes(id),
    qr_identifier VARCHAR(10),
    
    -- Scan details
    scan_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scan_location JSONB,                        -- GPS coordinates if available
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
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_qr_code_id_analytics ON qr_scan_analytics(qr_code_id);
CREATE INDEX idx_scan_timestamp ON qr_scan_analytics(scan_timestamp);
CREATE INDEX idx_scan_result ON qr_scan_analytics(scan_result);

-- =====================================================
-- 6. Refunds Table
-- =====================================================
CREATE TABLE IF NOT EXISTS refunds (
    id SERIAL PRIMARY KEY,
    refund_id VARCHAR(100) UNIQUE NOT NULL,
    transaction_id VARCHAR(255) REFERENCES transactions(transaction_id),
    
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
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Metadata
    initiated_by VARCHAR(100),
    approved_by VARCHAR(100),
    remarks TEXT
);

CREATE INDEX idx_refund_id ON refunds(refund_id);
CREATE INDEX idx_transaction_id_refund ON refunds(transaction_id);
CREATE INDEX idx_status_refund ON refunds(status);

-- =====================================================
-- 7. Merchant Configuration Table
-- =====================================================
CREATE TABLE IF NOT EXISTS merchant_config (
    id SERIAL PRIMARY KEY,
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
    features JSONB DEFAULT '{}',               -- Feature flags
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_merchant_id_config ON merchant_config(merchant_id);
CREATE INDEX idx_hdfc_merchant_id ON merchant_config(hdfc_merchant_id);

-- =====================================================
-- 8. Audit Log Table
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    
    -- Action details
    action_type VARCHAR(50) NOT NULL,          -- create/update/delete/view
    entity_type VARCHAR(50) NOT NULL,          -- qr_code/transaction/settlement
    entity_id VARCHAR(100),
    
    -- User details
    user_id VARCHAR(100),
    user_name VARCHAR(255),
    user_role VARCHAR(50),
    
    -- Change details
    old_values JSONB,
    new_values JSONB,
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_action_type ON audit_logs(action_type);
CREATE INDEX idx_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_user_id ON audit_logs(user_id);
CREATE INDEX idx_created_at_audit ON audit_logs(created_at);

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
-- Functions and Triggers
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON qr_codes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settlements_updated_at BEFORE UPDATE ON settlements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_config_updated_at BEFORE UPDATE ON merchant_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update QR statistics after successful transaction
CREATE OR REPLACE FUNCTION update_qr_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'SUCCESS' THEN
        UPDATE qr_codes 
        SET 
            successful_transactions = successful_transactions + 1,
            total_collection = total_collection + NEW.amount,
            last_transaction_date = NEW.transaction_date
        WHERE qr_identifier = NEW.qr_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_qr_stats_after_transaction 
    AFTER INSERT ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_qr_statistics();

-- =====================================================
-- Sample Data (for testing)
-- =====================================================

-- Insert sample merchant config
INSERT INTO merchant_config (merchant_id, merchant_name, hdfc_merchant_id, vpa_prefix) 
VALUES 
    ('HDFC000010380443', 'SRS Live Technologies', 'HDFC000010380443', 'srs'),
    ('HDFC000010380444', 'ABC Store', 'HDFC000010380444', 'abc')
ON CONFLICT (merchant_id) DO NOTHING;

-- Insert sample QR codes
INSERT INTO qr_codes (qr_identifier, merchant_id, merchant_name, merchant_prefix, reference_name, vpa, upi_string, status) 
VALUES 
    ('WIN25', 'HDFC000010380443', 'SRS Live Technologies', 'srs', 'Window Counter', 'sabpaisa.srswin25@hdfcbank', 'upi://pay?pa=sabpaisa.srswin25@hdfcbank&pn=SRS%20Live%20Technologies&mc=6012', 'active'),
    ('STR01', 'HDFC000010380444', 'ABC Store', 'abc', 'Store Front', 'sabpaisa.abcstr01@hdfcbank', 'upi://pay?pa=sabpaisa.abcstr01@hdfcbank&pn=ABC%20Store&mc=6012', 'active')
ON CONFLICT (qr_identifier) DO NOTHING;

-- =====================================================
-- Permissions (adjust based on your users)
-- =====================================================

-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO sabpaisa_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sabpaisa_app;

-- =====================================================
-- End of Schema
-- =====================================================