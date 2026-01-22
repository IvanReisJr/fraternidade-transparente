-- Enable UUID extension if we decided to use UUIDs, but we are using SERIAL as per common simple setups.
-- However, for a real production system, consider using UUIDs.

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'AUDITOR', 'USER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_action AS ENUM ('APPROVE', 'REJECT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create units table
CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    responsible_person VARCHAR(255)
);

-- Create cost_centers table
CREATE TABLE IF NOT EXISTS cost_centers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES units(id) ON DELETE SET NULL,
    cost_center_id INTEGER REFERENCES cost_centers(id) ON DELETE SET NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_cnpj VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    status transaction_status NOT NULL DEFAULT 'PENDING',
    invoice_url TEXT,
    receipt_url TEXT,
    created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    auditor_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
