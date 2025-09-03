# Database Schema Documentation - QR Solution

## Overview
The QR solution supports both **MySQL** and **PostgreSQL** databases. The current implementation uses **local JSON storage** for development but includes full database schema for production deployment.

## Current Storage Approach

### Development Mode (Currently Active)
- **Storage**: Local JSON files (`qr_codes.json`, `transactions.json`)
- **Location**: `/backend/data/` directory
- **Purpose**: Quick development and testing without database setup
- **Limitation**: Not suitable for production, no concurrent access support

### Production Mode (Ready to Deploy)
- **Primary**: MySQL 5.7+ or PostgreSQL 12+
- **Schema**: Fully defined in `/backend/config/database.js`
- **Migration**: Available in `/backend/migrations/`

## Database Tables for Bulk QR Feature

### 1. **bulk_qr_batches** (NEW)
Tracks batch processing for bulk QR generation.

| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | Primary key |
| batch_id | VARCHAR(50) | Unique batch identifier |
| batch_name | VARCHAR(255) | User-friendly batch name |
| total_count | INT | Total QRs to generate |
| successful_count | INT | Successfully generated |
| failed_count | INT | Failed generations |
| status | ENUM | pending/processing/completed/failed |
| created_by | VARCHAR(100) | User who initiated |
| processing_time_ms | INT | Time taken in milliseconds |
| error_details | JSON | Error information if any |
| created_at | TIMESTAMP | Creation time |
| completed_at | TIMESTAMP | Completion time |

**Indexes**: batch_id, status, created_at

### 2. **qr_codes** (ENHANCED)
Extended to support bulk QR features.

**New Columns Added:**
| Column | Type | Description |
|--------|------|-------------|
| batch_id | VARCHAR(50) | Links to bulk_qr_batches |
| reference_name | VARCHAR(255) | Display name for QR |
| description | TEXT | Payment description |
| mobile_number | VARCHAR(20) | Merchant mobile |
| email | VARCHAR(255) | Merchant email |
| address | TEXT | Merchant address |
| transaction_ref | VARCHAR(100) | UPI transaction reference |
| qr_image_data | MEDIUMTEXT | Base64 encoded QR image |
| upi_string | TEXT | Complete UPI string |
| vpa_handle | VARCHAR(50) | Bank handle (hdfc) |
| metadata | JSON | Additional custom data |

**Indexes**: batch_id, merchant_id, mobile_number, email

### 3. **qr_validations** (NEW)
Stores validation results for security tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | Primary key |
| qr_id | VARCHAR(50) | QR code reference |
| validation_type | ENUM | xss/sql_injection/email/mobile/amount |
| original_value | TEXT | Input before validation |
| sanitized_value | TEXT | Value after sanitization |
| is_valid | BOOLEAN | Validation result |
| validation_message | TEXT | Error/warning message |
| created_at | TIMESTAMP | Validation time |

**Indexes**: qr_id, validation_type, is_valid

### 4. **csv_upload_logs** (NEW)
Tracks CSV file uploads for bulk QR generation.

| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | Primary key |
| upload_id | VARCHAR(50) | Unique upload identifier |
| file_name | VARCHAR(255) | Original CSV filename |
| file_size_bytes | BIGINT | File size |
| total_rows | INT | Total rows in CSV |
| processed_rows | INT | Successfully processed |
| failed_rows | INT | Failed to process |
| batch_id | VARCHAR(50) | Associated batch |
| error_details | JSON | Processing errors |
| processing_status | ENUM | uploading/validating/processing/completed/failed |
| uploaded_by | VARCHAR(100) | User who uploaded |
| created_at | TIMESTAMP | Upload time |
| completed_at | TIMESTAMP | Processing completion |

**Indexes**: upload_id, batch_id, processing_status

### 5. **security_audit_log** (NEW)
Tracks security events and blocked attempts.

| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | Primary key |
| event_type | ENUM | xss_blocked/sql_injection_blocked/invalid_input |
| source_ip | VARCHAR(45) | Request IP address |
| user_agent | TEXT | Browser user agent |
| request_path | VARCHAR(255) | API endpoint |
| request_method | VARCHAR(10) | GET/POST/PUT/DELETE |
| blocked_content | TEXT | Malicious content blocked |
| sanitized_content | TEXT | Content after sanitization |
| threat_level | ENUM | low/medium/high/critical |
| batch_id | VARCHAR(50) | Related batch if any |
| qr_id | VARCHAR(50) | Related QR if any |
| created_at | TIMESTAMP | Event time |

**Indexes**: event_type, threat_level, created_at

## Database Relationships

```
bulk_qr_batches (1) -----> (*) qr_codes
       |                           |
       |                           |
       v                           v
csv_upload_logs             qr_validations
                                  |
                                  v
                          security_audit_log
```

## Migration Commands

### MySQL Setup
```sql
-- Run migration
mysql -u root -p sabpaisa_qr < backend/migrations/002_add_bulk_qr_tables.sql

-- Verify tables
SHOW TABLES;
DESCRIBE bulk_qr_batches;
DESCRIBE qr_codes;
```

### PostgreSQL Setup
```sql
-- Run migration
psql -U postgres -d sabpaisa_qr -f backend/migrations/002_add_bulk_qr_tables.sql

-- Verify tables
\dt
\d bulk_qr_batches
\d qr_codes
```

## Environment Configuration

### For MySQL
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sabpaisa_qr
DB_USER=root
DB_PASSWORD=yourpassword
```

### For PostgreSQL
```env
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sabpaisa_qr
DB_USER=postgres
DB_PASSWORD=yourpassword
```

## Switching from JSON to Database

### Current Implementation (JSON)
```javascript
// backend/services/LocalTransactionStore.js
const data = JSON.parse(fs.readFileSync('qr_codes.json'));
```

### Database Implementation (Ready)
```javascript
// backend/config/database.js
const { db } = require('./config/database');
await db.connect();
```

To switch to database:
1. Set database environment variables
2. Run migration scripts
3. Update `backend/routes/bulkQR.js` to use database instead of LocalTransactionStore
4. The database.js file already has all necessary methods

## Performance Considerations

### Indexes Created
- All foreign keys are indexed
- Search fields (merchant_id, email, mobile) are indexed
- Status and date fields for filtering are indexed

### Storage Estimates
- QR image (base64): ~5KB per QR
- 1000 QRs: ~5MB storage
- 100,000 QRs: ~500MB storage

### Query Optimization
- Batch inserts for bulk QR creation
- Pagination for large result sets
- Connection pooling enabled

## Backup Strategy

### JSON Files (Current)
```bash
# Backup
cp backend/data/*.json backup/

# Restore
cp backup/*.json backend/data/
```

### Database (Production)
```bash
# MySQL Backup
mysqldump -u root -p sabpaisa_qr > backup_$(date +%Y%m%d).sql

# PostgreSQL Backup
pg_dump -U postgres sabpaisa_qr > backup_$(date +%Y%m%d).sql
```

## Security Features

1. **Input Sanitization**: All inputs sanitized before storage
2. **SQL Injection Prevention**: Parameterized queries used
3. **Audit Trail**: Security events logged in security_audit_log
4. **Validation Tracking**: All validations recorded in qr_validations

## Future Enhancements

1. **MongoDB Support**: NoSQL option for high-scale deployments
2. **Redis Caching**: For frequently accessed QR codes
3. **Partitioning**: Date-based partitioning for transactions table
4. **Archival**: Move old QR codes to archive tables

---

## Summary

The database schema has been **fully updated** to support the Bulk QR feature with:
- ✅ New tables for batch processing
- ✅ Enhanced QR codes table with additional fields
- ✅ Security and validation tracking
- ✅ CSV upload logging
- ✅ Full support for both MySQL and PostgreSQL

The system currently uses JSON files for simplicity but is **production-ready** to switch to a proper database with a simple configuration change.