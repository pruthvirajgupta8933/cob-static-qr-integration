# Database Configuration Guide

## Database Support

This application supports both **MySQL** (default) and **PostgreSQL** databases.

## MySQL Setup (Recommended)

### 1. Install MySQL
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server

# macOS
brew install mysql
brew services start mysql

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
```

### 2. Create Database and User
```sql
mysql -u root -p

-- Create database
CREATE DATABASE sabpaisa_qr;

-- Create user
CREATE USER 'sabpaisa_app'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON sabpaisa_qr.* TO 'sabpaisa_app'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### 3. Import Schema
```bash
mysql -u sabpaisa_app -p sabpaisa_qr < database-schema-mysql.sql
```

### 4. Configure Environment Variables
Create `backend/.env`:
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sabpaisa_qr
DB_USER=sabpaisa_app
DB_PASSWORD=your_secure_password
```

## PostgreSQL Setup (Alternative)

### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql
```

### 2. Create Database and User
```sql
sudo -u postgres psql

-- Create database
CREATE DATABASE sabpaisa_qr;

-- Create user
CREATE USER sabpaisa_app WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sabpaisa_qr TO sabpaisa_app;

\q
```

### 3. Import Schema
```bash
psql -U sabpaisa_app -d sabpaisa_qr -f database-schema.sql
```

### 4. Configure Environment Variables
Create `backend/.env`:
```env
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sabpaisa_qr
DB_USER=sabpaisa_app
DB_PASSWORD=your_secure_password
```

## Database Files

- **`database-schema-mysql.sql`** - MySQL schema (recommended for production)
- **`database-schema.sql`** - PostgreSQL schema (alternative option)

## Key Differences

### MySQL Features Used
- `AUTO_INCREMENT` for primary keys
- `JSON` data type for storing complex objects
- `LONGTEXT` for base64 QR image storage
- `ON UPDATE CURRENT_TIMESTAMP` for automatic timestamp updates
- InnoDB storage engine with utf8mb4 charset

### PostgreSQL Features (if used)
- `SERIAL` for primary keys
- `JSONB` for better JSON performance
- `TEXT` for unlimited text storage
- Trigger functions for timestamp updates

## Connection Testing

Test your database connection:
```bash
# MySQL
mysql -u sabpaisa_app -p -e "SELECT VERSION();"

# PostgreSQL
psql -U sabpaisa_app -d sabpaisa_qr -c "SELECT version();"
```

## Important Notes

1. **Default Database**: The application defaults to MySQL. No changes needed if using MySQL.

2. **Switching Databases**: To use PostgreSQL instead, simply set `DB_TYPE=postgresql` in your environment variables.

3. **Compatibility**: The application code is database-agnostic and works with both databases without modification.

4. **Production Recommendation**: MySQL is recommended for production as it's the primary tested database.

5. **Migration**: If switching databases later, export data using standard SQL dumps and import into the new database.

## Troubleshooting

### MySQL Connection Issues
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u sabpaisa_app -p -h localhost sabpaisa_qr
```

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U sabpaisa_app -h localhost sabpaisa_qr
```

### Common Errors

1. **Access denied**: Check username, password, and privileges
2. **Connection refused**: Ensure database service is running
3. **Unknown database**: Create the database first
4. **Syntax error**: Use the correct schema file for your database type